from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re

db = SQLAlchemy()


def slugify(text):
    s = re.sub(r'[^\w\s-]', '', (text or '').lower())
    return re.sub(r'[-\s]+', '-', s).strip('-')[:80] or 'athlete'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    mobile_number = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    sports_interest = db.Column(db.String(100), nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    role = db.Column(db.String(20), default="athlete")
    bio = db.Column(db.Text, nullable=True)
    profile_photo = db.Column(db.String(255), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    badges = db.Column(db.String(500), default="")  # comma-separated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    assessments = db.relationship('Assessment', backref='athlete', lazy=True)
    recommendations = db.relationship('AIRecommendation', backref='user', lazy=True)


class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    test_name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Float, nullable=False)
    video_url = db.Column(db.String(255), nullable=True)
    ai_confidence = db.Column(db.Float, nullable=True)
    validation_status = db.Column(db.String(50), nullable=False, default="Pending")
    cheat_reason = db.Column(db.String(255), nullable=True)


class Coach(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    photo_url = db.Column(db.String(500), nullable=True)
    banner_url = db.Column(db.String(500), nullable=True)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=True)
    academy_organization = db.Column(db.String(200), nullable=True)
    specialization = db.Column(db.String(100), nullable=False)
    specializations = db.Column(db.String(500), default="")
    experience_years = db.Column(db.Integer, default=0)
    certifications = db.Column(db.Text, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    coaching_philosophy = db.Column(db.Text, nullable=True)
    training_approach = db.Column(db.Text, nullable=True)
    areas_of_expertise = db.Column(db.Text, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    athletes_managed = db.Column(db.Integer, default=0)
    assessments_reviewed = db.Column(db.Integer, default=0)
    success_rate = db.Column(db.Float, default=85.0)
    improvement_pct = db.Column(db.Float, default=18.0)
    national_athletes_produced = db.Column(db.Integer, default=0)
    coach_ranking = db.Column(db.Integer, default=100)
    profile_completion = db.Column(db.Integer, default=80)
    badges = db.Column(db.String(500), default="")
    rating = db.Column(db.Float, default=4.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    cert_records = db.relationship('CoachCertification', backref='coach', lazy=True)
    reviews = db.relationship('CoachReview', backref='coach', lazy=True)
    athlete_links = db.relationship('CoachAthlete', backref='coach', lazy=True)
    sessions = db.relationship('CoachSession', backref='coach', lazy=True)


class CoachCertification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    issuer = db.Column(db.String(200), nullable=False)
    cert_type = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=True)


class CoachReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    athlete_name = db.Column(db.String(100), nullable=False)
    sport = db.Column(db.String(100), nullable=True)
    rating = db.Column(db.Float, default=5.0)
    review_text = db.Column(db.Text, nullable=False)


class CoachAthlete(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='active')
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    athlete = db.relationship('User', backref='coach_assignments', lazy=True)


class CoachSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    athlete_name = db.Column(db.String(100), nullable=False)
    session_type = db.Column(db.String(50), default='Training')
    start_at = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(30), default='scheduled')


class CoachAssessmentReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessment.id'), nullable=False)
    review_status = db.Column(db.String(30), default='pending')
    coach_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CoachContactRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=False)
    request_type = db.Column(db.String(30), nullable=False)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipient_type = db.Column(db.String(20), nullable=False)  # athlete|coach|admin
    recipient_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False, default='platform')
    category = db.Column(db.String(50), nullable=False, default='platform')
    read_status = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime, nullable=True)
    metadata_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participantA_type = db.Column(db.String(20), nullable=False)
    participantA_id = db.Column(db.Integer, nullable=False)
    participantB_type = db.Column(db.String(20), nullable=False)
    participantB_id = db.Column(db.Integer, nullable=False)
    last_message = db.Column(db.String(500), nullable=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_type = db.Column(db.String(20), nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=True)
    attachment_path = db.Column(db.String(500), nullable=True)
    read_status = db.Column(db.Boolean, default=False)
    delivered_status = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    conversation = db.relationship('Conversation', backref='messages', lazy=True)


class ConversationParticipantState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    participant_type = db.Column(db.String(20), nullable=False)
    participant_id = db.Column(db.Integer, nullable=False)
    last_read_message_id = db.Column(db.Integer, nullable=True)
    typing_status = db.Column(db.Boolean, default=False)
    online_status = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


class NewsArticle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    summary = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_trending = db.Column(db.Boolean, default=False)
    author = db.Column(db.String(100), default="SportsGauge Editorial")
    published_at = db.Column(db.DateTime, default=datetime.utcnow)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    sport = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=True)
    venue = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    registration_open = db.Column(db.Boolean, default=True)


class Academy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    sports_offered = db.Column(db.String(500), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(500), nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    contact_email = db.Column(db.String(120), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Float, default=4.0)
    image_url = db.Column(db.String(500), nullable=True)
    map_lat = db.Column(db.Float, nullable=True)
    map_lng = db.Column(db.Float, nullable=True)


class Scholarship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    provider = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    eligibility = db.Column(db.Text, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)
    link_url = db.Column(db.String(500), nullable=True)


class AIRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    best_sports = db.Column(db.String(500), nullable=False)
    strengths = db.Column(db.Text, nullable=False)
    weaknesses = db.Column(db.Text, nullable=False)
    improvements = db.Column(db.Text, nullable=False)
    training_plan = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
