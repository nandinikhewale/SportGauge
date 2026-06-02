import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeInSection } from '../Motion';
import LiveStats from './LiveStats';
import LazyImage from '../LazyImage';
import { fetchHomeFeatured } from '../../utils/ecosystemApi';
import { HiArrowRight } from 'react-icons/hi';

export default function HomeEcosystem() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetchHomeFeatured().then(setFeatured).catch(() => setFeatured(null));
  }, []);

  const athlete = featured?.athlete_of_week;
  const news = featured?.trending_news || [];
  const events = featured?.upcoming_events || [];

  return (
    <>
      <section className="py-20 bg-theme-base relative z-20 border-t border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-10">
            <span className="section-label mb-4 mx-auto w-fit block">Live Platform</span>
            <h2 className="section-title mb-4">India&apos;s Growing <span className="gradient-text">Sports Ecosystem</span></h2>
          </FadeInSection>
          <LiveStats />
        </div>
      </section>

      {athlete && (
        <section className="py-16 bg-theme-elevated/30 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="glass-card-strong p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 glow-border">
                <div className="w-32 h-32 rounded-2xl bg-ki-saffron/20 flex items-center justify-center text-4xl font-display font-bold text-ki-saffron shrink-0">
                  {athlete.full_name?.charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="badge badge-saffron mb-3">Athlete of the Week</span>
                  <h3 className="text-2xl font-display font-bold">{athlete.full_name}</h3>
                  <p className="text-ki-saffron text-sm mt-1">{athlete.sport} · {athlete.state}</p>
                  <p className="text-theme-secondary mt-3 max-w-xl">{athlete.bio}</p>
                  <p className="text-lg font-bold text-theme mt-2">Best Score: {athlete.best_score}</p>
                </div>
                {athlete.username && (
                  <Link to={`/athlete/${athlete.username}`} className="btn-primary w-auto px-8 py-3 text-sm shrink-0">
                    View Profile <HiArrowRight className="inline ml-1" />
                  </Link>
                )}
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      <section className="py-20 bg-theme-base relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-label mb-2 block">Trending</span>
              <h2 className="text-2xl font-display font-bold">Sports News</h2>
            </div>
            <Link to="/news" className="text-sm text-ki-saffron hover:underline">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {news.slice(0, 4).map(n => (
              <Link key={n.slug} to={`/news/${n.slug}`} className="glass-card overflow-hidden card-hover block">
                <div className="h-32 relative">
                  <LazyImage src={n.image_url} alt={n.title} seed={n.slug} wrapperClassName="absolute inset-0 w-full h-full" />
                </div>
                <div className="p-3">
                  <span className="text-[10px] text-ki-saffron">{n.category}</span>
                  <p className="text-sm font-medium line-clamp-2 mt-1">{n.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-theme-elevated/20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-label mb-2 block">Upcoming</span>
              <h2 className="text-2xl font-display font-bold">Events & Trials</h2>
            </div>
            <Link to="/events" className="text-sm text-ki-saffron hover:underline">All events</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {events.map(ev => (
              <div key={ev.slug} className="glass-card min-w-[280px] snap-start overflow-hidden shrink-0">
                <div className="h-36 relative">
                  <LazyImage src={ev.image_url} alt={ev.title} seed={ev.slug} wrapperClassName="absolute inset-0 w-full h-full" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm">{ev.title}</p>
                  <p className="text-xs text-theme-muted mt-1">{ev.sport} · {new Date(ev.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[
              { to: '/coaches', label: 'Coaches' },
              { to: '/leaderboard', label: 'Leaderboard' },
              { to: '/talent', label: 'Talent Discovery' },
              { to: '/scholarships', label: 'Scholarships' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="glass-card p-4 text-center text-sm font-medium hover:border-ki-saffron/40 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
