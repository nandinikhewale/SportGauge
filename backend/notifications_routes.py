from datetime import datetime
from flask import Blueprint, request, jsonify
from models import Notification, db
from auth_utils import require_auth

noti_bp = Blueprint("notifications", __name__)


def _identity():
    ident = request.identity
    role_map = {"athlete": "athlete", "coach": "coach", "admin": "admin"}
    return role_map.get(ident["role"], ident["type"]), int(ident["id"])


@noti_bp.route("/api/notifications", methods=["GET"])
@require_auth()
def list_notifications():
    recipient_type, recipient_id = _identity()
    q = Notification.query.filter_by(recipient_type=recipient_type, recipient_id=recipient_id)
    category = request.args.get("category")
    ntype = request.args.get("type")
    unread_only = request.args.get("filter") == "unread"
    if category:
        q = q.filter_by(category=category)
    if ntype:
        q = q.filter_by(type=ntype)
    if unread_only:
        q = q.filter_by(read_status=False)
    page = max(int(request.args.get("page", 1)), 1)
    limit = min(max(int(request.args.get("limit", 20)), 1), 100)
    rows = q.order_by(Notification.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return jsonify([{
        "id": n.id, "title": n.title, "message": n.message, "type": n.type,
        "category": n.category, "read_status": n.read_status,
        "created_at": n.created_at.isoformat(),
    } for n in rows])


@noti_bp.route("/api/notifications/unread_count", methods=["GET"])
@require_auth()
def unread_count():
    recipient_type, recipient_id = _identity()
    count = Notification.query.filter_by(
        recipient_type=recipient_type, recipient_id=recipient_id, read_status=False
    ).count()
    return jsonify({"unread": count})


@noti_bp.route("/api/notifications/<int:notification_id>/read", methods=["POST"])
@require_auth()
def mark_read(notification_id):
    recipient_type, recipient_id = _identity()
    n = Notification.query.filter_by(
        id=notification_id, recipient_type=recipient_type, recipient_id=recipient_id
    ).first()
    if not n:
        return jsonify({"error": "Notification not found"}), 404
    n.read_status = True
    n.read_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"success": True})


@noti_bp.route("/api/notifications/read_all", methods=["POST"])
@require_auth()
def mark_all_read():
    recipient_type, recipient_id = _identity()
    rows = Notification.query.filter_by(recipient_type=recipient_type, recipient_id=recipient_id, read_status=False).all()
    now = datetime.utcnow()
    for n in rows:
        n.read_status = True
        n.read_at = now
    db.session.commit()
    return jsonify({"success": True, "count": len(rows)})


@noti_bp.route("/api/notifications/<int:notification_id>", methods=["DELETE"])
@require_auth()
def delete_notification(notification_id):
    recipient_type, recipient_id = _identity()
    n = Notification.query.filter_by(
        id=notification_id, recipient_type=recipient_type, recipient_id=recipient_id
    ).first()
    if not n:
        return jsonify({"error": "Notification not found"}), 404
    db.session.delete(n)
    db.session.commit()
    return jsonify({"success": True})
