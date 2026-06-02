import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoBackground, { VideoHeroContent } from '../components/VideoBackground';
import LazyImage from '../components/LazyImage';
import { FadeInSection, StaggerContainer, StaggerItem, Counter } from '../components/Motion';
import { VIDEOS, STORY_PHOTOS, IMAGES } from '../constants/media';
import { EXTRA_SUCCESS_STORIES } from '../constants/content/extraStories';
import { HiStar, HiFilter, HiX } from 'react-icons/hi';

const stories = [
  {
    name: 'Rohit Kumar',
    state: 'Bihar',
    district: 'Patna',
    sport: 'Sprint',
    age: 17,
    gender: 'Male',
    avatar: 'RK',
    quote: 'Improved my sprint timing by 18% and qualified for district-level trials. The AI analysis showed me exactly where I was losing time in my stride. My coach was amazed at the level of detail in the report.',
    improvement: '+18% Speed',
    timeline: [
      { date: 'Jan 2026', event: 'First Assessment — 100m in 13.2s' },
      { date: 'Mar 2026', event: 'AI-guided training adjustments' },
      { date: 'May 2026', event: 'Re-assessment — 100m in 10.8s' },
      { date: 'Jun 2026', event: 'Qualified for district trials' },
    ],
    scores: { before: 62, after: 88 },
  },
  {
    name: 'Priya Sharma',
    state: 'Rajasthan',
    district: 'Jaipur',
    sport: 'Athletics',
    age: 16,
    gender: 'Female',
    avatar: 'PS',
    quote: 'Coming from a small village near Jaipur, I never had access to professional coaching. SportsGauge identified my potential in high jump and connected me with SAI coaches within weeks. My life has completely changed.',
    improvement: 'SAI Selected',
    timeline: [
      { date: 'Sep 2025', event: 'First assessment at school camp' },
      { date: 'Nov 2025', event: 'High jump potential flagged by AI' },
      { date: 'Jan 2026', event: 'Connected with SAI training center' },
      { date: 'Apr 2026', event: 'Selected for SAI youth program' },
    ],
    scores: { before: 55, after: 91 },
  },
  {
    name: 'Arjun Patel',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sport: 'Kabaddi',
    age: 19,
    gender: 'Male',
    avatar: 'AP',
    quote: 'The biomechanical assessment revealed I had exceptional agility metrics. Within 6 months of targeted training based on the AI report, I was selected for the state U-19 Kabaddi team.',
    improvement: 'State U-19 Team',
    timeline: [
      { date: 'Aug 2025', event: 'Kabaddi fitness assessment' },
      { date: 'Oct 2025', event: 'Agility score: Top 2%' },
      { date: 'Jan 2026', event: 'Intensive agility training' },
      { date: 'Mar 2026', event: 'Gujarat U-19 selection' },
    ],
    scores: { before: 70, after: 94 },
  },
  {
    name: 'Anjali Devi',
    state: 'Jharkhand',
    district: 'Ranchi',
    sport: 'Weightlifting',
    age: 18,
    gender: 'Female',
    avatar: 'AD',
    quote: 'The AI-powered sit-up and strength assessments helped my coach design a targeted training program that addressed my weaknesses. I won bronze at Junior Nationals last year — something I never dreamed possible.',
    improvement: 'Jr. National Bronze',
    timeline: [
      { date: 'Jun 2025', event: 'Strength baseline assessment' },
      { date: 'Sep 2025', event: 'Personalized training plan generated' },
      { date: 'Dec 2025', event: 'Strength improved by 35%' },
      { date: 'Feb 2026', event: 'Bronze at Junior Nationals' },
    ],
    scores: { before: 58, after: 87 },
  },
  {
    name: 'Vikram Singh',
    state: 'Haryana',
    district: 'Karnal',
    sport: 'Wrestling',
    age: 20,
    gender: 'Male',
    avatar: 'VS',
    quote: 'As a wrestler from a small village, getting proper assessment was a dream. SportsGauge\'s strength and endurance tests gave me data that no coach had ever provided. I am now training at the Chhatrasal Stadium.',
    improvement: 'Elite Academy',
    timeline: [
      { date: 'Jul 2025', event: 'Wrestling fitness assessment' },
      { date: 'Oct 2025', event: 'Endurance flagged as elite-level' },
      { date: 'Jan 2026', event: 'Recommendation to Chhatrasal' },
      { date: 'Apr 2026', event: 'Enrolled at Chhatrasal Stadium' },
    ],
    scores: { before: 75, after: 96 },
  },
  {
    name: 'Meera Kumari',
    state: 'Tamil Nadu',
    district: 'Chennai',
    sport: 'Basketball',
    age: 15,
    gender: 'Female',
    avatar: 'MK',
    quote: 'My school didn\'t have a basketball coach. Through SportsGauge\'s vertical jump and agility tests, I was identified as having national-level potential. Now I train with the Tamil Nadu state women\'s basketball team.',
    improvement: 'State Team',
    timeline: [
      { date: 'Nov 2025', event: 'School-level assessment' },
      { date: 'Jan 2026', event: 'Vertical jump: Top 1% for age group' },
      { date: 'Mar 2026', event: 'Invited to state trials' },
      { date: 'May 2026', event: 'Selected for TN state team' },
    ],
    scores: { before: 65, after: 92 },
  },
  ...EXTRA_SUCCESS_STORIES,
];

const allSports = [...new Set(stories.map(s => s.sport))];
const allStates = [...new Set(stories.map(s => s.state))];

export default function Stories() {
  const [sportFilter, setSportFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [expandedStory, setExpandedStory] = useState(null);

  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredStories = stories.filter(s => {
    return (!sportFilter || s.sport === sportFilter) && (!stateFilter || s.state === stateFilter);
  });

  const clearFilters = () => { setSportFilter(''); setStateFilter(''); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-shell"
    >
      <Navbar />

      <VideoBackground src={VIDEOS.stories.src} poster={VIDEOS.stories.poster} minHeight="min-h-[80vh]">
        <VideoHeroContent>
          <span className="section-label mb-6 block w-fit">Success Stories</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight max-w-4xl">
            Real Athletes, <span className="gradient-text">Real Results</span>
          </h1>
          <p className="text-lg md:text-xl text-theme-secondary leading-relaxed max-w-2xl font-medium">
            Every story represents a life changed by data-driven assessment — from rural villages to national arenas.
          </p>
        </VideoHeroContent>
      </VideoBackground>

      {/* ════════════════════════════════════════════
          STICKY VIDEO SECTION
         ════════════════════════════════════════════ */}
      <div className="relative w-full z-10 bg-ki-dark">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.video
            ref={videoRef}
            style={{ scale: videoScale }}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-person-running-on-the-track-4088/1080p.mp4" type="video/mp4" />
          </motion.video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-ki-dark/65 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ki-dark via-transparent to-ki-dark" />
        </div>

        <div className="relative z-10 -mt-[100vh]">
          <section className="h-screen flex flex-col justify-center items-center px-4">
            <FadeInSection className="text-center max-w-5xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                <div className="glass-card-strong p-8 bg-white/5 backdrop-blur-xl border-white/20 text-center shadow-2xl">
                  <div className="text-5xl md:text-6xl font-display font-bold text-ki-saffron mb-3 drop-shadow-lg">
                    <Counter end={500} suffix="+" />
                  </div>
                  <div className="text-base font-bold text-white tracking-widest uppercase">Athletes Scouted</div>
                  <div className="text-xs text-gray-300 mt-2 font-medium">By State & National Teams</div>
                </div>
                
                <div className="glass-card-strong p-8 bg-white/5 backdrop-blur-xl border-white/20 text-center shadow-2xl transform md:-translate-y-8">
                  <div className="text-5xl md:text-6xl font-display font-bold text-emerald-400 mb-3 drop-shadow-lg">
                    <Counter end={25} suffix="%" />
                  </div>
                  <div className="text-base font-bold text-white tracking-widest uppercase">Avg. Improvement</div>
                  <div className="text-xs text-gray-300 mt-2 font-medium">In Performance Metrics (6 Months)</div>
                </div>

                <div className="glass-card-strong p-8 bg-white/5 backdrop-blur-xl border-white/20 text-center shadow-2xl">
                  <div className="text-5xl md:text-6xl font-display font-bold text-blue-400 mb-3 drop-shadow-lg">
                    <Counter end={120} suffix="+" />
                  </div>
                  <div className="text-base font-bold text-white tracking-widest uppercase">Scholarships</div>
                  <div className="text-xs text-gray-300 mt-2 font-medium">Awarded to Rural Talent</div>
                </div>
              </div>
            </FadeInSection>
          </section>
        </div>
      </div>

      {/* ── Filters ── */}
      <section className="py-4 sticky top-[72px] z-30 bg-ki-dark-2/95 backdrop-blur-xl border-y border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <HiFilter size={18} className="text-ki-saffron" />
              <span>Filter Stories:</span>
            </div>
            <select
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-ki-saffron/50 focus:ring-1 focus:ring-ki-saffron/50 transition-colors"
            >
              <option value="">All Sports</option>
              {allSports.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-ki-saffron/50 focus:ring-1 focus:ring-ki-saffron/50 transition-colors"
            >
              <option value="">All States</option>
              {allStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {(sportFilter || stateFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <HiX size={14} /> Clear
              </button>
            )}
            <span className="ml-auto text-xs font-bold text-ki-saffron uppercase tracking-widest">
              {filteredStories.length} {filteredStories.length === 1 ? 'Story' : 'Stories'} found
            </span>
          </div>
        </div>
      </section>

      {/* ── Stories Grid ── */}
      <section className="py-20 bg-ki-dark relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredStories.map((story) => (
                <StaggerItem key={story.name}>
                  <motion.div layout className="glass-card-strong p-6 sm:p-8 h-full card-hover group relative overflow-hidden bg-ki-dark-2 border-white/10 hover:border-ki-saffron/30 transition-all duration-500 shadow-xl">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ki-saffron/[0.04] rounded-full blur-[40px] group-hover:bg-ki-saffron/[0.08] transition-colors duration-700" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-ki-saffron shadow-lg shadow-ki-saffron/20 flex items-center justify-center bg-gradient-to-br from-ki-saffron to-ki-accent text-white font-bold text-sm">
                            {STORY_PHOTOS[story.name] ? (
                              <img src={STORY_PHOTOS[story.name]} alt={story.name} className="w-full h-full object-cover" />
                            ) : (
                              story.avatar
                            )}
                          </div>
                          <div>
                            <div className="font-display font-bold text-white text-lg">{story.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{story.district}, {story.state}</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider shadow-sm">
                          {story.improvement}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-ki-saffron uppercase tracking-wider">{story.sport}</span>
                        <span className="text-xs text-gray-400 font-medium bg-white/5 px-2.5 py-1 rounded-md">Age: {story.age}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <HiStar key={s} className="w-4 h-4 text-ki-saffron" />)}
                      </div>

                      {/* Quote */}
                      <p className="text-base text-gray-300 leading-relaxed italic mb-6 font-medium border-l-2 border-ki-saffron/50 pl-4">
                        "{story.quote}"
                      </p>

                      {/* Score Comparison */}
                      <div className="flex items-center gap-5 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-2 font-semibold">
                            <span className="text-gray-400">Initial Score</span>
                            <span className="text-gray-300">{story.scores.before}/100</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
                            <div className="h-full rounded-full bg-gray-500" style={{ width: `${story.scores.before}%` }} />
                          </div>
                        </div>
                        <div className="text-gray-500 text-sm font-bold">→</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-2 font-semibold">
                            <span className="text-gray-400">Latest Score</span>
                            <span className="text-emerald-400">{story.scores.after}/100</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${story.scores.after}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Timeline */}
                      <button
                        onClick={() => setExpandedStory(expandedStory === story.name ? null : story.name)}
                        className="text-xs font-bold text-ki-saffron/80 hover:text-ki-saffron uppercase tracking-wider transition-colors w-full text-left flex justify-between items-center"
                      >
                        {expandedStory === story.name ? 'Hide Timeline ↑' : 'View Journey ↓'}
                      </button>

                      <AnimatePresence>
                        {expandedStory === story.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                              {story.timeline.map((t, j) => (
                                <div key={j} className="flex items-start gap-4">
                                  <div className="w-2 h-2 rounded-full bg-ki-saffron mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,153,51,0.5)]" />
                                  <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{t.date}</div>
                                    <div className="text-sm text-gray-200 font-medium">{t.event}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>

          {filteredStories.length === 0 && (
            <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 mt-8">
              <p className="text-gray-400 text-lg font-medium mb-4">No stories match your current filters.</p>
              <button onClick={clearFilters} className="text-sm font-bold text-ki-saffron hover:text-orange-400 transition-colors uppercase tracking-widest border-b border-ki-saffron pb-1">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="relative z-20 bg-ki-dark">
        <Footer />
      </div>
    </motion.div>
  );
}
