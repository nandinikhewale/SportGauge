export default function CoachInsightsPanel({ topPerformers = [], needsImprovement = [], recommendations = [], sessions = [] }) {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3 text-emerald-500">Top Performing Athletes</h3>
        <ul className="space-y-2 text-sm">
          {topPerformers.map((a, i) => (
            <li key={i} className="flex justify-between"><span>{a.full_name || a.label}</span><span className="text-ki-saffron font-semibold">{a.current_score}</span></li>
          ))}
        </ul>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3 text-amber-500">Needs Improvement</h3>
        <ul className="space-y-2 text-sm text-theme-secondary">
          {needsImprovement.map((a, i) => (
            <li key={i}><strong>{a.full_name || a.label}</strong> — {a.focus || 'Retest recommended'}</li>
          ))}
        </ul>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3">Training Recommendations</h3>
        <ul className="space-y-2 text-xs text-theme-muted list-disc list-inside">
          {recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3">Upcoming Sessions</h3>
        <ul className="space-y-3 text-sm">
          {sessions.slice(0, 4).map((s, i) => (
            <li key={i} className="border-b border-theme pb-2 last:border-0">
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-theme-muted">{s.athlete_name} · {new Date(s.start_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
