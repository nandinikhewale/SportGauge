import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LABELS = { sprint: 'Sprint', situp: 'Sit-Up', jump: 'Jump', shuttle: 'Shuttle' };
const COLORS = { sprint: '#f59e0b', situp: '#10b981', jump: '#3b82f6', shuttle: '#8b5cf6' };

export default function AthleteProgressCharts({ charts = {} }) {
  const merged = (charts.sprint || []).map((_, i) => ({
    month: charts.sprint?.[i]?.month || `M${i}`,
    sprint: charts.sprint?.[i]?.score,
    situp: charts.situp?.[i]?.score,
    jump: charts.jump?.[i]?.score,
    shuttle: charts.shuttle?.[i]?.score,
  }));

  return (
    <div className="glass-card p-5">
      <h2 className="text-lg font-display font-semibold mb-4">Athlete Progress Tracking</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={merged}>
          <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
          <Legend />
          {Object.keys(LABELS).map(k => (
            <Line key={k} type="monotone" dataKey={k} stroke={COLORS[k]} strokeWidth={2} dot={{ r: 3 }} name={LABELS[k]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
