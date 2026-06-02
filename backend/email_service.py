import os
import smtplib
from email.message import EmailMessage
from datetime import datetime


SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@sportsgauge.in")


def _render(subject_key: str, context: dict):
    name = context.get("name", "Athlete")
    mapping = {
        "welcome": (
            "Welcome to SportsGauge",
            f"Hello {name},\n\nWelcome to SportsGauge. Your athlete profile is active and ready for AI assessments.\n\nTeam SportsGauge"
        ),
        "verification": (
            "Verify your SportsGauge account",
            f"Hello {name},\n\nPlease verify your account to unlock full ecosystem features.\n\nTeam SportsGauge"
        ),
        "registration_success": (
            "Registration successful",
            f"Hello {name},\n\nYour SportsGauge registration is successful.\n\nTeam SportsGauge"
        ),
        "assessment_started": (
            "Assessment started",
            f"Hello {name},\n\nYour {context.get('test_name', 'assessment')} has started processing."
        ),
        "assessment_completed": (
            "Assessment completed",
            f"Hello {name},\n\nYour {context.get('test_name', 'assessment')} has been completed."
        ),
        "ai_analysis_completed": (
            "AI analysis completed",
            f"Hello {name},\n\nAI analysis for {context.get('test_name', 'assessment')} is ready."
        ),
        "results_available": (
            "Assessment results available",
            f"Hello {name},\n\nResults are now available in your dashboard."
        ),
        "coach_assigned": (
            "New athlete assigned",
            f"Hello Coach {name},\n\nA new athlete has been assigned to you on SportsGauge."
        ),
        "assessment_review_request": (
            "Assessment review request",
            f"Hello Coach {name},\n\nA new assessment is pending your review."
        ),
        "consultation_request": (
            "New consultation request",
            f"Hello Coach {name},\n\nYou received a new consultation request from an athlete."
        ),
        "event_registration_confirmation": (
            "Event registration confirmed",
            f"Hello {name},\n\nYour event registration has been confirmed."
        ),
        "event_reminder": (
            "Event reminder",
            f"Hello {name},\n\nReminder: your registered event starts soon."
        ),
        "event_update": (
            "Event update",
            f"Hello {name},\n\nThere is an important update for your event registration."
        ),
        "password_reset_link": (
            "Reset your password",
            f"Hello {name},\n\nUse this link to reset your password: {context.get('reset_link', '#')}"
        ),
        "password_changed_notification": (
            "Password changed successfully",
            f"Hello {name},\n\nYour account password was changed successfully."
        ),
    }
    return mapping.get(subject_key, ("SportsGauge Notification", f"Hello {name},\n\nYou have a new SportsGauge update."))


def send_email(to_email: str, subject_key: str, context: dict | None = None):
    context = context or {}
    subject, body = _render(subject_key, context)
    if not to_email:
        return {"queued": False, "reason": "missing-recipient"}

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # Dev-safe fallback: log only
        print(f"[EMAIL-MOCK] {datetime.utcnow().isoformat()} to={to_email} subject={subject}")
        return {"queued": True, "mock": True}

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        return {"queued": True}
    except Exception as e:
        print(f"[EMAIL-ERROR] {e}")
        return {"queued": False, "error": str(e)}
