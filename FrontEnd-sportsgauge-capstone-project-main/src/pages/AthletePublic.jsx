import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiBadgeCheck } from 'react-icons/hi';
import { fetchPublicAthlete } from '../utils/ecosystemApi';
import { avatarUrl } from '../utils/api';

export default function AthletePublic() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchPublicAthlete(username).then(setProfile).catch(() => setProfile(null));
  }, [username]);

  if (!profile?.full_name) {
    return (
      <div className="page-shell min-h-screen">
        <Navbar />
        <p className="text-center pt-32 text-theme-muted">Athlete not found</p>
        <Footer />
      </div>
    );
  }

  const chartData = (profile.assessments || []).map(a => ({ name: a.test_name?.slice(0, 12), score: a.score }));
  const rec = profile.recommendation;
  const sports = rec?.best_sports ? rec.best_sports.split(',').map(s => s.trim()) : [];

  return (
    <div className="page-shell">
      <Navbar />
      <section className="pt-24 pb-16 max-w-5xl mx-auto px-4">
        <div className="glass-card-strong p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-ki-saffron/20 flex-shrink-0 flex items-center justify-center text-4xl font-bold">
            {profile.profile_photo ? (
              <img src={avatarUrl(profile.id, profile.profile_photo)} alt="" className="w-full h-full object-cover" />
            ) : profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              {profile.full_name}
              {profile.is_verified && <HiBadgeCheck className="text-emerald-500" />}
            </h1>
            <p className="text-theme-muted">@{profile.username} · {profile.district}, {profile.state}</p>
            {profile.sport && <p className="text-ki-saffron font-medium mt-1">{profile.sport}</p>}
            {profile.badges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.badges.map(b => <span key={b} className="badge badge-success">{b}</span>)}
              </div>
            )}
            {profile.bio && <p className="mt-4 text-theme-secondary">{profile.bio}</p>}
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="glass-card p-6 mt-8">
            <h2 className="font-display font-bold mb-4">Assessment Scores</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
                <Bar dataKey="score" fill="#FF9933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {rec && (
          <div className="glass-card p-6 mt-8 space-y-6">
            <h2 className="font-display font-bold">AI Sports Recommendations</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {sports.map(s => (
                <div key={s} className="p-4 rounded-xl bg-theme-elevated border border-theme text-center">
                  <span className="text-ki-saffron font-semibold">{s}</span>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <h3 className="font-semibold text-emerald-400 mb-2">Strengths</h3>
                <p className="text-theme-secondary">{rec.strengths}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <h3 className="font-semibold text-amber-400 mb-2">Areas to Improve</h3>
                <p className="text-theme-secondary">{rec.weaknesses}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-theme-elevated border border-theme">
              <h3 className="font-semibold mb-2">Suggested Training Plan</h3>
              <p className="text-sm text-theme-secondary">{rec.training_plan}</p>
            </div>
          </div>
        )}

        <Link to="/leaderboard" className="btn-secondary w-auto inline-flex mt-8 px-6 py-2 text-sm">View Leaderboard</Link>
      </section>
      <Footer />
    </div>
  );
}
