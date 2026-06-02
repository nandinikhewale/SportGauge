from flask import request
from flask_socketio import emit, join_room, leave_room
from auth_utils import decode_token
from models import db, Message
from comms_service import add_message


def register_socket_handlers(socketio):
    online_users = {}  # sid -> (type,id)
    conversation_typing = {}  # (conversation_id, type,id) -> bool

    def _identity_from_token():
        token = request.args.get("token", "")
        if not token:
            raise ValueError("missing token")
        claims = decode_token(token)
        return claims.get("sub_type"), int(claims.get("sub_id"))

    @socketio.on("connect")
    def on_connect():
        try:
            ident = _identity_from_token()
            online_users[request.sid] = ident
            emit("online_status", {"user_type": ident[0], "user_id": ident[1], "online": True}, broadcast=True)
        except Exception:
            return False

    @socketio.on("disconnect")
    def on_disconnect():
        ident = online_users.pop(request.sid, None)
        if ident:
            emit("online_status", {"user_type": ident[0], "user_id": ident[1], "online": False}, broadcast=True)

    @socketio.on("join_conversation")
    def on_join(data):
        conversation_id = data.get("conversation_id")
        room = f"conversation:{conversation_id}"
        join_room(room)
        emit("joined", {"conversation_id": conversation_id})

    @socketio.on("leave_conversation")
    def on_leave(data):
        conversation_id = data.get("conversation_id")
        room = f"conversation:{conversation_id}"
        leave_room(room)

    @socketio.on("typing")
    def on_typing(data):
        ident = online_users.get(request.sid)
        if not ident:
            return
        conversation_id = data.get("conversation_id")
        room = f"conversation:{conversation_id}"
        emit("typing", {
            "conversation_id": conversation_id,
            "user_type": ident[0],
            "user_id": ident[1],
            "typing": True,
        }, room=room, include_self=False)

    @socketio.on("send_message")
    def on_send_message(data):
        ident = online_users.get(request.sid)
        if not ident:
            return
        conversation_id = int(data.get("conversation_id"))
        receiver_type = data.get("receiver_type")
        receiver_id = int(data.get("receiver_id"))
        content = data.get("content", "")
        attachment_path = data.get("attachment_path")
        msg = add_message(
            conversation_id=conversation_id,
            sender_type=ident[0],
            sender_id=ident[1],
            receiver_type=receiver_type,
            receiver_id=receiver_id,
            content=content,
            attachment_path=attachment_path,
        )
        emit("message_received", {
            "id": msg.id,
            "conversation_id": conversation_id,
            "sender_type": msg.sender_type,
            "sender_id": msg.sender_id,
            "receiver_type": msg.receiver_type,
            "receiver_id": msg.receiver_id,
            "content": msg.content,
            "attachment_path": msg.attachment_path,
            "timestamp": msg.timestamp.isoformat(),
            "read_status": msg.read_status,
        }, room=f"conversation:{conversation_id}")

    @socketio.on("stop_typing")
    def on_stop_typing(data):
        ident = online_users.get(request.sid)
        if not ident:
            return
        conversation_id = data.get("conversation_id")
        room = f"conversation:{conversation_id}"
        emit("typing", {
            "conversation_id": conversation_id,
            "user_type": ident[0],
            "user_id": ident[1],
            "typing": False,
        }, room=room, include_self=False)

    @socketio.on("read_receipt")
    def on_read_receipt(data):
        message_id = data.get("message_id")
        conversation_id = data.get("conversation_id")
        ident = online_users.get(request.sid)
        if not ident:
            return
        msg = Message.query.get(message_id)
        if msg and msg.receiver_type == ident[0] and msg.receiver_id == ident[1]:
            msg.read_status = True
            db.session.commit()
        emit("read_receipt", {
            "conversation_id": conversation_id,
            "message_id": message_id,
            "reader_type": ident[0],
            "reader_id": ident[1],
        }, room=f"conversation:{conversation_id}", include_self=False)
