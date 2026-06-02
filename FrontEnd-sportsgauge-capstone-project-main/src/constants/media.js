/** Image & video URLs — Unsplash IDs verified via GET requests */

const img = (photoId, w = 800, h = 600) =>
  `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80`;

export const imageFallback = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/sportsgauge-${seed}/${w}/${h}`;

/* Verified working photo IDs */
const P = {
  track: 'photo-1461896836934-ffe607ba8211',
  athletics: 'photo-1532444458054-01a7dd3e9fca',
  crowd: 'photo-1517649763962-0c623066013b',
  gym: 'photo-1517836357463-d25dfeac3438',
  football: 'photo-1431324155629-1a6deb1dec8d',
  field: 'photo-1574629810360-7efbbe195018',
  workout: 'photo-1518611012118-696072aa579a',
};

export const IMAGES = {
  sprint: img(P.track),
  running: img(P.track),
  verticalJump: img(P.crowd),
  fitness: img(P.gym),
  assessment: img(P.workout),
  analytics: img(P.track),
  coach: img(P.football),
  athlete: img(P.gym),
  stadium: img(P.field),
  training: img(P.gym),
  team: img(P.football),
  track: img(P.athletics),
  mission: img(P.track, 1200, 800),
  vision: img(P.field, 1200, 800),
  rural: img(P.field),
  youth: img(P.workout),
  performance: img(P.gym),
};

export const VIDEOS = {
  hero: {
    src: 'https://cdn.coverr.co/videos/coverr-a-man-running-on-a-track-2559/1080p.mp4',
    poster: IMAGES.running,
  },
  about: {
    src: 'https://cdn.coverr.co/videos/coverr-athletes-training-in-a-gym-2560/1080p.mp4',
    poster: IMAGES.training,
  },
  programs: {
    src: 'https://cdn.coverr.co/videos/coverr-young-people-playing-soccer-2561/1080p.mp4',
    poster: IMAGES.team,
  },
  stories: {
    src: 'https://cdn.coverr.co/videos/coverr-a-man-lifting-a-barbell-2554/1080p.mp4',
    poster: IMAGES.fitness,
  },
  sprint: {
    src: 'https://cdn.coverr.co/videos/coverr-man-sprinting-on-a-track-2562/1080p.mp4',
    poster: IMAGES.sprint,
  },
  football: {
    src: 'https://cdn.coverr.co/videos/coverr-young-people-playing-soccer-2561/1080p.mp4',
    poster: IMAGES.team,
  },
  training: {
    src: 'https://cdn.coverr.co/videos/coverr-athletes-training-in-a-gym-2560/1080p.mp4',
    poster: IMAGES.training,
  },
};

export const GALLERY = [
  { src: IMAGES.sprint, alt: 'Sprint on track', tag: 'Sprint', seed: 'gallery-sprint' },
  { src: IMAGES.verticalJump, alt: 'Athlete training', tag: 'Jump', seed: 'gallery-jump' },
  { src: IMAGES.fitness, alt: 'Gym session', tag: 'Assessment', seed: 'gallery-gym' },
  { src: IMAGES.coach, alt: 'Team sport', tag: 'Coaching', seed: 'gallery-coach' },
  { src: IMAGES.stadium, alt: 'Sports field', tag: 'Stadium', seed: 'gallery-field' },
  { src: IMAGES.training, alt: 'Strength training', tag: 'Training', seed: 'gallery-train' },
];

export const ATHLETE_SHOWCASE = [
  { name: 'Sprint Specialist', sport: '100m · Athletics', img: IMAGES.sprint, metric: '10.8s', seed: 'athlete-sprint' },
  { name: 'Power Athlete', sport: 'Vertical Jump', img: IMAGES.verticalJump, metric: '68 cm', seed: 'athlete-jump' },
  { name: 'Endurance Pro', sport: 'Shuttle Run', img: IMAGES.fitness, metric: 'Elite', seed: 'athlete-endurance' },
  { name: 'Rising Star', sport: 'Multi-sport', img: IMAGES.athlete, metric: 'Top 5%', seed: 'athlete-star' },
];

export const PROGRAM_IMAGES = {
  'talent-discovery': IMAGES.youth,
  'youth-development': IMAGES.training,
  'rural-outreach': IMAGES.rural,
  'high-performance': IMAGES.sprint,
};

export const STORY_PHOTOS = {
  'Rohit Kumar': IMAGES.sprint,
  'Priya Sharma': IMAGES.track,
  'Arjun Patel': IMAGES.fitness,
  'Anjali Devi': IMAGES.training,
  'Vikram Singh': IMAGES.coach,
  'Meera Kumari': IMAGES.youth,
};
