import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fetchAssessments } from '../utils/api.js';
import UserAvatar from '../components/UserAvatar.jsx';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineFire, HiOutlineLightningBolt, HiOutlineVideoCamera, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { FadeInSection, StaggerContainer, StaggerItem } from '../components/Motion';
import LazyImage from '../components/LazyImage';
import { IMAGES } from '../constants/media';
import AIRecommendations from '../components/ecosystem/AIRecommendations';
import { DASHBOARD_INSIGHTS, TRAINING_SUGGESTIONS } from '../constants/content/dashboardTips';
import { commsApi } from '../utils/commsApi.js';

export default function TestsDashboard() {
  const navigate = useNavigate();
  const { user, token } = useApp();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comms, setComms] = useState({ unread: 0, conversations: 0 });
  
  const loadAssessments = useCallback(() => {
    if (!user?.id) return;
    fetchAssessments(user.id)
      .then(data => setAssessments(data))
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setLoading(true);
    loadAssessments();
  }, [user, navigate, loadAssessments]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      commsApi.unreadCount(token).catch(() => ({ unread: 0 })),
      commsApi.listConversations(token).catch(() => []),
    ]).then(([u, c]) => setComms({ unread: u.unread || 0, conversations: c.length }));
  }, [token]);

  const bmi = user?.height && user?.weight ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : null;
  
  const chartData = [
    { name: 'Sit Ups', score: assessments.find(a => a.test_name === 'situp')?.score || 0, color: '#10b981' },
    { name: 'Jump (cm)', score: assessments.find(a => a.test_name === 'jump')?.score || 0, color: '#3b82f6' },
    { name: 'Sprint (s)', score: assessments.find(a => a.test_name === 'sprint')?.score || 0, color: '#f59e0b' },
    { name: 'Shuttle (s)', score: assessments.find(a => a.test_name === 'shuttle')?.score || 0, color: '#8b5cf6' }
  ];

  const availableTests = [
    { id: 'situp', name: 'Sit Ups', desc: 'Core Strength & Endurance', icon: HiOutlineFire, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'jump', name: 'Vertical Jump', desc: 'Lower Body Explosive Power', icon: HiOutlineLightningBolt, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'shuttle', name: 'Shuttle Run', desc: 'Agility & Change of Direction', icon: HiOutlineChartBar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'sprint', name: 'Sprint', desc: 'Maximal Speed Assessment', icon: HiOutlineFire, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const recentAssessments = [...assessments].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ki-dark-2/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-sm font-medium text-white mb-1">{label}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-shell">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="floating-orb w-[40%] h-[40%] bg-ki-blue/10 -top-20 -left-20" />
        <div className="floating-orb w-[30%] h-[30%] bg-ki-saffron/10 bottom-0 right-0" />
      </div>

      <div className="relative z-10 pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="mb-10">
          <div className="relative rounded-2xl overflow-hidden h-44 md:h-56 glow-border">
            <LazyImage src={IMAGES.stadium} alt="Athlete dashboard" seed="dashboard" wrapperClassName="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-theme-base/95 via-theme-base/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10">
              <span className="section-label mb-2 w-fit">Performance Hub</span>
              <p className="text-sm md:text-base text-theme-muted max-w-md">Track assessments, AI confidence, and progress across every test category.</p>
            </div>
          </div>
        </FadeInSection>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label mb-3">Athlete Dashboard</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Athlete'}</span>
            </h1>
          </div>
          <Link to="/profile" className="btn-secondary w-auto px-6 py-2.5 text-sm flex items-center gap-2">
            View Full Profile
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4">
            <p className="text-xs text-theme-muted">Recent Notifications</p>
            <p className="text-2xl font-bold">{comms.unread}</p>
            <p className="text-xs text-theme-muted">Unread alerts</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-theme-muted">Messages</p>
            <p className="text-2xl font-bold">{comms.conversations}</p>
            <p className="text-xs text-theme-muted">Active conversations</p>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="skeleton h-[300px] lg:col-span-1" />
            <div className="skeleton h-[300px] lg:col-span-2" />
            <div className="skeleton h-[200px] lg:col-span-3" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ── Left Column: Quick Profile & Stats ── */}
            <div className="space-y-6">
              <FadeInSection>
                <div className="glass-card-strong p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <HiOutlineChartBar size={100} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <UserAvatar user={user} size="md" className="rounded-2xl" />
                      <div>
                        <h2 className="text-xl font-display font-bold">{user?.full_name}</h2>
                        <p className="text-sm text-ki-saffron">{user?.sports_interest} Athlete</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Tests Taken</div>
                        <div className="text-2xl font-bold">{assessments.length}</div>
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Avg Confidence</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {assessments.length > 0 ? Math.round(assessments.reduce((acc, curr) => acc + curr.ai_confidence, 0) / assessments.length) : 0}%
                        </div>
                      </div>
                      {bmi && (
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 col-span-2 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Current BMI</div>
                            <div className="text-2xl font-bold">{bmi}</div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                            bmi < 18.5 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            bmi > 25 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {bmi < 18.5 ? 'Underweight' : bmi > 25 ? 'Overweight' : 'Optimal'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeInSection>

              {/* Assessment Call to Action */}
              <FadeInSection delay={0.1}>
                <div className="glass-card p-6 bg-gradient-to-br from-ki-saffron/[0.05] to-transparent border-ki-saffron/20">
                  <h3 className="text-lg font-display font-semibold mb-2">Ready for a test?</h3>
                  <p className="text-sm text-gray-400 mb-5">Record a new assessment video to track your progress and improve your scores.</p>
                  <Link
                    to="/assessment"
                    className="btn-primary flex items-center justify-center gap-2 py-3 text-sm no-underline"
                  >
                    <HiOutlineVideoCamera size={18} />
                    Start New Assessment
                  </Link>
                </div>
              </FadeInSection>
            </div>

            {/* ── Right Column: Charts & History ── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Performance Chart */}
              <FadeInSection delay={0.2}>
                <div className="glass-card-strong p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-display font-semibold">Performance Overview</h2>
                      <p className="text-xs text-gray-500">Your best scores across all test categories</p>
                    </div>
                  </div>
                  
                  <div className="h-64 w-full">
                    {assessments.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-white/[0.02] rounded-xl border border-dashed border-white/10 px-6 py-8">
                        <div className="w-20 h-20 rounded-full bg-ki-saffron/10 flex items-center justify-center mb-4">
                          <HiOutlineChartBar size={36} className="text-ki-saffron/60" />
                        </div>
                        <p className="text-sm font-medium text-gray-300 mb-1">No assessment data yet</p>
                        <p className="text-xs text-center max-w-xs mb-4">Complete your first AI-powered test to unlock performance charts and track progress over time.</p>
                        <Link to="/assessment" className="btn-primary w-auto px-6 py-2.5 text-sm no-underline inline-flex items-center gap-2">
                          <HiOutlineVideoCamera size={16} /> Start Assessment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInSection>

              <AIRecommendations userId={user?.id} />

              <FadeInSection delay={0.25}>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-display font-semibold mb-4">Athlete Insights</h2>
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {DASHBOARD_INSIGHTS.map(t => (
                      <div key={t.title} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <h3 className="text-sm font-semibold text-ki-saffron mb-1">{t.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{t.body}</p>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold mb-2">Training Suggestions</h3>
                  <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                    {TRAINING_SUGGESTIONS.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </FadeInSection>

              {/* Available Tests Grid */}
              <FadeInSection delay={0.3}>
                <div className="glass-card p-6">
                  <h2 className="text-lg font-display font-semibold mb-5">Assessment Library</h2>
                  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableTests.map((test, i) => {
                      const completed = assessments.some(a => a.test_name === test.id);
                      return (
                        <StaggerItem key={test.id}>
                          <Link 
                            to={`/assessment?test=${test.id}`}
                            className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${test.bg} ${test.color} group-hover:scale-110 transition-transform`}>
                              <test.icon size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-sm font-semibold text-white">{test.name}</h4>
                                {completed ? (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-ki-saffron" title="Pending" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 leading-tight">{test.desc}</p>
                            </div>
                          </Link>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              </FadeInSection>

            </div>

            {/* ── Bottom Section: History Table ── */}
            <div className="lg:col-span-3">
              <FadeInSection delay={0.4}>
                <div className="glass-card overflow-hidden">
                  <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                    <h2 className="text-lg font-display font-semibold">Recent Assessments</h2>
                    <Link to="/profile" className="text-xs font-medium text-ki-saffron hover:text-white transition-colors">View All</Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500 border-b border-white/[0.05]">
                          <th className="py-4 px-6 font-medium">Date</th>
                          <th className="py-4 px-6 font-medium">Assessment Type</th>
                          <th className="py-4 px-6 font-medium">Score</th>
                          <th className="py-4 px-6 font-medium">AI Confidence</th>
                          <th className="py-4 px-6 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {recentAssessments.map(a => (
                          <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="py-4 px-6 text-sm text-gray-300 whitespace-nowrap">
                              {new Date(a.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.05] text-xs font-medium text-white capitalize">
                                {a.test_name}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-lg font-bold font-display text-ki-saffron">{a.score}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.ai_confidence}%` }} />
                                </div>
                                <span className="text-xs text-gray-400">{a.ai_confidence}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {a.validation_status === 'Valid' ? (
                                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                  <HiCheckCircle size={16} /> Validated
                                </div>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                                    <HiExclamationCircle size={16} /> Invalid / Flagged
                                  </div>
                                  {a.cheat_reason && (
                                    <span className="text-[10px] text-gray-500 leading-tight max-w-[150px] truncate" title={a.cheat_reason}>
                                      {a.cheat_reason}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {recentAssessments.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <HiOutlineVideoCamera size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">No assessments found.</p>
                                <Link to="/assessment" className="btn-primary w-auto inline-flex mt-4 px-5 py-2 text-xs no-underline items-center gap-2">
                                  <HiOutlineVideoCamera size={14} /> Start Assessment
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeInSection>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}