const IMG = (seed) => `https://picsum.photos/seed/sg-fb-${seed}/800/500`;

export function getCoachProfileFallback(slug) {
  const base = {
    slug: slug || 'rajesh-mehta',
    full_name: 'Rajesh Mehta',
    specialization: 'Athletics',
    experience_years: 12,
    state: 'Maharashtra',
    district: 'Mumbai',
    academy_organization: 'Elite Velocity Athletics Academy, Mumbai',
    rating: 4.9,
    athletes_managed: 48,
    is_verified: true,
    photo_url: IMG('coach-rajesh'),
    banner_url: IMG('banner-rajesh'),
    bio: 'Former Maharashtra state sprint coach with 12 years developing youth track athletes. Specializes in start technique, acceleration phases, and SAI camp preparation for U-17 and U-19 athletes.',
    coaching_philosophy: 'Every athlete deserves data-driven coaching. I combine biomechanical assessment with periodized sprint training to unlock speed that subjective scouting misses.',
    training_approach: 'Block periodization with weekly AI retests. Acceleration drills in phase one, max velocity in phase two, competition taper in phase three.',
    areas_of_expertise: ['Sprint biomechanics', 'Start technique', 'Youth talent ID', 'SAI camp preparation'],
    specializations: ['Athletics', 'Sprint Training', 'Strength & Conditioning', 'Youth Development'],
    specialization_cards: [
      { name: 'Athletics', active: true },
      { name: 'Sprint Training', active: true },
      { name: 'Strength & Conditioning', active: true },
      { name: 'Endurance Training', active: false },
      { name: 'Youth Development', active: true },
    ],
    stats: { athletes_trained: 48, assessments_reviewed: 312, success_rate: 89.5, improvement_pct: 22.4, national_athletes: 7 },
    badges: ['Verified Coach', 'Elite Coach', 'Top Performer', 'Talent Scout'],
    certifications: [
      { title: 'SAI Level 2 Athletics Coach', issuer: 'Sports Authority of India', cert_type: 'SAI', year: 2018 },
      { title: 'IAAF Youth Coaching Certificate', issuer: 'World Athletics', cert_type: 'International', year: 2020 },
      { title: 'Strength & Conditioning Level 1', issuer: 'NSCA India', cert_type: 'National', year: 2019 },
      { title: 'Biomechanics for Sprint Coaches', issuer: 'Loughborough University', cert_type: 'International', year: 2021 },
    ],
    success_stories: [
      { athlete_name: 'Aditya Rao', username: 'aditya-rao-demo2', sport: 'Athletics', achievement: 'National Camp', improvement_pct: 24.5, photo_seed: 'aditya' },
      { athlete_name: 'Rohit Kumar', username: null, sport: 'Sprint', achievement: 'District Gold', improvement_pct: 18.0, photo_seed: 'rohit' },
      { athlete_name: 'Priya Sharma', username: null, sport: 'High Jump', achievement: 'SAI Selected', improvement_pct: 22.3, photo_seed: 'priya' },
    ],
    reviews: [
      { athlete_name: 'Aditya Rao', sport: 'Athletics', rating: 5, review_text: 'Coach Mehta transformed my start technique. My 100m dropped from 12.1s to 10.9s in one season.' },
      { athlete_name: 'Priya Nair', sport: 'Athletics', rating: 5, review_text: 'The assessment reports made every training session purposeful. Best coach I have worked with.' },
      { athlete_name: 'Rohit Kumar', sport: 'Sprint', rating: 4.5, review_text: 'Structured, professional, and always available for feedback on my SportsGauge scores.' },
    ],
  };
  return { ...base, slug, id: 1 };
}

export function mergeCoachProfile(api, slug) {
  const fb = getCoachProfileFallback(slug);
  if (!api || api.error) return fb;
  return {
    ...fb,
    ...api,
    stats: api.stats || fb.stats,
    certifications: api.certifications?.length ? api.certifications : fb.certifications,
    reviews: api.reviews?.length ? api.reviews : fb.reviews,
    success_stories: api.success_stories?.length ? api.success_stories : fb.success_stories,
    areas_of_expertise: api.areas_of_expertise?.length ? api.areas_of_expertise : fb.areas_of_expertise,
    badges: api.badges?.length ? api.badges : fb.badges,
  };
}
