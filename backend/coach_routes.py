"""Coach authentication, enriched profiles, and dashboard APIs."""
from datetime import datetime, timedelta
from collections import defaultdict
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import (
    db, User, Assessment, Coach,
    CoachCertification, CoachReview, CoachAthlete, CoachSession,
    CoachAssessmentReview, CoachContactRequest, AIRecommendation,
)
from seed_coach_profiles import seed_coach_profiles
from auth_utils import issue_token
from comms_service import create_notification
from email_service import send_email

coach_bp = Blueprint('coach', __name__)


def _badges_list(s):
    return [b.strip() for b in (s or '').split(',') if b.strip()]


def _split_csv(s):
    return [x.strip() for x in (s or '').split(',') if x.strip()]


def _coach_base(c):
    return {
        'id': c.id, 'full_name': c.full_name, 'slug': c.slug, 'email': c.email,
        'state': c.state, 'district': c.district, 'specialization': c.specialization,
        'experience_years': c.experience_years, 'bio': c.bio,
        'is_verified': c.is_verified, 'athletes_managed': c.athletes_managed,
        'rating': c.rating, 'photo_url': c.photo_url, 'banner_url': c.banner_url,
        'academy_organization': c.academy_organization,
    }


def _success_stories(coach):
    stories = []
    for link in CoachAthlete.query.filter_by(coach_id=coach.id, status='active').limit(4).all():
        u = link.athlete
        if not u:
            continue
        assessments = Assessment.query.filter_by(user_id=u.id, validation_status='Valid').all()
        if len(assessments) >= 2:
            scores = sorted(a.score for a in assessments)
            imp = round(((scores[-1] - scores[0]) / max(scores[0], 1)) * 100, 1)
        else:
            imp = round(coach.improvement_pct or 18, 1)
        stories.append({
            'athlete_name': u.full_name,
            'username': u.username,
            'sport': u.sports_interest,
            'achievement': _badges_list(u.badges)[0] if u.badges else 'Rising Talent',
            'improvement_pct': min(imp, 35),
            'photo_seed': u.username or f'athlete-{u.id}',
        })
    if len(stories) < 3:
        extras = [
            {'athlete_name': 'State Medalist', 'username': None, 'sport': coach.specialization,
             'achievement': 'State Championship', 'improvement_pct': 21.5, 'photo_seed': f'{coach.slug}-e1'},
            {'athlete_name': 'Academy Graduate', 'username': None, 'sport': coach.specialization,
             'achievement': 'National Camp Selection', 'improvement_pct': 24.0, 'photo_seed': f'{coach.slug}-e2'},
        ]
        stories.extend(extras[: 3 - len(stories)])
    return stories


@coach_bp.route('/api/coaches/login', methods=['POST'])
def coach_login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    c = Coach.query.filter_by(email=email).first()
    if not c or c.password_hash != password:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    token = issue_token("coach", c.id, c.full_name, "coach")
    return jsonify({
        'success': True,
        'coach_id': c.id, 'slug': c.slug, 'full_name': c.full_name,
        'is_verified': c.is_verified, 'photo_url': c.photo_url,
        'specialization': c.specialization,
        'access_token': token,
    })


@coach_bp.route('/api/coaches/<slug>/full', methods=['GET'])
def coach_full_profile(slug):
    seed_coach_profiles()
    c = Coach.query.filter_by(slug=slug).first()
    if not c:
        return jsonify({'error': 'Coach not found'}), 404

    certs = [{
        'title': x.title, 'issuer': x.issuer, 'cert_type': x.cert_type, 'year': x.year,
    } for x in CoachCertification.query.filter_by(coach_id=c.id).all()]

    reviews = [{
        'athlete_name': r.athlete_name, 'sport': r.sport,
        'rating': r.rating, 'review_text': r.review_text,
    } for r in CoachReview.query.filter_by(coach_id=c.id).order_by(CoachReview.rating.desc()).all()]

    all_specs = ['Athletics', 'Sprint Training', 'Strength & Conditioning', 'Endurance Training', 'Youth Development']
    active = _split_csv(c.specializations)

    return jsonify({
        **_coach_base(c),
        'coaching_philosophy': c.coaching_philosophy,
        'training_approach': c.training_approach,
        'areas_of_expertise': _split_csv(c.areas_of_expertise),
        'specializations': active,
        'specialization_cards': [
            {'name': s, 'active': s in active or (s == 'Athletics' and 'Athletics' in (c.specialization or ''))}
            for s in all_specs
        ],
        'stats': {
            'athletes_trained': c.athletes_managed,
            'assessments_reviewed': c.assessments_reviewed,
            'success_rate': c.success_rate,
            'improvement_pct': c.improvement_pct,
            'national_athletes': c.national_athletes_produced,
        },
        'badges': _badges_list(c.badges),
        'certifications': certs,
        'reviews': reviews,
        'success_stories': _success_stories(c),
    })


@coach_bp.route('/api/coaches/<int:coach_id>/dashboard', methods=['GET'])
def coach_dashboard(coach_id):
    seed_coach_profiles()
    c = Coach.query.get(coach_id)
    if not c:
        return jsonify({'error': 'Coach not found'}), 404

    links = CoachAthlete.query.filter_by(coach_id=coach_id).all()
    athlete_ids = [l.user_id for l in links]
    active_count = sum(1 for l in links if l.status == 'active')

    roster = []
    top_performers = []
    needs_improvement = []
    for link in links:
        u = link.athlete
        if not u:
            continue
        assessments = Assessment.query.filter_by(user_id=u.id).order_by(Assessment.date.desc()).all()
        valid = [a for a in assessments if a.validation_status == 'Valid']
        best = max((a.score for a in valid), default=0)
        avg_conf = sum(a.ai_confidence or 0 for a in valid) / len(valid) if valid else 0
        pending = sum(1 for a in assessments if a.validation_status == 'Pending')
        status = 'Complete' if len(valid) >= 4 else ('In Progress' if valid else 'Not Started')
        entry = {
            'user_id': u.id, 'username': u.username, 'full_name': u.full_name,
            'sport': u.sports_interest, 'state': u.state,
            'current_score': round(best, 1), 'assessment_status': status,
            'pending_count': pending, 'ai_confidence': round(avg_conf, 1),
            'profile_photo': u.profile_photo, 'status': link.status,
        }
        roster.append(entry)
        if best >= 85:
            top_performers.append({**entry, 'label': u.full_name})
        elif best < 70 and valid:
            needs_improvement.append({**entry, 'label': u.full_name, 'focus': 'Core endurance & agility'})

    roster.sort(key=lambda x: x['current_score'], reverse=True)

    recent = []
    if athlete_ids:
        rows = Assessment.query.filter(Assessment.user_id.in_(athlete_ids)).order_by(
            Assessment.date.desc()
        ).limit(15).all()
        for a in rows:
            u = User.query.get(a.user_id)
            rev = CoachAssessmentReview.query.filter_by(
                coach_id=coach_id, assessment_id=a.id
            ).first()
            recent.append({
                'id': a.id, 'athlete_name': u.full_name if u else 'Unknown',
                'username': u.username if u else None,
                'test_name': a.test_name, 'score': a.score,
                'ai_confidence': a.ai_confidence,
                'validation_status': a.validation_status,
                'review_status': rev.review_status if rev else 'pending',
                'date': a.date.isoformat(),
            })

    # Monthly chart data
    chart = {'sprint': [], 'situp': [], 'jump': [], 'shuttle': []}
    test_map = {'sprint': 'sprint', 'situp': 'situp', 'jump': 'jump', 'shuttle': 'shuttle'}
    if athlete_ids:
        for key, tname in test_map.items():
            rows = db.session.query(
                func.strftime('%Y-%m', Assessment.date).label('month'),
                func.avg(Assessment.score).label('avg_score'),
            ).filter(
                Assessment.user_id.in_(athlete_ids),
                Assessment.test_name == tname,
                Assessment.validation_status == 'Valid',
            ).group_by('month').order_by('month').limit(6).all()
            chart[key] = [{'month': m, 'score': round(float(s), 1)} for m, s in rows if m]

    # Fill default chart if empty
    months = [(datetime.utcnow() - timedelta(days=30 * i)).strftime('%Y-%m') for i in range(5, -1, -1)]
    for key in chart:
        if not chart[key]:
            base = {'sprint': 11.5, 'situp': 38, 'jump': 52, 'shuttle': 14.2}[key]
            chart[key] = [{'month': m, 'score': round(base + i * 0.8, 1)} for i, m in enumerate(months)]

    sessions = [{
        'title': s.title, 'athlete_name': s.athlete_name,
        'session_type': s.session_type, 'start_at': s.start_at.isoformat(), 'status': s.status,
    } for s in CoachSession.query.filter_by(coach_id=coach_id).order_by(CoachSession.start_at).limit(8).all()]

    analytics = {
        'athlete_growth': [{'month': m, 'count': 3 + i} for i, m in enumerate(months)],
        'assessment_success_rate': [{'month': m, 'rate': 82 + i * 2} for i, m in enumerate(months)],
        'monthly_engagement': [{'month': m, 'sessions': 12 + i * 3} for i, m in enumerate(months)],
        'training_impact': [{'month': m, 'improvement': 14 + i * 1.5} for i, m in enumerate(months)],
    }

    training_recs = [
        'Schedule sprint retests for athletes with >8% improvement this month.',
        'Assign core endurance block to athletes below 70 composite score.',
        'Review shuttle run form videos for pending validations.',
    ]

    return jsonify({
        'coach': {
            **_coach_base(c),
            'coach_ranking': c.coach_ranking,
            'profile_completion': c.profile_completion,
            'badges': _badges_list(c.badges),
        },
        'quick_stats': {
            'total_athletes': len(roster),
            'active_athletes': active_count,
            'assessments_reviewed': c.assessments_reviewed,
            'monthly_progress': round(c.improvement_pct or 18, 1),
            'success_rate': c.success_rate,
        },
        'roster': roster,
        'recent_assessments': recent,
        'progress_charts': chart,
        'top_performers': top_performers[:5],
        'needs_improvement': needs_improvement[:5],
        'training_recommendations': training_recs,
        'upcoming_sessions': sessions,
        'analytics': analytics,
    })


@coach_bp.route('/api/coaches/contact', methods=['POST'])
def coach_contact():
    data = request.json or {}
    coach_id = data.get('coach_id')
    if not coach_id:
        return jsonify({'success': False, 'error': 'coach_id required'}), 400
    req = CoachContactRequest(
        coach_id=coach_id,
        request_type=data.get('request_type', 'message'),
        sender_name=data.get('sender_name', 'Guest'),
        sender_email=data.get('sender_email', ''),
        message=data.get('message', ''),
    )
    db.session.add(req)
    db.session.commit()
    coach = Coach.query.get(coach_id)
    if coach:
        send_email(coach.email, 'consultation_request', {'name': coach.full_name})
        create_notification(
            'coach', coach.id, 'New consultation request',
            f"{req.sender_name} sent a consultation request.",
            ntype='coach_feedback', category='coach_feedback',
        )
    return jsonify({'success': True, 'message': 'Request submitted successfully'})


@coach_bp.route('/api/coaches/<int:coach_id>/feedback', methods=['POST'])
def coach_feedback(coach_id):
    data = request.json or {}
    assessment_id = data.get('assessment_id')
    if not assessment_id:
        return jsonify({'success': False, 'error': 'assessment_id required'}), 400
    rev = CoachAssessmentReview.query.filter_by(
        coach_id=coach_id, assessment_id=assessment_id
    ).first()
    if not rev:
        rev = CoachAssessmentReview(coach_id=coach_id, assessment_id=assessment_id)
        db.session.add(rev)
    rev.review_status = 'reviewed'
    rev.coach_notes = data.get('feedback', data.get('coach_notes', ''))
    db.session.commit()
    assessment = Assessment.query.get(assessment_id)
    coach = Coach.query.get(coach_id)
    if assessment:
        athlete = User.query.get(assessment.user_id)
        if athlete:
            create_notification(
                'athlete', athlete.id, 'Coach feedback received',
                f'Coach feedback is available for your {assessment.test_name} assessment.',
                ntype='coach_feedback', category='coach_feedback',
            )
            send_email(athlete.email, 'results_available', {'name': athlete.full_name, 'test_name': assessment.test_name})
    if coach:
        send_email(coach.email, 'assessment_review_request', {'name': coach.full_name})
    return jsonify({'success': True})
