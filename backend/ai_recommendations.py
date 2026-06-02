"""Generate sport recommendations from assessment history and profile."""

SPORT_PROFILES = {
    'Athletics': {'situp': 0.2, 'jump': 0.35, 'sprint': 0.35, 'shuttle': 0.1},
    'Football': {'situp': 0.15, 'jump': 0.2, 'sprint': 0.3, 'shuttle': 0.35},
    'Cricket': {'situp': 0.2, 'jump': 0.15, 'sprint': 0.25, 'shuttle': 0.4},
    'Basketball': {'situp': 0.15, 'jump': 0.4, 'sprint': 0.25, 'shuttle': 0.2},
    'Volleyball': {'situp': 0.1, 'jump': 0.45, 'sprint': 0.15, 'shuttle': 0.3},
    'Kabaddi': {'situp': 0.25, 'jump': 0.15, 'sprint': 0.2, 'shuttle': 0.4},
    'Weightlifting': {'situp': 0.35, 'jump': 0.2, 'sprint': 0.15, 'shuttle': 0.3},
}


def _norm_score(test_name, score):
    if test_name == 'situp':
        return min(score / 50.0, 1.0)
    if test_name == 'jump':
        return min(score / 70.0, 1.0)
    if test_name == 'sprint':
        return max(0, 1.0 - (score / 15.0))
    if test_name == 'shuttle':
        return max(0, 1.0 - (score / 20.0))
    return min(score / 100.0, 1.0)


def generate_recommendations(user, assessments):
    scores = {}
    for a in assessments:
        if a.validation_status == 'Valid':
            scores[a.test_name] = max(scores.get(a.test_name, 0), _norm_score(a.test_name, a.score))

    if not scores:
        interest = user.sports_interest or 'Athletics'
        return {
            'best_sports': interest,
            'strengths': 'Complete your first validated assessment to unlock detailed AI analysis.',
            'weaknesses': 'Assessment data pending.',
            'improvements': 'Take sit-up, vertical jump, sprint, and shuttle tests for a full profile.',
            'training_plan': f'Focus on fundamentals for {interest}. Train 4–5 days per week with recovery days.',
        }

    sport_scores = {}
    for sport, weights in SPORT_PROFILES.items():
        total = sum(scores.get(t, 0) * w for t, w in weights.items())
        sport_scores[sport] = round(total, 3)

    ranked = sorted(sport_scores.items(), key=lambda x: x[1], reverse=True)
    best = ', '.join([s for s, _ in ranked[:3]])

    strengths = []
    weaknesses = []
    if scores.get('situp', 0) >= 0.65:
        strengths.append('Core endurance and trunk stability')
    else:
        weaknesses.append('Core endurance — add progressive sit-up circuits')
    if scores.get('jump', 0) >= 0.65:
        strengths.append('Explosive lower-body power')
    else:
        weaknesses.append('Vertical power — plyometrics and squat strength')
    if scores.get('sprint', 0) >= 0.65:
        strengths.append('Linear speed and acceleration')
    else:
        weaknesses.append('Sprint mechanics — resisted runs and technique drills')
    if scores.get('shuttle', 0) >= 0.65:
        strengths.append('Agility and change-of-direction')
    else:
        weaknesses.append('Agility — cone drills and shuttle repeats')

    improvements = [
        'Prioritize weak test categories with 2 focused sessions per week',
        'Film sessions for form review using SportsGauge assessments',
        'Retest every 4–6 weeks to track progress',
    ]

    plan = (
        f'Week 1–2: Technique + base conditioning for {user.sports_interest}. '
        f'Week 3–4: Sport-specific drills aligned with {ranked[0][0]}. '
        f'Week 5–6: Peak testing window — repeat all four assessments.'
    )

    return {
        'best_sports': best,
        'strengths': '; '.join(strengths) if strengths else 'Balanced athletic foundation',
        'weaknesses': '; '.join(weaknesses) if weaknesses else 'Continue building consistency',
        'improvements': '; '.join(improvements),
        'training_plan': plan,
    }
