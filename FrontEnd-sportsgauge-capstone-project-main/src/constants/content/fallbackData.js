const IMG = (seed) => `https://picsum.photos/seed/sg-fb-${seed}/800/500`;

export const FALLBACK_COACHES = [
  { id: 1, full_name: 'Rajesh Mehta', slug: 'rajesh-mehta', state: 'Maharashtra', district: 'Mumbai', specialization: 'Athletics', experience_years: 12, is_verified: true, athletes_managed: 48, rating: 4.9, photo_url: IMG('c1') },
  { id: 2, full_name: 'Anita Desai', slug: 'anita-desai', state: 'Karnataka', district: 'Bengaluru', specialization: 'Basketball', experience_years: 8, is_verified: true, athletes_managed: 32, rating: 4.8, photo_url: IMG('c2') },
  { id: 3, full_name: 'Vikram Singh', slug: 'vikram-singh-coach', state: 'Haryana', district: 'Karnal', specialization: 'Kabaddi', experience_years: 15, is_verified: true, athletes_managed: 56, rating: 4.95, photo_url: IMG('c3') },
];

export const FALLBACK_NEWS = [
  { id: 1, title: 'Khelo India Youth Games 2026 Registration Opens Nationwide', slug: 'khelo-india-2026-registration', category: 'Khelo India', summary: 'Registration for Khelo India Youth Games 2026 is open across all states with AI-assisted talent screening at nodal centres.', image_url: IMG('n1'), is_featured: true },
  { id: 2, title: 'Indian Athletes Shine at Asian Indoor Athletics Championships', slug: 'asian-indoor-athletics-2026', category: 'Olympics', summary: 'Indian sprinters and jumpers secure multiple medals, strengthening Olympic qualification prospects.', image_url: IMG('n2') },
  { id: 3, title: 'BCCI Introduces U-19 Fitness Benchmarks for State Squads', slug: 'bcc-u19-fitness', category: 'Cricket', summary: 'State cricket associations adopt standardized sprint and agility benchmarks for junior selection.', image_url: IMG('n3') },
];

export const FALLBACK_LEADERBOARD = [
  { rank: 1, user_id: 1, username: 'rahul-verma-demo1', full_name: 'Rahul Verma', state: 'Haryana', sport: 'Wrestling', score: 93.1, ai_confidence: 96, is_verified: true },
  { rank: 2, user_id: 2, username: 'aditya-rao-demo2', full_name: 'Aditya Rao', state: 'Maharashtra', sport: 'Athletics', score: 92.4, ai_confidence: 94, is_verified: true },
  { rank: 3, user_id: 3, username: 'ishita-bose-demo19', full_name: 'Ishita Bose', state: 'West Bengal', sport: 'Weightlifting', score: 91.2, ai_confidence: 93, is_verified: true },
  { rank: 4, user_id: 4, username: 'harpreet-kaur-demo3', full_name: 'Harpreet Kaur', state: 'Punjab', sport: 'Athletics', score: 91.8, ai_confidence: 92, is_verified: false },
  { rank: 5, user_id: 5, username: 'deepak-yadav-demo6', full_name: 'Deepak Yadav', state: 'Bihar', sport: 'Kabaddi', score: 90.6, ai_confidence: 91, is_verified: true },
];

export const FALLBACK_TALENT = [
  { id: 1, username: 'aditya-rao-demo2', full_name: 'Aditya Rao', state: 'Maharashtra', district: 'Pune', best_score: 92.4, is_verified: true, badges: ['National Camp', 'SportsGauge Assessed'] },
  { id: 2, username: 'kavita-menon-demo3', full_name: 'Kavita Menon', state: 'Kerala', district: 'Kochi', best_score: 89.1, is_verified: true, badges: ['State Champion'] },
  { id: 3, username: 'neha-joshi-demo14', full_name: 'Neha Joshi', state: 'Gujarat', district: 'Surat', best_score: 87.2, is_verified: false, badges: ['AI Recommended'] },
];

export const FALLBACK_EVENTS = [
  { id: 1, title: 'Delhi NCR Sprint & Agility Combine', slug: 'delhi-sprint-combine-2026', event_type: 'District Trials', sport: 'Athletics', state: 'Delhi', venue: 'Jawaharlal Nehru Stadium', start_date: new Date(Date.now() + 7 * 86400000).toISOString(), description: 'One-day combine for sprint and agility benchmarks with SAI scouts attending.', image_url: IMG('e1'), registration_open: true },
  { id: 2, title: 'Khelo India District Athletics Trials — Maharashtra', slug: 'ki-mh-athletics-2026', event_type: 'Khelo India', sport: 'Athletics', state: 'Maharashtra', venue: 'Balewadi Sports Complex', start_date: new Date(Date.now() + 14 * 86400000).toISOString(), description: 'District trials for U-14, U-17, and U-19 athletics categories.', image_url: IMG('e2'), registration_open: true },
];

export const FALLBACK_ACADEMIES = [
  { id: 1, name: 'Elite Velocity Athletics Academy', slug: 'elite-velocity', sports_offered: ['Athletics', 'Sprint', 'Long Jump'], state: 'Maharashtra', district: 'Pune', address: 'Balewadi Sports City, Pune', contact_phone: '+91-20-2567-8901', rating: 4.8, facilities: 'Olympic-standard track, strength lab, sports science clinic' },
  { id: 2, name: 'Haryana Kabaddi Excellence Centre', slug: 'haryana-kabaddi', sports_offered: ['Kabaddi', 'Wrestling'], state: 'Haryana', district: 'Rohtak', address: 'MDU Sports Complex, Rohtak', contact_phone: '+91-1262-274-500', rating: 4.9, facilities: 'Indoor mat halls, recovery centre, hostel for 120 athletes' },
];

export const ACADEMY_FACILITIES = {
  'elite-velocity': '400m synthetic track, plyometric zone, hydrotherapy, biomechanics lab, athlete hostel (80 beds).',
  'hoops-nation': 'FIBA-spec indoor courts (2), vertical jump stations, video analysis suite, strength & conditioning gym.',
  'haryana-kabaddi': 'Professional kabaddi mats, wrestling hall, nutrition kitchen, medical room, residential campus.',
  'coastal-volleyball': 'Indoor and beach courts, altitude training chamber, physiotherapy, coastal conditioning track.',
  'capital-football': 'FIFA-quality turf, goalkeeper academy, tactical classroom, GPS tracking during sessions.',
};

export const FALLBACK_STATS = {
  athletes_registered: 12847,
  assessments_completed: 31256,
  coaches_registered: 428,
  events_conducted: 186,
};

export const FALLBACK_SCHOLARSHIPS = [
  { id: 1, title: 'Khelo India Athlete Scholarship Scheme 2026', category: 'Government', description: 'Annual financial support up to ₹6 lakh for national camp athletes.', eligibility: 'Indian citizens aged 12–21 in Khelo India disciplines.', deadline: new Date(Date.now() + 90 * 86400000).toISOString(), link_url: 'https://sportsgauge.in/scholarships' },
  { id: 2, title: 'SAI National Sports Talent Contest', category: 'Talent Program', description: 'Pathway for athletes aged 8–14 to SAI training centres.', eligibility: 'Age 8–14 with SportsGauge validated assessment.', deadline: new Date(Date.now() + 120 * 86400000).toISOString(), link_url: 'https://sportsgauge.in/scholarships' },
];
