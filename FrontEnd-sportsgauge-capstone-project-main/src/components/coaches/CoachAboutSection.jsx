export default function CoachAboutSection({ coach }) {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-display font-bold mb-6">About Coach</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-ki-saffron uppercase tracking-wider mb-2">Biography</h3>
          <p className="text-theme-secondary leading-relaxed">{coach.bio}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ki-saffron uppercase tracking-wider mb-2">Coaching Philosophy</h3>
          <p className="text-theme-secondary leading-relaxed">{coach.coaching_philosophy}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ki-saffron uppercase tracking-wider mb-2">Areas of Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {(coach.areas_of_expertise || []).map(e => (
              <span key={e} className="px-3 py-1.5 rounded-full text-xs font-medium bg-theme-elevated border border-theme">{e}</span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ki-saffron uppercase tracking-wider mb-2">Training Approach</h3>
          <p className="text-theme-secondary leading-relaxed">{coach.training_approach}</p>
        </div>
      </div>
    </div>
  );
}
