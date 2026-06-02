import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LEGAL_CONTENT } from '../constants/content/legal';

export default function Legal() {
  const { doc = 'privacy' } = useParams();
  const content = LEGAL_CONTENT[doc] || LEGAL_CONTENT.privacy;

  return (
    <div className="page-shell">
      <Navbar />
      <section className="pt-28 pb-16 max-w-3xl mx-auto px-4">
        <Link to="/" className="text-sm text-ki-saffron mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-display font-bold mb-2">{content.title}</h1>
        <p className="text-sm text-theme-muted mb-10">Last updated: {content.updated}</p>
        <div className="space-y-8">
          {content.sections.map(s => (
            <div key={s.heading}>
              <h2 className="text-lg font-semibold mb-3 text-theme">{s.heading}</h2>
              <p className="text-sm text-theme-secondary leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
