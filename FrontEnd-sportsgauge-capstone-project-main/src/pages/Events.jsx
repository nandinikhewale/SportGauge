import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import LazyImage from '../components/LazyImage';
import { fetchEvents } from '../utils/ecosystemApi';

function Countdown({ dateStr }) {
  const target = new Date(dateStr).getTime();
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex gap-2 text-center text-xs font-mono">
      <span className="glass-card px-2 py-1">{left.d}d</span>
      <span className="glass-card px-2 py-1">{left.h}h</span>
      <span className="glass-card px-2 py-1">{left.m}m</span>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="football" label="Events" title={<>Tournaments & <span className="gradient-text">Trials</span></>}
        subtitle="Khelo India events, district trials, state championships, and sports camps." />

      <section className="py-12 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {events.map(ev => (
          <article key={ev.id} className="glass-card-strong overflow-hidden card-hover">
            <div className="relative h-48">
              <LazyImage src={ev.image_url} alt={ev.title} seed={`ev-${ev.slug}`} wrapperClassName="absolute inset-0 w-full h-full" />
              <span className="absolute top-3 left-3 badge badge-saffron">{ev.event_type}</span>
              <span className={`absolute top-3 right-3 badge text-[10px] ${ev.registration_open !== false ? 'badge-success' : 'bg-gray-600'}`}>
                {ev.registration_open !== false ? 'Registration Open' : 'Closed'}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-bold">{ev.title}</h3>
              <p className="text-sm text-theme-muted mt-1">{ev.venue || ev.state} · {new Date(ev.start_date).toLocaleDateString()}</p>
              <p className="text-sm text-theme-secondary mt-3 line-clamp-2">{ev.description}</p>
              <div className="flex items-center justify-between mt-4">
                <Countdown dateStr={ev.start_date} />
                <button type="button" className="btn-primary w-auto px-6 py-2 text-xs">Register</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </div>
  );
}
