import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LazyImage from '../components/LazyImage';
import { fetchNewsArticle } from '../utils/ecosystemApi';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchNewsArticle(slug).then(setArticle).catch(() => setArticle(null));
  }, [slug]);

  if (!article?.title) {
    return (
      <div className="page-shell">
        <Navbar />
        <p className="text-center pt-32 text-theme-muted">Article not found</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link to="/news" className="text-sm text-ki-saffron mb-4 inline-block">← Back to News</Link>
        <span className="badge badge-saffron mb-4">{article.category}</span>
        <h1 className="text-3xl font-display font-bold mb-4">{article.title}</h1>
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
          <LazyImage src={article.image_url} alt="" seed={article.slug} wrapperClassName="absolute inset-0 w-full h-full" />
        </div>
        <p className="text-theme-secondary leading-relaxed whitespace-pre-wrap">{article.content || article.summary}</p>
      </article>
      <Footer />
    </div>
  );
}
