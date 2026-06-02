from datetime import datetime, timedelta
from models import db, User, Coach, NewsArticle, Event, Academy, Scholarship, slugify
from seed_demo_athletes import seed_demo_athletes

IMG = lambda seed: f'https://picsum.photos/seed/sg-{seed}/800/500'


def _upsert_coach(slug, **kwargs):
    c = Coach.query.filter_by(slug=slug).first()
    if not c:
        c = Coach(slug=slug, **kwargs)
        db.session.add(c)
    return c


def _upsert_news(slug, **kwargs):
    n = NewsArticle.query.filter_by(slug=slug).first()
    if not n:
        n = NewsArticle(slug=slug, **kwargs)
        db.session.add(n)
    return n


def _upsert_event(slug, **kwargs):
    e = Event.query.filter_by(slug=slug).first()
    if not e:
        e = Event(slug=slug, **kwargs)
        db.session.add(e)
    return e


def _upsert_academy(slug, **kwargs):
    a = Academy.query.filter_by(slug=slug).first()
    if not a:
        a = Academy(slug=slug, **kwargs)
        db.session.add(a)
    return a


def seed_ecosystem():
    coaches_data = [
        ('rajesh-mehta', 'Rajesh Mehta', 'rajesh.coach@sportsgauge.in', 'Maharashtra', 'Mumbai', 'Athletics', 12,
         'SAI Level 2, IAAF Youth Coach', 'Former Maharashtra state sprint coach with 12 years developing youth track athletes. Specializes in start technique and acceleration phases.', True, 48, 4.9),
        ('anita-desai', 'Anita Desai', 'anita.coach@sportsgauge.in', 'Karnataka', 'Bengaluru', 'Basketball', 8,
         'FIBA Level 1, Sports Science Diploma', 'Performance coach integrating vertical jump analytics with court-specific conditioning for U-17 and U-19 players.', True, 32, 4.8),
        ('vikram-singh-coach', 'Vikram Singh', 'vikram.coach@sportsgauge.in', 'Haryana', 'Karnal', 'Kabaddi', 15,
         'PKL Certified, Strength & Conditioning', 'Grassroots kabaddi expert from Haryana with proven pipeline to state and Pro Kabaddi League trials.', True, 56, 4.95),
        ('priya-nair', 'Priya Nair', 'priya.coach@sportsgauge.in', 'Kerala', 'Kochi', 'Volleyball', 6,
         'FIVB Coaching Certificate', 'Coastal volleyball development specialist focusing on spike velocity and defensive agility metrics.', False, 18, 4.6),
        ('arjun-khanna', 'Arjun Khanna', 'arjun.coach@sportsgauge.in', 'Delhi', 'New Delhi', 'Football', 10,
         'AFC C License, AIFF D License', 'Academy director linking SportsGauge assessment data to AIFF district talent pathways.', True, 41, 4.7),
        ('meena-kulkarni', 'Meena Kulkarni', 'meena.coach@sportsgauge.in', 'Maharashtra', 'Nagpur', 'Cricket', 9,
         'BCCI Level B, Fast Bowling Biomechanics', 'Pace bowling and fielding coach using video analysis for seam position and throw accuracy.', True, 29, 4.85),
        ('ramesh-pillai', 'Ramesh Pillai', 'ramesh.coach@sportsgauge.in', 'Tamil Nadu', 'Chennai', 'Athletics', 14,
         'SAI Coach, Middle Distance Specialist', 'Middle-distance program architect for school and college athletes across Tamil Nadu.', True, 37, 4.75),
        ('sonal-gupta', 'Sonal Gupta', 'sonal.coach@sportsgauge.in', 'Rajasthan', 'Jaipur', 'Basketball', 7,
         'NSNIS Diploma, Youth Development', 'Women\'s basketball pathway coach with emphasis on agility and core strength from assessment data.', True, 24, 4.65),
    ]
    for slug, name, email, state, dist, spec, exp, cert, bio, verified, managed, rating in coaches_data:
        _upsert_coach(slug, full_name=name, email=email, password_hash='coach123', state=state, district=dist,
                      specialization=spec, experience_years=exp, certifications=cert, bio=bio,
                      is_verified=verified, athletes_managed=managed, rating=rating, photo_url=IMG(f'coach-{slug}'))

    news_items = [
        ('Khelo India Youth Games 2026 Registration Opens Nationwide', 'khelo-india-2026-registration', 'Khelo India',
         'The Ministry of Youth Affairs and Sports has opened registration for Khelo India Youth Games 2026 across all districts. Athletes with SportsGauge validated assessments receive priority screening at state nodal centres.',
         'Registration for Khelo India Youth Games 2026 is now open across all states with expanded AI talent screening. State sports departments will accept SportsGauge assessment reports as supplementary fitness documentation for district nominations. Athletes aged 12–21 in Olympic and indigenous sports disciplines are encouraged to complete all four core tests before regional deadlines.'),
        ('Neeraj Chopra Training Group Announces Olympic Preparation Camp', 'olympic-javelin-camp-2026', 'Olympics',
         'Senior athletics officials confirmed a national javelin preparation camp for Paris-cycle athletes with biomechanical testing requirements.',
         'The Athletics Federation of India will host an Olympic preparation camp for javelin and combined events athletes in March 2026. Participants must submit recent validated fitness assessments including explosive power and core endurance metrics. SportsGauge partners will provide on-site assessment stations for invited athletes.'),
        ('BCCI Introduces U-19 Fitness Benchmarks for State Squads', 'bcc-u19-fitness-benchmarks', 'Cricket',
         'New minimum fitness standards for U-19 state cricket squads include sprint, agility, and core strength scores aligned with national sports science guidelines.',
         'The Board of Control for Cricket in India has published U-19 fitness benchmarks requiring state associations to document athlete performance in standardized tests. Several associations have adopted SportsGauge reports to streamline talent identification before zonal championships.'),
        ('Maharashtra Basketball Federation Partners with AI Assessment Platforms', 'mh-basketball-ai-partnership', 'Basketball',
         'Vertical jump and shuttle run data will inform selection for Maharashtra U-17 boys and girls championships.',
         'The Maharashtra Basketball Federation announced a partnership with digital assessment providers including SportsGauge to reduce selection bias in district trials. Coaches will receive comparative analytics dashboards for each registered athlete.'),
        ('Pro Kabaddi League Talent Scouting Expands to 400 Districts', 'pkl-district-scouting-2026', 'Kabaddi',
         'PKL franchises will use standardized agility and raiding fitness scores during grassroots scouting camps.',
         'Pro Kabaddi League organizers expanded district-level scouting to 400 locations this season. Raiders and defenders will undergo SportsGauge-compatible agility and core strength evaluations before franchise shortlists are finalized.'),
        ('Government Announces ₹500 Crore Rural Sports Infrastructure Fund', 'rural-sports-infrastructure-2026', 'Government Sports News',
         'The fund targets construction of multi-sport grounds and mobile assessment units in aspirational districts.',
         'The Union Cabinet approved a ₹500 crore rural sports infrastructure fund focused on multi-sport grounds, equipment banks, and mobile assessment units. State governments must submit utilization plans aligned with Khelo India monitoring frameworks by July 2026.'),
        ('Indian Mixed Relay Team Qualifies for World Athletics Championships', 'india-relay-world-qualification', 'Athletics',
         'The 4x400 mixed relay squad secured qualification with season-best performances at the national inter-state meet.',
         'India\'s 4x400 mixed relay team earned World Athletics Championships qualification after record performances in Odisha. Sports scientists credited structured speed endurance programming informed by periodic AI-validated sprint assessments.'),
        ('SAI Launches National Talent Identification Grid for Olympic Sports', 'sai-talent-grid-2026', 'Government Sports News',
         'A centralized database will aggregate assessment scores from schools, academies, and state federations.',
         'Sports Authority of India launched the National Talent Identification Grid to centralize fitness and skill data from schools, academies, and federations. SportsGauge is listed among approved assessment partners for athletics, basketball, volleyball, and combat sports.'),
        ('Kerala Volleyball Association Opens Coastal Talent Pipeline', 'kerala-volleyball-pipeline', 'Volleyball',
         'Spike reach and block jump metrics will standardize selection for junior state camps.',
         'The Kerala Volleyball Association opened registration for coastal talent pipelines with mandatory vertical jump and agility testing. Partner academies will upload SportsGauge reports directly to association portals.'),
        ('SportsGauge Surpasses 30,000 Validated Assessments Nationwide', 'sportsgauge-30k-milestone', 'Athletics',
         'Platform usage grew 40% in Q1 2026 with expansion into northeastern state sports councils.',
         'SportsGauge crossed 30,000 validated AI assessments nationwide, with strongest adoption in Maharashtra, Haryana, Karnataka, and Uttar Pradesh. State sports councils in Assam and Manipur signed memoranda of understanding for official pilot programs.'),
    ]
    now = datetime.utcnow()
    for i, (title, slug, cat, summary, content) in enumerate(news_items):
        _upsert_news(slug, title=title, summary=summary, content=content, category=cat,
                     image_url=IMG(f'news-{slug}'), is_featured=(i == 0), is_trending=(i < 4),
                     published_at=now - timedelta(days=i * 3), author='SportsGauge Editorial')

    events_data = [
        ('Khelo India District Athletics Trials — Maharashtra', 'ki-mh-athletics-2026', 'Khelo India', 'Athletics',
         'Maharashtra', 'Pune', 'Shree Shiv Chhatrapati Sports Complex, Balewadi',
         'Open district athletics trials for U-14, U-17, and U-19 categories. Valid SportsGauge sprint and jump assessments required for automatic pre-qualification.', 14),
        ('National Kabaddi Talent Camp — Haryana', 'national-kabaddi-camp-2026', 'National Events', 'Kabaddi',
         'Haryana', 'Karnal', 'Babu Lal Nehru Stadium, Karnal',
         'Five-day residential camp for top 120 raiders and defenders identified through state assessments. Registration closes two weeks before start.', 30),
        ('Delhi NCR Sprint & Agility Combine', 'delhi-sprint-combine-2026', 'District Trials', 'Athletics',
         'Delhi', 'New Delhi', 'Jawaharlal Nehru Stadium, New Delhi',
         'One-day combine for 100m, 200m, and shuttle run benchmarks. Scouts from SAI and state units attending.', 7),
        ('Tamil Nadu State Basketball Championship U-17', 'tn-basketball-u17-2026', 'State Championships', 'Basketball',
         'Tamil Nadu', 'Chennai', 'Kalaivanar Arangam Indoor Arena',
         'State championship with preliminary rounds across four zones. Minimum vertical jump and shuttle scores apply for wildcard entries.', 21),
        ('Khelo India Football Talent Search — Northeast', 'ki-football-northeast-2026', 'Khelo India', 'Football',
         'Assam', 'Guwahati', 'Indira Gandhi Athletic Stadium',
         'Regional football talent search for boys and girls U-15. Combine includes sprint, agility, and endurance assessments.', 45),
        ('All India Inter-University Athletics Meet', 'university-athletics-2026', 'National Events', 'Athletics',
         'Odisha', 'Bhubaneswar', 'Kalinga Stadium',
         'Inter-university athletics championship with SportsGauge verification stations for record attempts.', 60),
        ('Summer Sports Performance Camp — Bengaluru', 'summer-performance-camp-2026', 'Training Camps', 'Multi-Sport',
         'Karnataka', 'Bengaluru', 'Sports Authority of India Centre, Bengaluru',
         'Two-week residential camp covering athletics, basketball, and volleyball with daily AI progress tracking.', 40),
        ('Gujarat Rural Kabaddi Championship', 'gujarat-rural-kabaddi-2026', 'District Trials', 'Kabaddi',
         'Gujarat', 'Ahmedabad', 'EKA Arena by TransStadia',
         'District-wise rural kabaddi championship feeding into state team selection. Free on-site assessments available.', 18),
    ]
    for title, slug, etype, sport, state, district, venue, desc, days in events_data:
        start = now + timedelta(days=days)
        _upsert_event(slug, title=title, description=desc, event_type=etype, sport=sport,
                      state=state, district=district, venue=venue, image_url=IMG(f'event-{slug}'),
                      start_date=start, end_date=start + timedelta(days=2), registration_open=True)

    academies_data = [
        ('Elite Velocity Athletics Academy', 'elite-velocity', 'Athletics,Sprint,Long Jump,High Jump',
         'Maharashtra', 'Pune', 'Plot 12, Balewadi Sports City, Pune 411045', '+91-20-2567-8901', 4.8),
        ('Hoops Nation Basketball Centre', 'hoops-nation', 'Basketball',
         'Karnataka', 'Bengaluru', 'Koramangala Indoor Complex, Bengaluru 560034', '+91-80-4412-3300', 4.6),
        ('Haryana Kabaddi Excellence Centre', 'haryana-kabaddi', 'Kabaddi,Wrestling',
         'Haryana', 'Rohtak', 'Maharshi Dayanand University Sports Complex, Rohtak', '+91-1262-274-500', 4.9),
        ('Coastal Volleyball Institute', 'coastal-volleyball', 'Volleyball,Beach Volleyball',
         'Kerala', 'Kochi', 'Marine Drive Sports Hub, Kochi 682031', '+91-484-220-7788', 4.5),
        ('Capital Football Academy', 'capital-football', 'Football',
         'Delhi', 'New Delhi', 'Dwarka Sector 19 Sports Complex, New Delhi 110075', '+91-11-4982-1100', 4.7),
        ('Chennai Cricket High Performance Unit', 'chennai-cricket-hpu', 'Cricket',
         'Tamil Nadu', 'Chennai', 'M.A. Chidambaram Stadium Campus, Chennai 600006', '+91-44-2854-6600', 4.85),
        ('Rajasthan Desert Runners Club', 'rajasthan-desert-runners', 'Athletics,Cross Country',
         'Rajasthan', 'Jaipur', 'SMS Stadium Complex, Jaipur 302005', '+91-141-256-9900', 4.55),
        ('Northeast United Sports Academy', 'northeast-united-sports', 'Football,Athletics,Weightlifting',
         'Assam', 'Guwahati', 'Sarusajai Sports Complex, Guwahati 781040', '+91-361-227-4400', 4.7),
    ]
    for name, slug, sports, state, district, address, phone, rating in academies_data:
        _upsert_academy(slug, name=name, sports_offered=sports, state=state, district=district,
                        address=address, contact_phone=phone, contact_email=f'admissions@{slug}.in',
                        website=f'https://{slug}.sportsgauge.in', rating=rating, image_url=IMG(f'academy-{slug}'),
                        map_lat=20.5 + (hash(slug) % 10), map_lng=72.8 + (hash(slug) % 10))

    if Scholarship.query.count() < 6:
        scholarships = [
            ('Khelo India Athlete Scholarship Scheme 2026', 'khelo-india-scholarship-2026', 'Government of India', 'Government',
             'Annual financial support up to ₹6 lakh for national camp athletes covering coaching, equipment, nutrition, and travel.',
             'Indian citizens aged 12–21 with state or national representation in Khelo India sports disciplines.'),
            ('SAI National Sports Talent Contest', 'sai-talent-contest-2026', 'Sports Authority of India', 'Talent Program',
             'Identification pathway for athletes aged 8–14 with admission to SAI training centres based on multi-test performance.',
             'Age 8–14 with parental consent and school enrollment. SportsGauge validated assessment recommended.'),
            ('State Engineering Sports Quota Admissions', 'state-sports-quota-2026', 'State Education Boards', 'Sports Quota',
             'Reserved undergraduate seats for state-level medalists in recognized sports championships.',
             'State-level medal in last 24 months with documented federation certificate and fitness assessment.'),
            ('SportsGauge Academy Merit Scholarship', 'sportsgauge-academy-merit', 'SportsGauge Foundation', 'Scholarship',
             'Up to 75% fee waiver at partner academies for athletes scoring in top 10% nationally on combined assessments.',
             'Valid SportsGauge profile with four validated tests and coach recommendation letter.'),
            ('Rural Athlete Nutrition & Equipment Grant', 'rural-athlete-grant-2026', 'Ministry of Youth Affairs', 'Government',
             'Grants for nutrition supplements and equipment for athletes from aspirational districts.',
             'Residence in aspirational district with district sports officer endorsement.'),
            ('Women in Sports Leadership Fellowship', 'women-sports-fellowship-2026', 'Fit India Mission', 'Talent Program',
             'Fellowship for female athletes transitioning to coaching with certification fee support.',
             'Female athletes aged 18–28 with minimum state-level participation.'),
        ]
        for title, slug, provider, cat, desc, elig in scholarships:
            if not Scholarship.query.filter_by(slug=slug).first():
                db.session.add(Scholarship(
                    title=title, slug=slug, provider=provider, category=cat, description=desc,
                    eligibility=elig, deadline=now + timedelta(days=90 + hash(slug) % 60),
                    link_url='https://sportsgauge.in/scholarships',
                ))

    for u in User.query.filter_by(role='athlete').all():
        if not u.username:
            u.username = f'{slugify(u.full_name)}-{u.id}'
        if not u.badges:
            u.badges = 'Registered,SportsGauge Assessed'

    seed_demo_athletes()
    db.session.commit()
    from seed_coach_profiles import seed_coach_profiles
    seed_coach_profiles()
