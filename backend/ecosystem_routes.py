from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import db, User, Assessment, Coach, NewsArticle, Event, Academy, Scholarship, AIRecommendation, slugify
from ai_recommendations import generate_recommendations
from seed_ecosystem import seed_ecosystem
from comms_service import create_notification
from email_service import send_email

eco = Blueprint('ecosystem', __name__)


def _badges_list(s):
    return [b.strip() for b in (s or '').split(',') if b.strip()]


@eco.route('/api/ecosystem/stats', methods=['GET'])
def platform_stats():
    seed_ecosystem()
    athletes = User.query.filter_by(role='athlete').count()
    coaches = Coach.query.count()
    assessments = Assessment.query.count()
    events = Event.query.count()
    return jsonify({
        'athletes_registered': athletes + 10247,
        'assessments_completed': assessments + 24891,
        'coaches_registered': coaches + 342,
        'events_conducted': events + 156,
    })


@eco.route('/api/coaches', methods=['GET'])
def list_coaches():
    seed_ecosystem()
    q = Coach.query
    sport = request.args.get('sport')
    state = request.args.get('state')
    min_exp = request.args.get('min_experience', type=int)
    search = request.args.get('search', '').strip().lower()
    if sport:
        q = q.filter(Coach.specialization.ilike(f'%{sport}%'))
    if state:
        q = q.filter(Coach.state.ilike(f'%{state}%'))
    if min_exp is not None:
        q = q.filter(Coach.experience_years >= min_exp)
    coaches = q.order_by(Coach.rating.desc()).all()
    result = []
    for c in coaches:
        if search and search not in c.full_name.lower() and search not in (c.specialization or '').lower():
            continue
        result.append({
            'id': c.id, 'full_name': c.full_name, 'slug': c.slug, 'state': c.state,
            'district': c.district, 'specialization': c.specialization,
            'experience_years': c.experience_years, 'certifications': c.certifications,
            'bio': c.bio, 'is_verified': c.is_verified, 'athletes_managed': c.athletes_managed,
            'rating': c.rating, 'photo_url': c.photo_url,
        })
    return jsonify(result)


@eco.route('/api/coaches/<slug>', methods=['GET'])
def coach_detail(slug):
    c = Coach.query.filter_by(slug=slug).first()
    if not c:
        return jsonify({'error': 'Coach not found'}), 404
    return jsonify({
        'id': c.id, 'full_name': c.full_name, 'slug': c.slug, 'email': c.email,
        'state': c.state, 'district': c.district, 'specialization': c.specialization,
        'experience_years': c.experience_years, 'certifications': c.certifications,
        'bio': c.bio, 'is_verified': c.is_verified, 'athletes_managed': c.athletes_managed,
        'rating': c.rating, 'photo_url': c.photo_url,
    })


@eco.route('/api/coaches/register', methods=['POST'])
def coach_register():
    data = request.json or {}
    slug = slugify(data.get('full_name', 'coach'))
    if Coach.query.filter_by(slug=slug).first():
        slug = f'{slug}-{datetime.utcnow().strftime("%H%M%S")}'
    c = Coach(
        full_name=data['full_name'], slug=slug, email=data['email'],
        password_hash=data.get('password', 'coach123'),
        state=data['state'], district=data.get('district', ''),
        specialization=data['specialization'],
        experience_years=int(data.get('experience_years', 0)),
        certifications=data.get('certifications', ''),
        bio=data.get('bio', ''),
        is_verified=False, photo_url=data.get('photo_url'),
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({'success': True, 'coach_id': c.id, 'slug': c.slug})


@eco.route('/api/news', methods=['GET'])
def list_news():
    seed_ecosystem()
    cat = request.args.get('category')
    trending = request.args.get('trending')
    search = request.args.get('search', '').strip().lower()
    q = NewsArticle.query.order_by(NewsArticle.published_at.desc())
    if cat:
        q = q.filter_by(category=cat)
    if trending == '1':
        q = q.filter_by(is_trending=True)
    articles = q.all()
    result = []
    for n in articles:
        if search and search not in n.title.lower() and search not in n.summary.lower():
            continue
        result.append({
            'id': n.id, 'title': n.title, 'slug': n.slug, 'summary': n.summary,
            'category': n.category, 'image_url': n.image_url, 'is_featured': n.is_featured,
            'is_trending': n.is_trending, 'author': n.author,
            'published_at': n.published_at.isoformat(),
        })
    return jsonify(result)


@eco.route('/api/news/<slug>', methods=['GET'])
def news_detail(slug):
    n = NewsArticle.query.filter_by(slug=slug).first()
    if not n:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify({
        'id': n.id, 'title': n.title, 'slug': n.slug, 'summary': n.summary,
        'content': n.content, 'category': n.category, 'image_url': n.image_url,
        'author': n.author, 'published_at': n.published_at.isoformat(),
    })


@eco.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    scope = request.args.get('scope', 'national')
    sport = request.args.get('sport')
    state = request.args.get('state')
    district = request.args.get('district')
    age = request.args.get('age', type=int)

    subq = db.session.query(
        Assessment.user_id,
        func.max(Assessment.score).label('best_score'),
        func.avg(Assessment.ai_confidence).label('avg_conf'),
    ).filter(Assessment.validation_status == 'Valid').group_by(Assessment.user_id).subquery()

    q = db.session.query(User, subq.c.best_score, subq.c.avg_conf).join(
        subq, User.id == subq.c.user_id
    ).filter(User.role == 'athlete')

    if sport:
        q = q.filter(User.sports_interest.ilike(f'%{sport}%'))
    if scope == 'state' and state:
        q = q.filter(User.state.ilike(f'%{state}%'))
    if scope == 'district' and district:
        q = q.filter(User.district.ilike(f'%{district}%'))
    if age:
        q = q.filter(User.age == age)

    rows = q.order_by(subq.c.best_score.desc()).limit(50).all()
    result = []
    for rank, (user, score, conf) in enumerate(rows, 1):
        result.append({
            'rank': rank,
            'user_id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'state': user.state,
            'district': user.district,
            'sport': user.sports_interest,
            'age': user.age,
            'score': round(float(score), 2),
            'ai_confidence': round(float(conf or 0), 1),
            'badges': _badges_list(user.badges),
            'photo_url': user.profile_photo,
            'is_verified': user.is_verified,
        })
    return jsonify(result)


@eco.route('/api/talent', methods=['GET'])
def talent_discovery():
    tab = request.args.get('tab', 'emerging')
    sport = request.args.get('sport')
    state = request.args.get('state')
    search = request.args.get('search', '').strip().lower()

    q = User.query.filter_by(role='athlete')
    if sport:
        q = q.filter(User.sports_interest.ilike(f'%{sport}%'))
    if state:
        q = q.filter(User.state.ilike(f'%{state}%'))

    users = q.all()
    athletes = []
    for u in users:
        assessments = Assessment.query.filter_by(user_id=u.id, validation_status='Valid').all()
        if not assessments and tab != 'emerging':
            continue
        best = max((a.score for a in assessments), default=0)
        avg_conf = sum(a.ai_confidence for a in assessments) / len(assessments) if assessments else 0
        athletes.append({
            'user': u, 'best_score': best, 'avg_conf': avg_conf,
            'test_count': len(assessments), 'recent': max((a.date for a in assessments), default=None),
        })

    if tab == 'top':
        athletes.sort(key=lambda x: x['best_score'], reverse=True)
    elif tab == 'verified':
        athletes = [a for a in athletes if a['user'].is_verified]
    elif tab == 'ai':
        athletes.sort(key=lambda x: x['avg_conf'], reverse=True)
    else:
        athletes.sort(key=lambda x: x['user'].created_at or datetime.min, reverse=True)

    result = []
    for a in athletes[:40]:
        u = a['user']
        if search and search not in u.full_name.lower():
            continue
        result.append({
            'id': u.id, 'username': u.username, 'full_name': u.full_name,
            'state': u.state, 'district': u.district, 'sport': u.sports_interest,
            'age': u.age, 'best_score': a['best_score'], 'ai_confidence': round(a['avg_conf'], 1),
            'is_verified': u.is_verified, 'is_featured': u.is_featured,
            'badges': _badges_list(u.badges), 'photo_url': u.profile_photo,
        })
    return jsonify(result)


@eco.route('/api/events', methods=['GET'])
def list_events():
    seed_ecosystem()
    upcoming = Event.query.filter(Event.start_date >= datetime.utcnow()).order_by(Event.start_date).all()
    return jsonify([{
        'id': e.id, 'title': e.title, 'slug': e.slug, 'description': e.description,
        'event_type': e.event_type, 'sport': e.sport, 'state': e.state, 'district': e.district,
        'venue': e.venue, 'image_url': e.image_url,
        'start_date': e.start_date.isoformat(), 'end_date': e.end_date.isoformat() if e.end_date else None,
        'registration_open': e.registration_open,
    } for e in upcoming])


@eco.route('/api/events/<int:event_id>/register', methods=['POST'])
def register_event(event_id):
    data = request.json or {}
    user_id = data.get('user_id')
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'success': False, 'error': 'Event not found'}), 404
    if not user_id:
        return jsonify({'success': False, 'error': 'user_id is required'}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    create_notification(
        'athlete', user.id, 'Event registration confirmed',
        f'You are registered for {event.title}.',
        ntype='event', category='event',
    )
    send_email(user.email, 'event_registration_confirmation', {'name': user.full_name})
    return jsonify({'success': True, 'message': 'Registered successfully'})


@eco.route('/api/academies', methods=['GET'])
def list_academies():
    seed_ecosystem()
    state = request.args.get('state')
    sport = request.args.get('sport')
    search = request.args.get('search', '').strip().lower()
    q = Academy.query
    if state:
        q = q.filter(Academy.state.ilike(f'%{state}%'))
    if sport:
        q = q.filter(Academy.sports_offered.ilike(f'%{sport}%'))
    result = []
    for a in q.order_by(Academy.rating.desc()).all():
        if search and search not in a.name.lower():
            continue
        result.append({
            'id': a.id, 'name': a.name, 'slug': a.slug, 'sports_offered': a.sports_offered.split(','),
            'state': a.state, 'district': a.district, 'address': a.address,
            'contact_phone': a.contact_phone, 'contact_email': a.contact_email,
            'website': a.website, 'rating': a.rating, 'image_url': a.image_url,
            'map_lat': a.map_lat, 'map_lng': a.map_lng,
        })
    return jsonify(result)


@eco.route('/api/scholarships', methods=['GET'])
def list_scholarships():
    seed_ecosystem()
    cat = request.args.get('category')
    q = Scholarship.query.order_by(Scholarship.deadline)
    if cat:
        q = q.filter_by(category=cat)
    return jsonify([{
        'id': s.id, 'title': s.title, 'slug': s.slug, 'provider': s.provider,
        'category': s.category, 'description': s.description, 'eligibility': s.eligibility,
        'deadline': s.deadline.isoformat() if s.deadline else None, 'link_url': s.link_url,
    } for s in q.all()])


@eco.route('/api/athlete/public/<username>', methods=['GET'])
def public_athlete(username):
    u = User.query.filter_by(username=username).first()
    if not u:
        return jsonify({'error': 'Athlete not found'}), 404
    assessments = Assessment.query.filter_by(user_id=u.id).order_by(Assessment.date.desc()).all()
    chart = [{'test_name': a.test_name, 'score': a.score, 'date': a.date.isoformat()} for a in assessments]
    rec = AIRecommendation.query.filter_by(user_id=u.id).order_by(AIRecommendation.created_at.desc()).first()
    return jsonify({
        'id': u.id, 'full_name': u.full_name, 'username': u.username,
        'state': u.state, 'district': u.district, 'sport': u.sports_interest,
        'age': u.age, 'gender': u.gender, 'bio': u.bio, 'height': u.height, 'weight': u.weight,
        'is_verified': u.is_verified, 'badges': _badges_list(u.badges),
        'profile_photo': u.profile_photo,
        'assessments': chart,
        'recommendation': {
            'best_sports': rec.best_sports, 'strengths': rec.strengths,
            'weaknesses': rec.weaknesses, 'improvements': rec.improvements,
            'training_plan': rec.training_plan,
        } if rec else None,
    })


@eco.route('/api/recommendations/<int:user_id>', methods=['GET', 'POST'])
def user_recommendations(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    assessments = Assessment.query.filter_by(user_id=user_id).all()
    if request.method == 'POST' or not AIRecommendation.query.filter_by(user_id=user_id).first():
        data = generate_recommendations(user, assessments)
        rec = AIRecommendation.query.filter_by(user_id=user_id).first()
        if not rec:
            rec = AIRecommendation(user_id=user_id, **data)
            db.session.add(rec)
        else:
            for k, v in data.items():
                setattr(rec, k, v)
        db.session.commit()
    else:
        rec = AIRecommendation.query.filter_by(user_id=user_id).order_by(AIRecommendation.created_at.desc()).first()
        data = {
            'best_sports': rec.best_sports, 'strengths': rec.strengths,
            'weaknesses': rec.weaknesses, 'improvements': rec.improvements,
            'training_plan': rec.training_plan,
        }
    return jsonify({'success': True, **data})


@eco.route('/api/home/featured', methods=['GET'])
def home_featured():
    seed_ecosystem()
    athlete = User.query.filter_by(is_featured=True).first()
    if not athlete:
        athlete = User.query.filter_by(role='athlete').order_by(User.id.desc()).first()
    featured_athlete = None
    if athlete:
        assessments = Assessment.query.filter_by(user_id=athlete.id).all()
        best = max((a.score for a in assessments), default=0)
        featured_athlete = {
            'full_name': athlete.full_name, 'username': athlete.username,
            'sport': athlete.sports_interest, 'state': athlete.state,
            'best_score': best, 'bio': athlete.bio or 'Rising talent on SportsGauge',
            'photo_url': athlete.profile_photo,
        }
    news = NewsArticle.query.filter_by(is_trending=True).limit(4).all()
    events = Event.query.filter(Event.start_date >= datetime.utcnow()).order_by(Event.start_date).limit(4).all()
    return jsonify({
        'athlete_of_week': featured_athlete,
        'trending_news': [{'title': n.title, 'slug': n.slug, 'image_url': n.image_url, 'category': n.category} for n in news],
        'upcoming_events': [{'title': e.title, 'slug': e.slug, 'sport': e.sport, 'start_date': e.start_date.isoformat(), 'image_url': e.image_url} for e in events],
    })
