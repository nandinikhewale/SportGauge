"""Seed ranked demo athletes with validated assessments for leaderboard & talent pages."""
from datetime import datetime, timedelta
from models import db, User, Assessment, slugify

DEMO_ATHLETES = [
    ('Aditya Rao', 'Maharashtra', 'Pune', 'Athletics', 'Male', 17, 92.4, 'National Camp'),
    ('Kavita Menon', 'Kerala', 'Kochi', 'Volleyball', 'Female', 16, 89.1, 'State Champion'),
    ('Harpreet Kaur', 'Punjab', 'Ludhiana', 'Athletics', 'Female', 18, 91.8, 'Khelo India'),
    ('Suresh Naidu', 'Andhra Pradesh', 'Vijayawada', 'Cricket', 'Male', 19, 87.5, 'District Elite'),
    ('Fatima Khan', 'Uttar Pradesh', 'Lucknow', 'Basketball', 'Female', 17, 88.2, 'Verified'),
    ('Deepak Yadav', 'Bihar', 'Gaya', 'Kabaddi', 'Male', 18, 90.6, 'Top Performer'),
    ('Lakshmi Iyer', 'Tamil Nadu', 'Coimbatore', 'Athletics', 'Female', 16, 86.9, 'Emerging'),
    ('Manoj Tiwari', 'Madhya Pradesh', 'Bhopal', 'Football', 'Male', 17, 85.4, 'Scout Pick'),
    ('Sneha Reddy', 'Telangana', 'Hyderabad', 'Badminton', 'Female', 15, 84.7, 'Youth Elite'),
    ('Rahul Verma', 'Haryana', 'Hisar', 'Wrestling', 'Male', 20, 93.1, 'National Rank'),
    ('Pooja Das', 'West Bengal', 'Kolkata', 'Athletics', 'Female', 17, 88.8, 'Verified'),
    ('Imran Sheikh', 'Jammu and Kashmir', 'Srinagar', 'Football', 'Male', 18, 83.9, 'Rising Star'),
    ('Neha Joshi', 'Gujarat', 'Surat', 'Volleyball', 'Female', 16, 87.2, 'AI Recommended'),
    ('Karthik Nair', 'Karnataka', 'Mysuru', 'Cricket', 'Male', 17, 86.1, 'District Captain'),
    ('Ananya Singh', 'Delhi', 'New Delhi', 'Basketball', 'Female', 18, 90.2, 'National Trials'),
    ('Vishal Patil', 'Maharashtra', 'Nagpur', 'Kabaddi', 'Male', 19, 89.5, 'State U-19'),
    ('Divya Sharma', 'Rajasthan', 'Udaipur', 'Athletics', 'Female', 16, 85.8, 'Emerging'),
    ('Gopal Krishnan', 'Tamil Nadu', 'Madurai', 'Football', 'Male', 17, 84.3, 'Verified'),
    ('Ishita Bose', 'West Bengal', 'Siliguri', 'Weightlifting', 'Female', 18, 91.2, 'Junior National'),
    ('Amit Chauhan', 'Uttarakhand', 'Dehradun', 'Athletics', 'Male', 17, 88.0, 'Mountain Games'),
]


def seed_demo_athletes():
    if User.query.filter(User.email.like('demo.athlete.%')).count() >= len(DEMO_ATHLETES):
        return
    tests = [
        ('situp', lambda s: min(s * 0.45, 50)),
        ('jump', lambda s: min(s * 0.6, 70)),
        ('sprint', lambda s: max(8.5, 14 - s * 0.05)),
        ('shuttle', lambda s: max(9.0, 18 - s * 0.06)),
    ]
    for i, (name, state, district, sport, gender, age, best, badge) in enumerate(DEMO_ATHLETES):
        email = f'demo.athlete.{i + 1}@sportsgauge.in'
        if User.query.filter_by(email=email).first():
            continue
        base = slugify(name)
        username = f'{base}-demo{i + 1}'
        u = User(
            full_name=name, username=username, age=age, gender=gender,
            mobile_number=f'9000000{i:04d}', email=email, password_hash='demo123',
            state=state, district=district, sports_interest=sport,
            height=165 + (i % 20), weight=55 + (i % 25), role='athlete',
            bio=f'{sport} athlete from {district}, {state}. Identified through SportsGauge AI assessments.',
            is_verified=(i % 3 == 0), is_featured=(i == 0),
            badges=f'{badge},SportsGauge Assessed',
        )
        db.session.add(u)
        db.session.flush()
        for test_name, score_fn in tests:
            sc = score_fn(best)
            db.session.add(Assessment(
                user_id=u.id, test_name=test_name,
                score=round(sc, 2), ai_confidence=round(88 + (i % 10), 1),
                validation_status='Valid',
                date=datetime.utcnow() - timedelta(days=30 - i),
            ))
    db.session.commit()
