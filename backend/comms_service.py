from datetime import datetime
from models import db, Notification, Conversation, Message


def create_notification(recipient_type, recipient_id, title, message, ntype="platform", category="platform", metadata_json=None):
    n = Notification(
        recipient_type=recipient_type,
        recipient_id=recipient_id,
        title=title,
        message=message,
        type=ntype,
        category=category,
        metadata_json=metadata_json,
        read_status=False,
    )
    db.session.add(n)
    db.session.commit()
    return n


def get_or_create_conversation(a_type, a_id, b_type, b_id):
    # deterministic pair ordering
    p1 = (a_type, int(a_id))
    p2 = (b_type, int(b_id))
    left, right = sorted([p1, p2], key=lambda x: (x[0], x[1]))
    conv = Conversation.query.filter_by(
        participantA_type=left[0], participantA_id=left[1],
        participantB_type=right[0], participantB_id=right[1],
    ).first()
    if conv:
        return conv
    conv = Conversation(
        participantA_type=left[0], participantA_id=left[1],
        participantB_type=right[0], participantB_id=right[1],
        last_updated=datetime.utcnow(),
    )
    db.session.add(conv)
    db.session.commit()
    return conv


def add_message(conversation_id, sender_type, sender_id, receiver_type, receiver_id, content=None, attachment_path=None):
    msg = Message(
        conversation_id=conversation_id,
        sender_type=sender_type,
        sender_id=sender_id,
        receiver_type=receiver_type,
        receiver_id=receiver_id,
        content=content or "",
        attachment_path=attachment_path,
        delivered_status=True,
        read_status=False,
    )
    db.session.add(msg)
    conv = Conversation.query.get(conversation_id)
    if conv:
        conv.last_message = content or (f"Attachment: {attachment_path}" if attachment_path else "")
        conv.last_updated = datetime.utcnow()
    db.session.commit()
    return msg
