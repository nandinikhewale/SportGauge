import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import { TRAINING_GUIDES, ASSESSMENT_GUIDES, NUTRITION_RESOURCES, PERFORMANCE_ARTICLES, DOWNLOADABLES } from '../constants/content/resources';

function ResourceGrid({ title, items }) {
  return (
    <div className="mb-14">
      <h2 className="text-2xl font-display font-bold mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => (
          <article key={item.title} className="glass-card p-6 card-hover">
            <span className="badge badge-saffron text-[10px] mb-2">{item.category || item.type}</span>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-theme-secondary leading-relaxed">{item.desc || `Official SportsGauge resource (${item.size}).`}</p>
            <p className="text-xs text-theme-muted mt-3">{item.readTime ? `Read time: ${item.readTime}` : `Format: ${item.type} · ${item.size}`}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Resources() {
  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero label="Resources" title={<>Training & <span className="gradient-text">Performance Library</span></>}
        subtitle="Guides for athletes, coaches, and school facilitators — from assessment setup to nutrition and competition preparation." video="training" />

      <section className="py-16 max-w-7xl mx-auto px-4">
        <ResourceGrid title="Training Guides" items={TRAINING_GUIDES} />
        <ResourceGrid title="Assessment Guides" items={ASSESSMENT_GUIDES} />
        <ResourceGrid title="Nutrition Resources" items={NUTRITION_RESOURCES} />
        <ResourceGrid title="Performance Articles" items={PERFORMANCE_ARTICLES} />
        <ResourceGrid title="Downloadable Resources" items={DOWNLOADABLES} />
      </section>
      <Footer />
    </div>
  );
}
