import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import NewsCard from '../components/ecosystem/NewsCard';
import { fetchNews } from '../utils/ecosystemApi';

const CATEGORIES = ['', 'Khelo India', 'Olympics', 'Athletics', 'Football', 'Cricket', 'Kabaddi', 'Government Sports News', 'Technology'];

export default function News() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNews({ category, search }).then(setArticles).catch(() => setArticles([]));
  }, [category, search]);

  const featured = articles.find(a => a.is_featured) || articles[0];
  const rest = articles.filter(a => a.id !== featured?.id);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero video="stories" label="Sports News" title={<>Latest <span className="gradient-text">Sports Updates</span></>}
        subtitle="Khelo India, Olympics, government schemes, and sports technology from across India." />

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${category === c ? 'bg-ki-saffron text-white border-ki-saffron' : 'border-theme text-theme-muted'}`}>
              {c || 'All'}
            </button>
          ))}
        </div>
        <input type="search" placeholder="Search news..." className="input-field mb-8 max-w-md" value={search} onChange={e => setSearch(e.target.value)} />

        <div className="grid md:grid-cols-3 gap-6">
          {featured && <NewsCard article={featured} featured />}
          {rest.map(a => <NewsCard key={a.id} article={a} />)}
        </div>
      </section>
      <Footer />
    </div>
  );
}
