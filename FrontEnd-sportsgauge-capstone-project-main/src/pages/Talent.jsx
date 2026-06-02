import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import LazyImage from '../components/LazyImage';
import { HiBadgeCheck } from 'react-icons/hi';
import { fetchTalent } from '../utils/ecosystemApi';
import { avatarUrl } from '../utils/api';

export default function Talent() {
  const [athletes, setAthletes] = useState([]);
  const [tab, setTab] = useState('emerging');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTalent({ tab, search }).then(setAthletes).catch(() => setAthletes([]));
  }, [tab, search]);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="programs" label="Talent Discovery" title={<>Discover <span className="gradient-text">Emerging Athletes</span></>}
        subtitle="Top performers, verified talent, and AI-recommended athletes from SportsGauge assessments." />

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'emerging', label: 'Emerging' },
            { id: 'top', label: 'Top Performers' },
            { id: 'verified', label: 'Verified' },
            { id: 'ai', label: 'AI Recommended' },
          ].map(f => (
            <button key={f.id} type="button" onClick={() => setTab(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium ${tab === f.id ? 'bg-ki-saffron text-white' : 'glass-card'}`}>{f.label}</button>
          ))}
        </div>
        <input type="search" placeholder="Search athletes..." className="input-field mb-8 max-w-md" value={search} onChange={e => setSearch(e.target.value)} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {athletes.map(a => (
            <Link key={a.id} to={`/athlete/${a.username}`} className="glass-card card-hover p-5 block">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-ki-saffron/20 flex-shrink-0">
                  {a.photo_url ? (
                    <img src={avatarUrl(a.id, a.photo_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <LazyImage seed={`talent-${a.username}`} alt={a.full_name} wrapperClassName="w-full h-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold flex items-center gap-1">{a.full_name}{a.is_verified && <HiBadgeCheck className="text-emerald-500" />}</h3>
                  <p className="text-xs text-theme-muted">{a.district}, {a.state}</p>
                  <p className="text-sm text-ki-saffron font-semibold mt-1">Score: {a.best_score}</p>
                </div>
              </div>
              {a.badges?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {a.badges.slice(0, 3).map(b => <span key={b} className="badge badge-success text-[10px]">{b}</span>)}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
