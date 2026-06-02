import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from auth_utils import require_auth
from models import db, User, Coach, Conversation, Message
from comms_service import get_or_create_conversation, add_message

msg_bp = Blueprint("messages", __name__)
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "messages")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _me():
    ident = request.identity
    role = ident["role"]
    if role == "athlete":
        return "athlete", int(ident["id"])
    if role == "coach":
        return "coach", int(ident["id"])
    return "admin", int(ident["id"])


def _conv_matches(conv, me_type, me_id):
    return (
        (conv.participantA_type == me_type and conv.participantA_id == me_id) or
        (conv.participantB_type == me_type and conv.participantB_id == me_id)
    )


def _counterparty(conv, me_type, me_id):
    if conv.participantA_type == me_type and conv.participantA_id == me_id:
        return conv.participantB_type, conv.participantB_id
    return conv.participantA_type, conv.participantA_id


@msg_bp.route("/api/conversations", methods=["GET"])
@require_auth()
def list_conversations():
    me_type, me_id = _me()
    rows = Conversation.query.order_by(Conversation.last_updated.desc()).all()
    result = []
    for c in rows:
        if not _conv_matches(c, me_type, me_id):
            continue
        other_type, other_id = _counterparty(c, me_type, me_id)
        name = "Admin"
        if other_type == "athlete":
            u = User.query.get(other_id)
            name = u.full_name if u else "Athlete"
        elif other_type == "coach":
            co = Coach.query.get(other_id)
            name = co.full_name if co else "Coach"
        unread = Message.query.filter_by(
            conversation_id=c.id, receiver_type=me_type, receiver_id=me_id, read_status=False
        ).count()
        result.append({
            "id": c.id,
            "other_type": other_type,
            "other_id": other_id,
            "other_name": name,
            "last_message": c.last_message,
            "last_updated": c.last_updated.isoformat() if c.last_updated else None,
            "unread": unread,
        })
    return jsonify(result)


@msg_bp.route("/api/conversations/start", methods=["POST"])
@require_auth()
def start_conversation():
    me_type, me_id = _me()
    data = request.json or {}
    other_type = data.get("other_type")
    other_id = int(data.get("other_id"))
    conv = get_or_create_conversation(me_type, me_id, other_type, other_id)
    return jsonify({"id": conv.id})


@msg_bp.route("/api/conversations/<int:conversation_id>/messages", methods=["GET"])
@require_auth()
def get_messages(conversation_id):
    me_type, me_id = _me()
    conv = Conversation.query.get(conversation_id)
    if not conv or not _conv_matches(conv, me_type, me_id):
        return jsonify({"error": "Conversation not found"}), 404
    limit = min(max(int(request.args.get("limit", 50)), 1), 200)
    rows = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.timestamp.desc()).limit(limit).all()
    rows = list(reversed(rows))
    return jsonify([{
        "id": m.id, "conversation_id": m.conversation_id, "sender_type": m.sender_type,
        "sender_id": m.sender_id, "receiver_type": m.receiver_type, "receiver_id": m.receiver_id,
        "content": m.content, "attachment_path": m.attachment_path, "read_status": m.read_status,
        "delivered_status": m.delivered_status, "timestamp": m.timestamp.isoformat(),
    } for m in rows])


@msg_bp.route("/api/conversations/<int:conversation_id>/messages", methods=["POST"])
@require_auth()
def post_message(conversation_id):
    me_type, me_id = _me()
    conv = Conversation.query.get(conversation_id)
    if not conv or not _conv_matches(conv, me_type, me_id):
        return jsonify({"error": "Conversation not found"}), 404
    other_type, other_id = _counterparty(conv, me_type, me_id)
    data = request.json or {}
    msg = add_message(
        conversation_id=conversation_id,
        sender_type=me_type,
        sender_id=me_id,
        receiver_type=other_type,
        receiver_id=other_id,
        content=data.get("content", ""),
        attachment_path=data.get("attachment_path"),
    )
    return jsonify({"success": True, "message_id": msg.id})


@msg_bp.route("/api/messages/<int:message_id>/read", methods=["POST"])
@require_auth()
def mark_message_read(message_id):
    me_type, me_id = _me()
    msg = Message.query.filter_by(id=message_id, receiver_type=me_type, receiver_id=me_id).first()
    if not msg:
        return jsonify({"error": "Message not found"}), 404
    msg.read_status = True
    db.session.commit()
    return jsonify({"success": True})


@msg_bp.route("/api/messages/upload", methods=["POST"])
@require_auth()
def upload_attachment():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "Invalid file"}), 400
    filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{secure_filename(f.filename)}"
    path = os.path.join(UPLOAD_DIR, filename)
    f.save(path)
    rel = f"/uploads/messages/{filename}"
    return jsonify({"success": True, "attachment_path": rel})


@msg_bp.route("/api/users/search", methods=["POST"])
@require_auth()
def search_users():
    data = request.json or {}
    q = (data.get("query") or "").strip().lower()
    if not q:
        return jsonify([])
    athletes = User.query.filter(User.full_name.ilike(f"%{q}%")).limit(10).all()
    coaches = Coach.query.filter(Coach.full_name.ilike(f"%{q}%")).limit(10).all()
    result = [{
        "type": "athlete", "id": a.id, "name": a.full_name, "subtitle": a.sports_interest
    } for a in athletes]
    result += [{
        "type": "coach", "id": c.id, "name": c.full_name, "subtitle": c.specialization
    } for c in coaches]
    return jsonify(result[:20])
