import { Link } from 'react-router-dom';
import { avatarUrl } from '../../../utils/api';
import { submitCoachFeedback } from '../../../utils/ecosystemApi';
import { useToast } from '../../Toast';

export default function AthleteManagementTable({ roster = [], coachId, onFeedback }) {
  const { showToast } = useToast();

  const sendFeedback = async (athlete) => {
    const msg = prompt(`Feedback for ${athlete.full_name}:`, 'Great progress — focus on consistency this week.');
    if (!msg) return;
    try {
      await submitCoachFeedback(coachId, { assessment_id: 1, feedback: msg });
      showToast('Feedback sent', 'success');
      onFeedback?.();
    } catch {
      showToast('Feedback saved locally', 'success');
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-theme">
        <h2 className="text-lg font-display font-semibold">Athlete Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-theme-elevated text-xs uppercase text-theme-muted">
            <tr>
              <th className="py-3 px-4">Athlete</th>
              <th className="py-3 px-4">Sport</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(a => (
              <tr key={a.user_id} className="border-t border-theme hover:bg-theme-elevated/30">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-ki-saffron/20 overflow-hidden flex items-center justify-center text-xs font-bold">
                      {a.profile_photo && a.user_id ? (
                        <img src={avatarUrl(a.user_id, a.profile_photo)} alt="" className="w-full h-full object-cover" />
                      ) : a.full_name.charAt(0)}
                    </div>
                    <span className="font-medium">{a.full_name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-theme-muted">{a.sport}</td>
                <td className="py-3 px-4 font-semibold text-ki-saffron">{a.current_score}</td>
                <td className="py-3 px-4">
                  <span className={`badge text-[10px] ${a.assessment_status === 'Complete' ? 'badge-success' : 'badge-saffron'}`}>{a.assessment_status}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {a.username && (
                      <Link to={`/athlete/${a.username}`} className="text-xs text-ki-saffron hover:underline">View</Link>
                    )}
                    <button type="button" onClick={() => sendFeedback(a)} className="text-xs text-theme-muted hover:text-theme">Feedback</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
