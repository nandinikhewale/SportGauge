import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';

export default function NewsCard({ article, featured = false }) {
  return (
    <Link
      to={`/news/${article.slug}`}
      className={`glass-card card-hover overflow-hidden block group ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div className={`relative ${featured ? 'h-64' : 'h-40'}`}>
        <LazyImage
          src={article.image_url}
          alt={article.title}
          seed={`news-${article.slug}`}
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-theme-base/40 to-transparent" />
        <span className="absolute top-3 left-3 badge badge-saffron text-[10px]">{article.category}</span>
      </div>
      <div className="p-4">
        <h3 className={`font-display font-semibold text-theme group-hover:text-ki-saffron transition-colors ${featured ? 'text-xl' : 'text-sm line-clamp-2'}`}>
          {article.title}
        </h3>
        <p className="text-xs text-theme-muted mt-2 line-clamp-2">{article.summary}</p>
      </div>
    </Link>
  );
}
