import { HiBadgeCheck } from 'react-icons/hi';
import LazyImage from '../../LazyImage';

export default function CoachDashboardHeader({ coach, stats }) {
  const c = coach || {};
  return (
    <div className="glass-card-strong p-6 md:p-8 glow-border overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
          <LazyImage src={c.photo_url} alt="" seed={c.slug || 'coach'} wrapperClassName="w-full h-full" />
        </div>
        <div className="flex-1">
          <span className="section-label mb-2 block w-fit">Coach Dashboard</span>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Welcome, <span className="gradient-text">{c.full_name?.split(' ')[0] || 'Coach'}</span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="text-ki-saffron font-semibold">Rank #{c.coach_ranking || '—'}</span>
            {c.is_verified && <span className="flex items-center gap-1 text-emerald-500"><HiBadgeCheck /> Verified</span>}
            <span className="text-theme-muted">Profile {c.profile_completion || 90}% complete</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(c.badges || []).map(b => <span key={b} className="badge badge-saffron text-[10px]">{b}</span>)}
        </div>
      </div>
    </div>
  );
}
