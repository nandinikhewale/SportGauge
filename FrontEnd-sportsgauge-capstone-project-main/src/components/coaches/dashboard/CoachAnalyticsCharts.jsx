import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CoachAnalyticsCharts({ analytics = {} }) {
  const charts = [
    { title: 'Athlete Growth', data: analytics.athlete_growth || [], key: 'count', color: '#FF9933' },
    { title: 'Assessment Success Rate', data: analytics.assessment_success_rate || [], key: 'rate', color: '#10b981' },
    { title: 'Monthly Engagement', data: analytics.monthly_engagement || [], key: 'sessions', color: '#3b82f6' },
    { title: 'Training Impact', data: analytics.training_impact || [], key: 'improvement', color: '#8b5cf6' },
  ];

  return (
    <div className="glass-card p-5">
      <h2 className="text-lg font-display font-semibold mb-4">Performance Analytics</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {charts.map(({ title, data, key, color }) => (
          <div key={title} className="p-3 rounded-xl bg-theme-elevated/50 border border-theme">
            <p className="text-xs font-medium mb-2 text-theme-muted">{title}</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={data}>
                <XAxis dataKey="month" tick={{ fontSize: 8, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 8, fill: 'var(--text-muted)' }} width={28} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 11 }} />
                <Bar dataKey={key} fill={color} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
