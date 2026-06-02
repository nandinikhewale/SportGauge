import { Link } from 'react-router-dom';
import { HiBadgeCheck, HiStar } from 'react-icons/hi';
import LazyImage from '../LazyImage';

export default function CoachCard({ coach }) {
  return (
    <Link to={`/coaches/${coach.slug}`} className="glass-card glow-border card-hover overflow-hidden block group">
      <div className="relative h-48">
        <LazyImage
          src={coach.photo_url}
          alt={coach.full_name}
          seed={`coach-${coach.slug}`}
          wrapperClassName="absolute inset-0 w-full h-full"
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-transparent to-transparent" />
        {coach.is_verified && (
          <span className="absolute top-3 right-3 badge badge-success flex items-center gap-1">
            <HiBadgeCheck /> Verified
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-theme">{coach.full_name}</h3>
        <p className="text-sm text-ki-saffron font-medium">{coach.specialization}</p>
        <p className="text-xs text-theme-muted mt-1">{coach.district}, {coach.state}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-theme">
          <span className="text-xs text-theme-muted">{coach.experience_years} yrs exp</span>
          <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
            <HiStar /> {coach.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
