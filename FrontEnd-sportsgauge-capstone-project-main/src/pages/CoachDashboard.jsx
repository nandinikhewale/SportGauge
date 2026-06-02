import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCoach } from '../context/CoachContext';
import { fetchCoachDashboard } from '../utils/ecosystemApi';
import { FadeInSection } from '../components/Motion';
import CoachDashboardHeader from '../components/coaches/dashboard/CoachDashboardHeader';
import CoachQuickStats from '../components/coaches/dashboard/CoachQuickStats';
import AthleteManagementTable from '../components/coaches/dashboard/AthleteManagementTable';
import AthleteProgressCharts from '../components/coaches/dashboard/AthleteProgressCharts';
import RecentAssessmentsTable from '../components/coaches/dashboard/RecentAssessmentsTable';
import CoachInsightsPanel from '../components/coaches/dashboard/CoachInsightsPanel';
import CoachAnalyticsCharts from '../components/coaches/dashboard/CoachAnalyticsCharts';
import { commsApi } from '../utils/commsApi.js';

export default function CoachDashboard() {
  const navigate = useNavigate();
  const { coach, logoutCoach, token } = useCoach();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comms, setComms] = useState({ unread: 0, conversations: 0 });

  useEffect(() => {
    if (!coach?.coach_id) {
      navigate('/coaches/login');
      return;
    }
    setLoading(true);
    fetchCoachDashboard(coach.coach_id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [coach, navigate]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      commsApi.unreadCount(token).catch(() => ({ unread: 0 })),
      commsApi.listConversations(token).catch(() => []),
    ]).then(([u, c]) => setComms({ unread: u.unread || 0, conversations: c.length }));
  }, [token]);

  if (!coach?.coach_id) return null;

  return (
    <div className="page-shell">
      <Navbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex justify-end gap-3">
          {coach.slug && <Link to={`/coaches/${coach.slug}`} className="text-sm text-ki-saffron hover:underline">Public Profile</Link>}
          <button type="button" onClick={() => { logoutCoach(); navigate('/coaches'); }} className="text-sm text-theme-muted hover:text-red-400">Log out</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="glass-card p-3"><p className="text-xs text-theme-muted">Pending Reviews</p><p className="text-xl font-bold">{data?.recent_assessments?.filter(a => a.review_status !== 'reviewed').length || 0}</p></div>
          <div className="glass-card p-3"><p className="text-xs text-theme-muted">Recent Notifications</p><p className="text-xl font-bold">{comms.unread}</p></div>
          <div className="glass-card p-3"><p className="text-xs text-theme-muted">Unread Messages</p><p className="text-xl font-bold">{comms.conversations}</p></div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="grid grid-cols-5 gap-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        ) : data && (
          <>
            <FadeInSection><CoachDashboardHeader coach={data.coach} /></FadeInSection>
            <FadeInSection><CoachQuickStats stats={data.quick_stats} /></FadeInSection>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FadeInSection><AthleteManagementTable roster={data.roster} coachId={coach.coach_id} /></FadeInSection>
                <FadeInSection><AthleteProgressCharts charts={data.progress_charts} /></FadeInSection>
                <FadeInSection><RecentAssessmentsTable assessments={data.recent_assessments} /></FadeInSection>
                <FadeInSection><CoachAnalyticsCharts analytics={data.analytics} /></FadeInSection>
              </div>
              <FadeInSection>
                <CoachInsightsPanel
                  topPerformers={data.top_performers}
                  needsImprovement={data.needs_improvement}
                  recommendations={data.training_recommendations}
                  sessions={data.upcoming_sessions}
                />
              </FadeInSection>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
