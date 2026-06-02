import { API_BASE } from './api.js';
import {
  FALLBACK_COACHES, FALLBACK_NEWS, FALLBACK_LEADERBOARD, FALLBACK_TALENT,
  FALLBACK_EVENTS, FALLBACK_ACADEMIES, FALLBACK_STATS, FALLBACK_SCHOLARSHIPS,
} from '../constants/content/fallbackData.js';
import { getCoachProfileFallback } from '../constants/content/coachProfiles.js';

const eco = `${API_BASE}/api`;

async function safeGet(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    if (Array.isArray(data) && data.length === 0 && fallback) return fallback;
    if (data && typeof data === 'object' && !Array.isArray(data)) return data;
    if (Array.isArray(data)) return data;
    return fallback;
  } catch {
    return fallback;
  }
}

export async function fetchPlatformStats() {
  return safeGet(`${eco}/ecosystem/stats`, FALLBACK_STATS);
}

export async function fetchCoaches(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/coaches?${q}`, FALLBACK_COACHES);
  return Array.isArray(data) ? data : FALLBACK_COACHES;
}

export async function fetchCoach(slug) {
  try {
    const res = await fetch(`${eco}/coaches/${slug}`);
    if (!res.ok) throw new Error('Coach not found');
    return res.json();
  } catch {
    return FALLBACK_COACHES.find(c => c.slug === slug) || FALLBACK_COACHES[0];
  }
}

export async function registerCoach(data) {
  const res = await fetch(`${eco}/coaches/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = new Error('Server unavailable');
    err.offline = true;
    throw err;
  }
  return res.json();
}

export async function fetchNews(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/news?${q}`, FALLBACK_NEWS);
  return Array.isArray(data) ? data : FALLBACK_NEWS;
}

export async function fetchNewsArticle(slug) {
  try {
    const res = await fetch(`${eco}/news/${slug}`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    const article = FALLBACK_NEWS.find(n => n.slug === slug) || FALLBACK_NEWS[0];
    return {
      ...article,
      content: article.summary + ' SportsGauge continues to cover developments as state federations release official schedules and qualification criteria.',
      author: 'SportsGauge Editorial',
      published_at: new Date().toISOString(),
    };
  }
}

export async function fetchLeaderboard(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/leaderboard?${q}`, FALLBACK_LEADERBOARD);
  return Array.isArray(data) ? data : FALLBACK_LEADERBOARD;
}

export async function fetchTalent(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/talent?${q}`, FALLBACK_TALENT);
  return Array.isArray(data) ? data : FALLBACK_TALENT;
}

export async function fetchEvents() {
  const data = await safeGet(`${eco}/events`, FALLBACK_EVENTS);
  return Array.isArray(data) ? data : FALLBACK_EVENTS;
}

export async function fetchAcademies(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/academies?${q}`, FALLBACK_ACADEMIES);
  return Array.isArray(data) ? data : FALLBACK_ACADEMIES;
}

export async function fetchScholarships(params = {}) {
  const q = new URLSearchParams(params).toString();
  const data = await safeGet(`${eco}/scholarships?${q}`, FALLBACK_SCHOLARSHIPS);
  return Array.isArray(data) ? data : FALLBACK_SCHOLARSHIPS;
}

export async function fetchPublicAthlete(username) {
  const res = await fetch(`${eco}/athlete/public/${username}`);
  if (!res.ok) throw new Error('Athlete not found');
  return res.json();
}

export async function fetchRecommendations(userId, refresh = false) {
  const res = await fetch(`${eco}/recommendations/${userId}`, {
    method: refresh ? 'POST' : 'GET',
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function fetchHomeFeatured() {
  return safeGet(`${eco}/home/featured`, {
    athlete_of_week: { full_name: 'Aditya Rao', username: 'aditya-rao-demo2', sport: 'Athletics', state: 'Maharashtra', best_score: 92.4, bio: 'National camp invitee after SportsGauge assessments identified elite sprint-endurance profile.' },
    trending_news: FALLBACK_NEWS,
    upcoming_events: FALLBACK_EVENTS,
  });
}

export async function fetchCoachFull(slug) {
  try {
    const res = await fetch(`${eco}/coaches/${slug}/full`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return getCoachProfileFallback(slug);
  }
}

export async function coachLogin(credentials) {
  const res = await fetch(`${eco}/coaches/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');
  return data;
}

export async function fetchCoachDashboard(coachId) {
  const data = await safeGet(`${eco}/coaches/${coachId}/dashboard`, null);
  if (data) return data;
  const fb = getCoachProfileFallback('rajesh-mehta');
  return {
    coach: { ...fb, coach_ranking: 12, profile_completion: 95 },
    quick_stats: { total_athletes: 6, active_athletes: 5, assessments_reviewed: 312, monthly_progress: 22.4, success_rate: 89.5 },
    roster: [
      { user_id: 1, username: 'aditya-rao-demo2', full_name: 'Aditya Rao', sport: 'Athletics', current_score: 92.4, assessment_status: 'Complete', ai_confidence: 94 },
      { user_id: 2, username: 'rahul-verma-demo1', full_name: 'Rahul Verma', sport: 'Wrestling', current_score: 88.1, assessment_status: 'In Progress', ai_confidence: 91 },
    ],
    recent_assessments: [
      { id: 1, athlete_name: 'Aditya Rao', username: 'aditya-rao-demo2', test_name: 'sprint', score: 10.8, ai_confidence: 95, review_status: 'reviewed', date: new Date().toISOString() },
    ],
    progress_charts: {
      sprint: [{ month: '2026-01', score: 11.2 }, { month: '2026-02', score: 10.9 }, { month: '2026-03', score: 10.8 }],
      situp: [{ month: '2026-01', score: 42 }, { month: '2026-02', score: 45 }, { month: '2026-03', score: 48 }],
      jump: [{ month: '2026-01', score: 58 }, { month: '2026-02', score: 62 }, { month: '2026-03', score: 65 }],
      shuttle: [{ month: '2026-01', score: 14.5 }, { month: '2026-02', score: 13.8 }, { month: '2026-03', score: 13.2 }],
    },
    top_performers: [{ full_name: 'Aditya Rao', username: 'aditya-rao-demo2', current_score: 92.4 }],
    needs_improvement: [{ full_name: 'Rising Athlete', focus: 'Core endurance', current_score: 62 }],
    training_recommendations: ['Schedule sprint retests for top performers.', 'Assign core block for athletes below 70.'],
    upcoming_sessions: [{ title: 'Performance Review', athlete_name: 'Aditya Rao', session_type: 'Consultation', start_at: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'scheduled' }],
    analytics: {
      athlete_growth: [{ month: '2026-01', count: 4 }, { month: '2026-02', count: 5 }, { month: '2026-03', count: 6 }],
      assessment_success_rate: [{ month: '2026-01', rate: 82 }, { month: '2026-02', rate: 86 }, { month: '2026-03', rate: 89 }],
      monthly_engagement: [{ month: '2026-01', sessions: 12 }, { month: '2026-02', sessions: 15 }, { month: '2026-03', sessions: 18 }],
      training_impact: [{ month: '2026-01', improvement: 14 }, { month: '2026-02', improvement: 18 }, { month: '2026-03', improvement: 22 }],
    },
  };
}

export async function submitCoachContact(payload) {
  const res = await fetch(`${eco}/coaches/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function submitCoachFeedback(coachId, payload) {
  const res = await fetch(`${eco}/coaches/${coachId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
