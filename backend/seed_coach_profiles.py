"""Populate rich coach profiles, certifications, reviews, athlete links, and sessions."""
from datetime import datetime, timedelta
from models import (
    db, Coach, User, Assessment,
    CoachCertification, CoachReview, CoachAthlete, CoachSession, CoachAssessmentReview,
)

IMG = lambda s: f'https://picsum.photos/seed/sg-{s}/800/500'

PROFILE_DATA = {
    'rajesh-mehta': {
        'academy': 'Elite Velocity Athletics Academy, Mumbai',
        'philosophy': 'Every athlete deserves data-driven coaching. I combine biomechanical assessment with periodized sprint training to unlock speed that subjective scouting misses.',
        'approach': 'Block periodization with weekly AI retests. Acceleration drills in phase one, max velocity in phase two, competition taper in phase three.',
        'expertise': 'Sprint biomechanics,Start technique,Youth talent ID,SAI camp preparation',
        'specs': 'Athletics,Sprint Training,Strength & Conditioning,Youth Development',
        'badges': 'Verified Coach,Elite Coach,Top Performer,Talent Scout',
        'stats': (48, 312, 89.5, 22.4, 7, 12, 95),
        'certs': [
            ('SAI Level 2 Athletics Coach', 'Sports Authority of India', 'SAI', 2018),
            ('IAAF Youth Coaching Certificate', 'World Athletics', 'International', 2020),
            ('Strength & Conditioning Level 1', 'NSCA India', 'National', 2019),
            ('Biomechanics for Sprint Coaches', 'Loughborough University Online', 'International', 2021),
        ],
        'reviews': [
            ('Aditya Rao', 'Athletics', 5, 'Coach Mehta transformed my start technique. My 100m dropped from 12.1s to 10.9s in one season.'),
            ('Priya Nair', 'Athletics', 5, 'The assessment reports made every training session purposeful. Best coach I have worked with.'),
            ('Rohit Kumar', 'Sprint', 4.5, 'Structured, professional, and always available for feedback on my SportsGauge scores.'),
        ],
    },
    'anita-desai': {
        'academy': 'Hoops Nation Basketball Centre, Bengaluru',
        'philosophy': 'Basketball excellence starts with measurable athleticism. Vertical jump and agility scores guide every individualized program I design.',
        'approach': 'Skill blocks paired with plyometric progressions. Video review every fortnight with SportsGauge metric comparison.',
        'expertise': 'Vertical jump development,Agility testing,U-17 pathways,Women\'s basketball',
        'specs': 'Basketball,Strength & Conditioning,Youth Development,Endurance Training',
        'badges': 'Verified Coach,Elite Coach,Mentor Award',
        'stats': (32, 198, 87.2, 19.8, 4, 28, 92),
        'certs': [
            ('FIBA Level 1 Coach', 'FIBA', 'International', 2019),
            ('Sports Science Diploma', 'LNIPE Gwalior', 'National', 2017),
            ('NSNIS Basketball Specialization', 'SAI', 'SAI', 2016),
            ('Youth Development Certificate', 'BCCI Sports Science Unit', 'Coaching', 2022),
        ],
        'reviews': [
            ('Neha Joshi', 'Basketball', 5, 'My vertical improved 14 cm in four months. Coach Desai uses data like no one else.'),
            ('Meera Kumari', 'Basketball', 5, 'She identified my court movement weaknesses from shuttle scores and fixed them fast.'),
            ('Fatima Khan', 'Basketball', 4.5, 'Professional, encouraging, and deeply knowledgeable about youth development.'),
        ],
    },
    'vikram-singh-coach': {
        'academy': 'Haryana Kabaddi Excellence Centre, Karnal',
        'philosophy': 'Kabaddi demands explosive agility and core endurance. I train raiders and defenders using assessment metrics trusted by PKL scouts.',
        'approach': 'Position-specific conditioning with weekly sit-up and shuttle benchmarks. Recovery integrated via HRV monitoring.',
        'expertise': 'Kabaddi raider training,Defensive agility,PKL trial prep,Rural talent outreach',
        'specs': 'Kabaddi,Athletics,Strength & Conditioning,Sprint Training,Youth Development',
        'badges': 'Verified Coach,Elite Coach,Top Performer,Talent Scout,Mentor Award',
        'stats': (56, 420, 91.0, 24.1, 9, 8, 98),
        'certs': [
            ('PKL Certified Coach', 'Pro Kabaddi League', 'National', 2020),
            ('SAI Kabaddi Coach Level 2', 'Sports Authority of India', 'SAI', 2015),
            ('Strength & Conditioning Specialist', 'ISSA', 'International', 2018),
            ('Combat Sports First Aid', 'Indian Red Cross', 'Coaching', 2019),
        ],
        'reviews': [
            ('Deepak Yadav', 'Kabaddi', 5, 'Coach Vikram took me from district to state U-19 in under a year using SportsGauge agility data.'),
            ('Arjun Patel', 'Kabaddi', 5, 'Unmatched knowledge of kabaddi fitness. Every session has clear targets from my assessment history.'),
            ('Vishal Patil', 'Kabaddi', 4.5, 'Tough but fair. My core endurance scores doubled in six months.'),
        ],
    },
    'priya-nair': {
        'academy': 'Coastal Volleyball Institute, Kochi',
        'philosophy': 'Spike velocity and block jump height are trainable when you measure them consistently. I build coastal talent for national pipelines.',
        'approach': 'Jump-focused mesocycles with shoulder prehab. Monthly vertical jump retests on SportsGauge.',
        'expertise': 'Volleyball spike training,Beach volleyball conditioning,Jump mechanics,Coastal talent ID',
        'specs': 'Volleyball,Strength & Conditioning,Youth Development',
        'badges': 'Verified Coach,Talent Scout',
        'stats': (18, 95, 84.5, 17.2, 2, 45, 88),
        'certs': [
            ('FIVB Coaching Certificate Level 1', 'FIVB', 'International', 2021),
            ('Kerala Volleyball Association Coach', 'KVA', 'National', 2019),
            ('Sports Nutrition for Athletes', 'ISSN', 'Coaching', 2020),
        ],
        'reviews': [
            ('Revathi Nambiar', 'Volleyball', 5, 'Coach Nair improved my approach footwork using jump analytics. Scholarship ready now.'),
            ('Kavita Menon', 'Volleyball', 4.5, 'Detail-oriented coach who explains every metric on my dashboard.'),
        ],
    },
    'arjun-khanna': {
        'academy': 'Capital Football Academy, New Delhi',
        'philosophy': 'Modern football requires speed endurance and change of direction. AI assessments remove guesswork from academy selection.',
        'approach': 'AFC curriculum integrated with sprint-shuttle testing. Position-specific conditioning based on assessment profiles.',
        'expertise': 'Football academy management,Speed endurance,AIFF pathways,Goalkeeper athleticism',
        'specs': 'Football,Sprint Training,Endurance Training,Youth Development',
        'badges': 'Verified Coach,Elite Coach,Talent Scout',
        'stats': (41, 265, 86.8, 20.5, 5, 22, 90),
        'certs': [
            ('AFC C License', 'Asian Football Confederation', 'International', 2018),
            ('AIFF D License', 'All India Football Federation', 'National', 2016),
            ('SAI Football Coach', 'Sports Authority of India', 'SAI', 2014),
            ('Sports Psychology for Coaches', 'IOA', 'Coaching', 2021),
        ],
        'reviews': [
            ('Imran Sheikh', 'Football', 5, 'Coach Khanna connected my agility scores to AIFF district trials. Life-changing mentorship.'),
            ('Manoj Tiwari', 'Football', 4.5, 'Professional academy environment with clear performance benchmarks.'),
            ('Gopal Krishnan', 'Football', 5, 'Best structured football development program in Delhi NCR.'),
        ],
    },
    'meena-kulkarni': {
        'academy': 'Chennai Cricket High Performance Unit',
        'philosophy': 'Fast bowling is a biomechanical discipline. Core strength and sprint capacity predict durability and pace potential.',
        'approach': 'Workload management with sit-up and sprint monitoring. Seam position video analysis weekly.',
        'expertise': 'Fast bowling biomechanics,Fielding agility,U-19 cricket fitness,BCCI pathways',
        'specs': 'Cricket,Strength & Conditioning,Sprint Training,Youth Development',
        'badges': 'Verified Coach,Top Performer,Mentor Award',
        'stats': (29, 178, 88.0, 21.0, 3, 35, 91),
        'certs': [
            ('BCCI Level B Coach', 'BCCI', 'National', 2019),
            ('Fast Bowling Biomechanics', 'ECB Coach Education', 'International', 2020),
            ('Strength & Conditioning Level 2', 'NSCA', 'International', 2018),
        ],
        'reviews': [
            ('Komal Bishnoi', 'Cricket', 5, 'My pace increased 8 km/h after Coach Kulkarni targeted my core weaknesses from sit-up data.'),
            ('Karthik Nair', 'Cricket', 4.5, 'Excellent blend of cricket skill and fitness science.'),
        ],
    },
    'ramesh-pillai': {
        'academy': 'SAI Chennai Athletics Centre',
        'philosophy': 'Middle-distance success requires aerobic base plus speed reserve. I periodize both using objective endurance and sprint metrics.',
        'approach': 'Polarized training model with quarterly SportsGauge batteries. Lactate threshold sessions for advanced athletes.',
        'expertise': 'Middle distance,Cross country,Endurance periodization,School athletics',
        'specs': 'Athletics,Endurance Training,Youth Development,Sprint Training',
        'badges': 'Verified Coach,Elite Coach,Mentor Award',
        'stats': (37, 245, 90.2, 23.5, 6, 18, 94),
        'certs': [
            ('SAI Athletics Coach', 'Sports Authority of India', 'SAI', 2012),
            ('IAAF Endurance Coaching', 'World Athletics', 'International', 2017),
            ('Middle Distance Specialist', 'AFI', 'National', 2015),
        ],
        'reviews': [
            ('Lakshmi Iyer', 'Athletics', 5, 'Coach Pillai helped me qualify for state cross country with structured endurance blocks.'),
            ('Sanjay Malhotra', 'Athletics', 5, 'He saw my 400m potential when others only saw sprint scores.'),
        ],
    },
    'sonal-gupta': {
        'academy': 'Rajasthan Basketball Academy, Jaipur',
        'philosophy': 'Women\'s basketball in India needs stronger athletic foundations. I prioritize agility, jump, and core metrics before skill overload.',
        'approach': 'Foundation phase for new athletes, performance phase for state-level players. Bi-weekly assessment reviews.',
        'expertise': 'Women\'s basketball,Agility development,State team preparation,Grassroots camps',
        'specs': 'Basketball,Youth Development,Strength & Conditioning,Endurance Training',
        'badges': 'Verified Coach,Talent Scout,Mentor Award',
        'stats': (24, 156, 85.5, 18.9, 2, 42, 87),
        'certs': [
            ('NSNIS Diploma', 'Netaji Subhas National Institute of Sports', 'SAI', 2018),
            ('FIBA Mini Basketball Coach', 'FIBA', 'International', 2020),
            ('Youth Development Specialist', 'BFI', 'National', 2019),
        ],
        'reviews': [
            ('Ananya Singh', 'Basketball', 5, 'Coach Gupta built my confidence and my vertical jump together. Now on national trial shortlist.'),
            ('Nitin Hegde', 'Basketball', 4.5, 'Supportive coach with excellent communication about assessment progress.'),
        ],
    },
}


def _success_stories_for_coach(coach, athletes):
    stories = []
    for i, link in enumerate(coach.athlete_links[:4]):
        u = link.athlete
        if not u:
            continue
        assessments = Assessment.query.filter_by(user_id=u.id, validation_status='Valid').all()
        best = max((a.score for a in assessments), default=0)
        stories.append({
            'athlete_name': u.full_name,
            'username': u.username,
            'sport': u.sports_interest,
            'achievement': (u.badges or 'SportsGauge Assessed').split(',')[0],
            'improvement_pct': round(15 + (i * 3.5), 1),
            'photo_seed': u.username or f'athlete-{u.id}',
        })
    if len(stories) < 3:
        fallbacks = [
            ('Rising State Athlete', 'Athletics', 'District Gold', 18.5),
            ('Academy Select', coach.specialization, 'SAI Camp Invite', 22.0),
            ('National Trialist', coach.specialization, 'Top 5% Nationally', 25.3),
        ]
        for j, (name, sport, ach, imp) in enumerate(fallbacks[: 3 - len(stories)]):
            stories.append({
                'athlete_name': name, 'username': None, 'sport': sport,
                'achievement': ach, 'improvement_pct': imp, 'photo_seed': f'{coach.slug}-s{j}',
            })
    return stories


def seed_coach_profiles():
    athletes = User.query.filter_by(role='athlete').order_by(User.id).all()
    if not athletes:
        return

    for slug, data in PROFILE_DATA.items():
        coach = Coach.query.filter_by(slug=slug).first()
        if not coach:
            continue

        managed, reviewed, success, imp, national, ranking, completion = data['stats']
        coach.academy_organization = data['academy']
        coach.coaching_philosophy = data['philosophy']
        coach.training_approach = data['approach']
        coach.areas_of_expertise = data['expertise']
        coach.specializations = data['specs']
        coach.badges = data['badges']
        coach.athletes_managed = managed
        coach.assessments_reviewed = reviewed
        coach.success_rate = success
        coach.improvement_pct = imp
        coach.national_athletes_produced = national
        coach.coach_ranking = ranking
        coach.profile_completion = completion
        coach.banner_url = IMG(f'banner-{slug}')
        if not coach.photo_url:
            coach.photo_url = IMG(f'coach-{slug}')

        if not CoachCertification.query.filter_by(coach_id=coach.id).first():
            for title, issuer, ctype, year in data['certs']:
                db.session.add(CoachCertification(
                    coach_id=coach.id, title=title, issuer=issuer, cert_type=ctype, year=year,
                ))

        if not CoachReview.query.filter_by(coach_id=coach.id).first():
            for name, sport, rating, text in data['reviews']:
                db.session.add(CoachReview(
                    coach_id=coach.id, athlete_name=name, sport=sport, rating=rating, review_text=text,
                ))

        if not CoachAthlete.query.filter_by(coach_id=coach.id).first():
            start_idx = (coach.id * 3) % max(len(athletes) - 5, 1)
            for u in athletes[start_idx:start_idx + 6]:
                db.session.add(CoachAthlete(coach_id=coach.id, user_id=u.id, status='active'))
                for a in Assessment.query.filter_by(user_id=u.id).limit(2):
                    if not CoachAssessmentReview.query.filter_by(
                        coach_id=coach.id, assessment_id=a.id
                    ).first():
                        status = 'reviewed' if a.validation_status == 'Valid' else 'pending'
                        db.session.add(CoachAssessmentReview(
                            coach_id=coach.id, assessment_id=a.id,
                            review_status=status,
                            coach_notes='Strong form. Continue current block.' if status == 'reviewed' else None,
                        ))

        if not CoachSession.query.filter_by(coach_id=coach.id).first():
            now = datetime.utcnow()
            sessions = [
                ('Performance Review', athletes[(coach.id) % len(athletes)].full_name, 'Consultation', 2),
                ('Sprint Technique Session', athletes[(coach.id + 1) % len(athletes)].full_name, 'Training', 3),
                ('Assessment Debrief', athletes[(coach.id + 2) % len(athletes)].full_name, 'Review', 5),
                ('Group Conditioning', 'Academy Batch A', 'Training', 7),
            ]
            for title, aname, stype, days in sessions:
                db.session.add(CoachSession(
                    coach_id=coach.id, title=title, athlete_name=aname,
                    session_type=stype, start_at=now + timedelta(days=days), status='scheduled',
                ))

    db.session.commit()
