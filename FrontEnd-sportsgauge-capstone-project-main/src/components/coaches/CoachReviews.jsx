import { HiStar } from 'react-icons/hi';

export default function CoachReviews({ reviews = [] }) {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-display font-bold mb-6">Reviews & Testimonials</h2>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-5 rounded-xl bg-theme-elevated border border-theme">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <HiStar key={s} className={`w-4 h-4 ${s <= Math.round(r.rating) ? 'text-amber-500' : 'text-theme-muted'}`} />
              ))}
              <span className="text-xs text-theme-muted ml-2">{r.rating}/5</span>
            </div>
            <p className="text-sm text-theme-secondary italic leading-relaxed">&ldquo;{r.review_text}&rdquo;</p>
            <p className="text-xs font-semibold mt-3 text-theme">{r.athlete_name} · {r.sport}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
