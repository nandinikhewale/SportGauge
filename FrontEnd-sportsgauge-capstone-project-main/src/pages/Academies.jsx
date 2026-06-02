import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import { HiStar, HiLocationMarker, HiPhone } from 'react-icons/hi';
import { fetchAcademies } from '../utils/ecosystemApi';
import { ACADEMY_FACILITIES } from '../constants/content/fallbackData';

export default function Academies() {
  const [academies, setAcademies] = useState([]);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');

  useEffect(() => {
    fetchAcademies({ search, sport }).then(setAcademies).catch(() => setAcademies([]));
  }, [search, sport]);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="training" label="Academies" title={<>Sports <span className="gradient-text">Academy Directory</span></>}
        subtitle="Find academies by sport and location across India." />

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="search" placeholder="Search academies..." className="input-field flex-1" value={search} onChange={e => setSearch(e.target.value)} />
          <input placeholder="Filter by sport" className="input-field sm:w-48" value={sport} onChange={e => setSport(e.target.value)} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {academies.map(a => (
              <div key={a.id} className="glass-card p-5 card-hover">
                <h3 className="font-display font-bold text-lg">{a.name}</h3>
                <p className="text-sm text-ki-saffron mt-1">{Array.isArray(a.sports_offered) ? a.sports_offered.join(', ') : a.sports_offered}</p>
                <p className="text-xs text-theme-muted flex items-center gap-1 mt-2"><HiLocationMarker /> {a.district}, {a.state}</p>
                <p className="text-xs text-theme-muted flex items-center gap-1 mt-1"><HiPhone /> {a.contact_phone}</p>
                <div className="flex items-center gap-1 mt-3 text-amber-500 text-sm"><HiStar /> {a.rating} / 5.0</div>
                <p className="text-xs text-theme-muted mt-3 leading-relaxed">
                  <strong className="text-theme-secondary">Facilities:</strong>{' '}
                  {ACADEMY_FACILITIES[a.slug] || 'Synthetic turf, strength & conditioning gym, physiotherapy, residential hostel, and sports science support.'}
                </p>
                {a.contact_email && <p className="text-xs text-theme-muted mt-1">{a.contact_email}</p>}
              </div>
            ))}
          </div>
          <div className="glass-card p-6 min-h-[300px]">
            <h3 className="font-display font-bold mb-3">Find Academies Near You</h3>
            <p className="text-sm text-theme-secondary mb-4">Partner academies are listed by state and sport. Contact admissions directly or complete your SportsGauge profile before applying for merit scholarships.</p>
            <p className="text-xs text-theme-muted">Map view: search academy name + district on Google Maps. Full interactive maps coming in a future release.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
