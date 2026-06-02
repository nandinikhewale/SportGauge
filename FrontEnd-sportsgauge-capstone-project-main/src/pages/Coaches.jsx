import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import CoachCard from '../components/ecosystem/CoachCard';
import { FadeInSection } from '../components/Motion';
import { fetchCoaches } from '../utils/ecosystemApi';
import { COACHES_INTRO, COACH_SUCCESS_SNIPPETS } from '../constants/content/coachesPage';

const SPORTS = ['', 'Athletics', 'Football', 'Basketball', 'Volleyball', 'Kabaddi'];
const STATES = ['', 'Maharashtra', 'Karnataka', 'Haryana', 'Delhi', 'Kerala'];

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [sport, setSport] = useState('');
  const [state, setState] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCoaches({ sport, state, search })
      .then(setCoaches)
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }, [sport, state, search]);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero
        video="programs"
        label="Coaches Portal"
        title={<>Find Verified <span className="gradient-text">Sports Coaches</span></>}
        subtitle="Search by sport, state, and experience. Connect with certified professionals managing athlete development."
      >
        <div className="flex flex-wrap gap-3 mt-6">
        <Link to="/coaches/register" className="btn-primary w-auto inline-flex px-8 py-3 text-sm">
          Register as Coach
        </Link>
        <Link to="/coaches/login" className="btn-secondary w-auto inline-flex px-8 py-3 text-sm">
          Coach Login
        </Link>
        </div>
      </EcoHero>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <FadeInSection>
          <div className="glass-card p-8 mb-4">
            <h2 className="text-xl font-display font-bold mb-4">For Coaches & Performance Staff</h2>
            <p className="text-theme-secondary leading-relaxed mb-6">{COACHES_INTRO.intro}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-ki-saffron mb-2">Benefits</h3>
                <ul className="text-sm text-theme-secondary space-y-2 list-disc list-inside">
                  {COACHES_INTRO.benefits.map(b => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ki-saffron mb-2">Coach Analytics</h3>
                <p className="text-sm text-theme-secondary leading-relaxed">{COACHES_INTRO.analytics}</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-4">
          {COACH_SUCCESS_SNIPPETS.map(s => (
            <div key={s.name} className="glass-card p-5">
              <p className="text-sm text-theme-secondary italic mb-3">&ldquo;{s.quote}&rdquo;</p>
              <p className="text-xs font-semibold text-theme">{s.name}</p>
              <p className="text-xs text-ki-saffron">{s.sport}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display font-bold mb-2">Coaching Methodology & Certification</h3>
          <p className="text-sm text-theme-secondary mb-4">{COACHES_INTRO.methodology}</p>
          <p className="text-sm text-theme-secondary">{COACHES_INTRO.certification}</p>
        </div>

        <h2 className="text-2xl font-display font-bold">Verified Coach Directory</h2>
        <div className="glass-card p-4 flex flex-col lg:flex-row gap-3">
          <input
            type="search"
            placeholder="Search coaches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <select value={sport} onChange={e => setSport(e.target.value)} className="input-field lg:w-48">
            {SPORTS.map(s => <option key={s} value={s}>{s || 'All Sports'}</option>)}
          </select>
          <select value={state} onChange={e => setState(e.target.value)} className="input-field lg:w-48">
            {STATES.map(s => <option key={s} value={s}>{s || 'All States'}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-80 rounded-2xl" />)}
          </div>
        ) : (
          <FadeInSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map(c => <CoachCard key={c.id} coach={c} />)}
            </div>
          </FadeInSection>
        )}
      </section>
      <Footer />
    </div>
  );
}
