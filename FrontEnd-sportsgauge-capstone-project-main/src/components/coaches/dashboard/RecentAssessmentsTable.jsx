export default function RecentAssessmentsTable({ assessments = [] }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-theme">
        <h2 className="text-lg font-display font-semibold">Recent Assessments</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-theme-elevated text-xs uppercase text-theme-muted">
            <tr>
              <th className="py-3 px-4 text-left">Athlete</th>
              <th className="py-3 px-4 text-left">Test</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">AI %</th>
              <th className="py-3 px-4">Review</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id} className="border-t border-theme">
                <td className="py-3 px-4 font-medium">{a.athlete_name}</td>
                <td className="py-3 px-4 capitalize text-theme-muted">{a.test_name}</td>
                <td className="py-3 px-4 font-bold text-ki-saffron">{a.score}</td>
                <td className="py-3 px-4">{a.ai_confidence}%</td>
                <td className="py-3 px-4">
                  <span className={`badge text-[10px] ${a.review_status === 'reviewed' ? 'badge-success' : 'badge-saffron'}`}>{a.review_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
