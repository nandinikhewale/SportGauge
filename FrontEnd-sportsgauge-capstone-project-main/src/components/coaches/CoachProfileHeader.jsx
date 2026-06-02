import { HiBadgeCheck, HiStar, HiLocationMarker, HiOfficeBuilding } from 'react-icons/hi';
import LazyImage from '../LazyImage';

export default function CoachProfileHeader({ coach }) {
  return (
    <div className="glass-card-strong overflow-hidden glow-border">
      <div className="relative h-48 md:h-64">
        <LazyImage
          src={coach.banner_url || coach.photo_url}
          alt=""
          seed={`banner-${coach.slug}`}
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-theme-base/50 to-transparent" />
      </div>
      <div className="px-6 md:px-8 pb-8 -mt-16 relative flex flex-col md:flex-row gap-6 items-start">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-4 ring-theme-base shrink-0 shadow-xl">
          <LazyImage src={coach.photo_url} alt={coach.full_name} seed={coach.slug} wrapperClassName="w-full h-full" />
        </div>
        <div className="flex-1 pt-2 md:pt-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {coach.is_verified && (
              <span className="badge badge-success inline-flex items-center gap-1"><HiBadgeCheck /> Verified Coach</span>
            )}
            {coach.badges?.slice(0, 2).map(b => (
              <span key={b} className="badge badge-saffron text-[10px]">{b}</span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">{coach.full_name}</h1>
          <p className="text-ki-saffron font-medium mt-1">{coach.specialization} · {coach.experience_years} years experience</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-theme-muted">
            <span className="flex items-center gap-1"><HiLocationMarker /> {coach.district}, {coach.state}</span>
            {coach.academy_organization && (
              <span className="flex items-center gap-1"><HiOfficeBuilding /> {coach.academy_organization}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <span className="flex items-center gap-1 text-amber-500 font-semibold"><HiStar /> {coach.rating} Rating</span>
            <span className="text-theme-secondary"><strong className="text-theme">{coach.athletes_managed || coach.stats?.athletes_trained}</strong> Athletes Coached</span>
          </div>
        </div>
      </div>
    </div>
  );
}
