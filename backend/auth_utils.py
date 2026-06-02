import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import jwt


JWT_SECRET = os.getenv("SPORTSGAUGE_JWT_SECRET", "sportsgauge-dev-secret")
JWT_ALG = "HS256"
JWT_EXP_HOURS = int(os.getenv("SPORTSGAUGE_JWT_EXP_HOURS", "12"))


def issue_token(identity_type: str, identity_id: int, name: str, role: str):
    now = datetime.utcnow()
    payload = {
        "sub_type": identity_type,
        "sub_id": identity_id,
        "name": name,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])


def require_auth(allowed_roles=None):
    allowed_roles = set(allowed_roles or [])

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth = request.headers.get("Authorization", "")
            if not auth.startswith("Bearer "):
                return jsonify({"error": "Unauthorized"}), 401
            token = auth.split(" ", 1)[1].strip()
            try:
                claims = decode_token(token)
            except Exception:
                return jsonify({"error": "Invalid token"}), 401
            role = claims.get("role")
            if allowed_roles and role not in allowed_roles:
                return jsonify({"error": "Forbidden"}), 403
            request.identity = {
                "type": claims.get("sub_type"),
                "id": claims.get("sub_id"),
                "name": claims.get("name"),
                "role": role,
            }
            return fn(*args, **kwargs)
        return wrapper
    return decorator
