import { avatarUrl } from '../utils/api.js';

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-14 h-14 text-xl',
    lg: 'w-28 h-28 text-4xl',
  };
  const sizeClass = sizes[size] || sizes.md;
  const src = avatarUrl(user?.id, user?.profile_photo);
  const initial = (user?.full_name || 'U').charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={user?.full_name || 'Profile'}
        className={`${sizeClass} rounded-full object-cover border-2 border-ki-dark shadow-lg ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-ki-saffron to-ki-accent flex items-center justify-center font-bold font-display text-white shadow-lg shadow-ki-saffron/20 ${className}`}
    >
      {initial}
    </div>
  );
}

export function profileCompletionPercent(user) {
  if (!user) return 0;
  const fields = [
    user.full_name,
    user.age,
    user.gender,
    user.state,
    user.district,
    user.sports_interest,
    user.height,
    user.weight,
    user.bio,
    user.profile_photo,
  ];
  const filled = fields.filter(v => v !== undefined && v !== null && String(v).trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}
