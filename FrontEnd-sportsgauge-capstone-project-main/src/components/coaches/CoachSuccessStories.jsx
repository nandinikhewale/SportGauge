import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';

export default function CoachSuccessStories({ stories = [] }) {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-display font-bold mb-6">Success Stories</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((s, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-theme card-hover bg-theme-elevated/30">
            <div className="h-32 relative">
              <LazyImage seed={s.photo_seed || `story-${i}`} alt={s.athlete_name} wrapperClassName="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-base to-transparent" />
              <span className="absolute bottom-2 left-3 badge badge-saffron text-[10px]">+{s.improvement_pct}%</span>
            </div>
            <div className="p-4">
              {s.username ? (
                <Link to={`/athlete/${s.username}`} className="font-semibold hover:text-ki-saffron">{s.athlete_name}</Link>
              ) : (
                <p className="font-semibold">{s.athlete_name}</p>
              )}
              <p className="text-xs text-ki-saffron mt-0.5">{s.sport}</p>
              <p className="text-sm text-theme-muted mt-2">{s.achievement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
