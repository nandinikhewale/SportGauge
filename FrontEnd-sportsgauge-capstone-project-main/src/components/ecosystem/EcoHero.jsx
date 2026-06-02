import { motion } from 'framer-motion';
import VideoBackground, { VideoHeroContent } from '../VideoBackground';
import { VIDEOS } from '../../constants/media';

export default function EcoHero({ title, subtitle, label, video = 'about', children }) {
  const v = VIDEOS[video] || VIDEOS.about;
  return (
    <VideoBackground src={v.src} poster={v.poster} minHeight="min-h-[45vh]">
      <VideoHeroContent>
        {label && <span className="section-label mb-4 block w-fit">{label}</span>}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold max-w-4xl mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="text-lg text-theme-secondary max-w-2xl">{subtitle}</p>}
        {children}
      </VideoHeroContent>
    </VideoBackground>
  );
}
