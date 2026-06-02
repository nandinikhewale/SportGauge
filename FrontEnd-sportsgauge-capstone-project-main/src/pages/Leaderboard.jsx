import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import { HiBadgeCheck } from 'react-icons/hi';
import { fetchLeaderboard } from '../utils/ecosystemApi';
import { avatarUrl } from '../utils/api';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [scope, setScope] = useState('national');
  const [sport, setSport] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    fetchLeaderboard({ scope, sport, state }).then(setRows).catch(() => setRows([]));
  }, [scope, sport, state]);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="sprint" label="Rankings" title={<>National <span className="gradient-text">Leaderboard</span></>}
        subtitle="Athlete rankings by assessment performance across India." />

      <section className="py-12 max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {['national', 'state', 'district'].map(s => (
            <button key={s} type="button" onClick={() => setScope(s)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${scope === s ? 'bg-ki-saffron text-white' : 'glass-card'}`}>{s}</button>
          ))}
          <input placeholder="Sport filter" className="input-field w-40 py-2" value={sport} onChange={e => setSport(e.target.value)} />
          {(scope === 'state' || scope === 'district') && (
            <input placeholder="State" className="input-field w-40 py-2" value={state} onChange={e => setState(e.target.value)} />
          )}
        </div>

        <div className="glass-card-strong overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-theme-elevated text-xs uppercase text-theme-muted">
              <tr>
                <th className="py-4 px-4">Rank</th>
                <th className="py-4 px-4">Athlete</th>
                <th className="py-4 px-4">Sport</th>
                <th className="py-4 px-4">Score</th>
                <th className="py-4 px-4">AI %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.user_id} className="border-t border-theme hover:bg-theme-elevated/50">
                  <td className="py-4 px-4 font-display font-bold text-ki-saffron">#{r.rank}</td>
                  <td className="py-4 px-4">
                    <Link to={`/athlete/${r.username}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ki-saffron/20 overflow-hidden flex items-center justify-center text-xs font-bold">
                        {r.photo_url && avatarUrl(r.user_id, r.photo_url) ? (
                          <img src={avatarUrl(r.user_id, r.photo_url)} alt="" className="w-full h-full object-cover" />
                        ) : r.full_name.charAt(0)}
                      </div>
                      <span className="font-medium">{r.full_name}{r.is_verified && <HiBadgeCheck className="inline text-emerald-500 ml-1" />}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-sm text-theme-muted">{r.sport}</td>
                  <td className="py-4 px-4 font-bold">{r.score}</td>
                  <td className="py-4 px-4 text-sm">{r.ai_confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-8 text-center text-theme-muted">Complete assessments to appear on the leaderboard.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
}
