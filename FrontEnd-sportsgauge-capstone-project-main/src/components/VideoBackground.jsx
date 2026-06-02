import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoBackground({
  src,
  poster,
  className = '',
  overlayClassName = 'bg-theme-base/65',
  children,
  minHeight = 'min-h-[70vh]',
  scaleOnScroll = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`relative w-full overflow-hidden ${minHeight} ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${overlayClassName} backdrop-blur-[1px] transition-colors duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-b from-theme-base/40 via-transparent to-theme-base" />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-ki-saffron/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-ki-blue/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}

export function VideoHeroContent({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 ${className}`}
    >
      {children}
    </motion.div>
  );
}
