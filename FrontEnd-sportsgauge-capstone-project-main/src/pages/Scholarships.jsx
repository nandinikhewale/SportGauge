import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import { fetchScholarships } from '../utils/ecosystemApi';

export default function Scholarships() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchScholarships(category ? { category } : {}).then(setItems).catch(() => setItems([]));
  }, [category]);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="about" label="Opportunities" title={<>Scholarships & <span className="gradient-text">Schemes</span></>}
        subtitle="Government sports schemes, scholarships, quotas, and talent identification programs." />

      <section className="py-12 max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-8">
          {['', 'Government', 'Scholarship', 'Sports Quota', 'Talent Program'].map(t => (
            <button key={t} type="button" onClick={() => setCategory(t)}
              className={`px-4 py-2 rounded-full text-xs ${category === t ? 'bg-ki-saffron text-white' : 'glass-card'}`}>{t || 'All'}</button>
          ))}
        </div>
        <div className="space-y-4">
          {items.map(s => (
            <article key={s.id} className="glass-card p-6 card-hover">
              <span className="badge badge-saffron text-[10px] mb-2">{s.category}</span>
              <h3 className="text-xl font-display font-bold">{s.title}</h3>
              <p className="text-sm text-theme-secondary mt-2">{s.description}</p>
              {s.eligibility && <p className="text-xs text-theme-muted mt-3"><strong>Eligibility:</strong> {s.eligibility}</p>}
              {s.deadline && <p className="text-xs text-ki-saffron mt-2">Deadline: {s.deadline}</p>}
              <a href={s.link_url || '#'} target="_blank" rel="noreferrer" className="btn-primary w-auto inline-flex mt-4 px-6 py-2 text-xs">Learn More</a>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
