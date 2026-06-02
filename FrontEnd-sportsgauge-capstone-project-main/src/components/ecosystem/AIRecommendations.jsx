import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../utils/ecosystemApi';
import { FadeInSection } from '../Motion';

export default function AIRecommendations({ userId }) {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = (refresh = false) => {
    if (!userId) return;
    setLoading(true);
    fetchRecommendations(userId, refresh)
      .then(data => setRec(data))
      .catch(() => setRec(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(false); }, [userId]);

  if (loading) return <div className="skeleton h-48 rounded-2xl" />;
  if (!rec?.best_sports) return null;

  const sports = rec.best_sports.split(',').map(s => s.trim());

  return (
    <FadeInSection>
      <div className="glass-card p-6 glow-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">AI Sport Recommendations</h2>
          <button type="button" onClick={() => load(true)} className="text-xs text-ki-saffron hover:underline">
            Refresh
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {sports.map(s => (
            <div key={s} className="p-3 rounded-xl bg-ki-saffron/10 border border-ki-saffron/20 text-center text-sm font-semibold text-ki-saffron">
              {s}
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-theme-muted mb-1">Strengths</p>
            <p className="text-theme-secondary">{rec.strengths}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-theme-muted mb-1">Improvement Areas</p>
            <p className="text-theme-secondary">{rec.improvements || rec.weaknesses}</p>
          </div>
        </div>
        <p className="text-xs text-theme-muted mt-4 pt-4 border-t border-theme">{rec.training_plan}</p>
      </div>
    </FadeInSection>
  );
}
