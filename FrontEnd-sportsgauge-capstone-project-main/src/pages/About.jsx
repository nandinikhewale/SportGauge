import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoBackground, { VideoHeroContent } from '../components/VideoBackground';
import LazyImage from '../components/LazyImage';
import { FadeInSection, StaggerContainer, StaggerItem, Counter } from '../components/Motion';
import { VIDEOS, IMAGES } from '../constants/media';
import { HiOutlineEye, HiOutlineLightBulb } from 'react-icons/hi';
import { FaBrain, FaVideo, FaChartLine, FaCloud, FaHandshake, FaMapMarkedAlt, FaUsers } from 'react-icons/fa';

const impactStats = [
  { value: 10000, suffix: '+', label: 'Athletes Registered', icon: FaUsers },
  { value: 25000, suffix: '+', label: 'Assessments Completed', icon: FaChartLine },
  { value: 28, suffix: '', label: 'States Covered', icon: FaMapMarkedAlt },
  { value: 98, suffix: '%', label: 'AI Verified Results', icon: FaBrain },
];

const techStack = [
  { icon: FaBrain, title: 'AI Analysis', desc: 'Deep learning models trained on thousands of athletic performances to detect form, timing, and biomechanical efficiency with unprecedented accuracy.', color: 'from-purple-500/20 to-violet-500/10' },
  { icon: FaVideo, title: 'Computer Vision', desc: 'Real-time video processing using OpenCV to extract motion data from standard smartphone cameras without requiring any specialized equipment.', color: 'from-blue-500/20 to-cyan-500/10' },
  { icon: FaChartLine, title: 'Pose Detection', desc: 'MediaPipe pose estimation tracks 33 body landmarks at 30fps, enabling precise joint angle and movement pattern analysis in real time.', color: 'from-emerald-500/20 to-teal-500/10' },
  { icon: FaCloud, title: 'Cloud Analytics', desc: 'Centralized data processing compares individual performances against national benchmarks across age groups and demographics instantly.', color: 'from-orange-500/20 to-amber-500/10' },
];

const timeline = [
  { year: '2023', title: 'Project Inception', desc: 'Research began at university labs with a pilot study of 500 athletes across 3 districts in Bihar.' },
  { year: '2024', title: 'Platform Development', desc: 'Full-stack platform built with AI-powered video analysis, supporting 4 core fitness assessments.' },
  { year: '2025', title: 'Beta Launch', desc: 'Beta tested across 12 states with over 5,000 athletes, receiving 94% positive feedback.' },
  { year: '2026', title: 'National Rollout', desc: 'Full national launch with integration support for state sports bodies and SAI programs.' },
];

export default function About() {
  const videoRef = useRef(null);
  
  // Parallax effect for the middle video section
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Pause video when not visible
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-shell"
    >
      <Navbar />

      <VideoBackground src={VIDEOS.about.src} poster={VIDEOS.about.poster} minHeight="min-h-[85vh]">
        <VideoHeroContent>
          <span className="section-label mb-6 block w-fit">About Us</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight max-w-4xl">
            Democratizing Sports Assessment with{' '}
            <span className="gradient-text">Artificial Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-theme-secondary leading-relaxed max-w-2xl font-medium">
            SportsGauge was born from a simple observation: India has 1.4 billion people and
            an immense pool of untapped athletic talent — we are changing that with technology.
          </p>
        </VideoHeroContent>
      </VideoBackground>

      <section className="py-20 bg-theme-base z-20 border-b border-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <span className="section-label mb-4 block w-fit">Company Overview</span>
            <h2 className="text-3xl font-display font-bold mb-6">Why SportsGauge Exists</h2>
            <p className="text-theme-secondary leading-relaxed mb-5">
              India produces extraordinary athletic talent, yet millions of young athletes never receive an objective evaluation of their potential. Selection often depends on geography, informal networks, and subjective judgment. SportsGauge was founded to replace guesswork with science — making professional-grade assessment accessible through any smartphone.
            </p>
            <p className="text-theme-secondary leading-relaxed mb-5">
              Our platform serves athletes, coaches, academies, school districts, and government sports bodies under one national ecosystem. From the first sit-up test in a village school to leaderboard rankings viewed by state selectors, every step is documented, validated, and designed for transparency.
            </p>
            <p className="text-theme-secondary leading-relaxed">
              We align with Khelo India, Sports Authority of India programmes, and state federation talent pipelines. SportsGauge is not a replacement for coaching — it is the digital infrastructure that ensures the right athletes reach the right opportunities at the right time.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-theme-base z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <FadeInSection>
              <div className="glass-card-strong p-0 h-full relative overflow-hidden group hover:border-ki-saffron/30 transition-colors duration-500">
                <div className="relative h-48 md:h-56 w-full">
                  <LazyImage src={IMAGES.mission} alt="Athletes training" seed="mission" wrapperClassName="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-base to-transparent" />
                </div>
                <div className="p-8 sm:p-10 relative z-10 -mt-8">
                <div className="absolute inset-0 bg-gradient-to-br from-ki-saffron/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ki-saffron/20 to-ki-accent/10 flex items-center justify-center mb-8 border border-ki-saffron/20 shadow-lg shadow-ki-saffron/10">
                    <HiOutlineLightBulb className="text-ki-saffron" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-5 text-white">Our Mission</h2>
                  <p className="text-gray-300 leading-relaxed mb-6 font-medium text-lg">
                    To build India's most accessible and scientifically rigorous sports talent identification 
                    platform.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    By combining AI-driven biomechanical analysis with a mobile-first approach, we 
                    ensure that every aspiring athlete — regardless of geography, economic background, or 
                    access to coaching infrastructure — receives an objective, data-backed evaluation of 
                    their athletic potential.
                  </p>
                  <ul className="space-y-3 pt-6 border-t border-white/10">
                    {[
                      'Identify raw talent at the grassroots level across all states',
                      'Provide equal opportunity through affordable technology',
                      'Enable AI-driven, bias-free assessment for transparent selection',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-ki-saffron mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.15}>
              <div className="glass-card-strong p-0 h-full relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
                <div className="relative h-48 md:h-56 w-full">
                  <LazyImage src={IMAGES.vision} alt="Stadium vision" seed="vision" wrapperClassName="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-base to-transparent" />
                </div>
                <div className="p-8 sm:p-10 relative z-10 -mt-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-8 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    <HiOutlineEye className="text-blue-400" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-5 text-white">Our Vision</h2>
                  <p className="text-gray-300 leading-relaxed mb-6 font-medium text-lg">
                    By 2030, SportsGauge aims to assess over one million athletes annually across all 
                    28 states and 8 union territories of India.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    We envision a future where a teenager in a remote village in Jharkhand has the same 
                    quality of athletic assessment as an elite academy in Delhi — powered entirely by a 
                    smartphone camera and our AI engine.
                  </p>
                  <p className="text-gray-400 leading-relaxed pt-6 border-t border-white/10">
                    We are building the digital backbone that connects grassroots talent directly to 
                    state sports authorities and programs like Khelo India — creating a seamless 
                    talent pipeline from village grounds to international arenas.
                  </p>
                </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          STICKY VIDEO SECTION
         ════════════════════════════════════════════ */}
      <div className="relative w-full z-10 bg-ki-dark">
        {/* Sticky Background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.video
            ref={videoRef}
            style={{ scale: videoScale }}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-a-man-lifting-a-barbell-2554/1080p.mp4" type="video/mp4" />
          </motion.video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-ki-dark/65 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ki-dark via-transparent to-ki-dark" />
        </div>

        {/* Content Scrolling Over Video */}
        <div className="relative z-10 -mt-[100vh]">
          <section className="min-h-screen flex flex-col justify-center items-center py-20 px-4">
            <FadeInSection className="text-center max-w-5xl mx-auto w-full">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-10 leading-tight drop-shadow-xl">
                Empowering the <br />
                <span className="gradient-text">Next Generation of Athletes</span><br />
                Through Technology
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16">
                {impactStats.map((stat, i) => (
                  <FadeInSection key={i} delay={i * 0.1}>
                    <div className="glass-card-strong p-6 sm:p-8 bg-white/5 backdrop-blur-xl border-white/20 text-center shadow-2xl">
                      <div className="text-4xl md:text-5xl font-display font-bold text-ki-saffron mb-2 drop-shadow-lg">
                        <Counter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm font-semibold text-white tracking-wide uppercase mt-3">{stat.label}</div>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
          </section>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          THE PROBLEM WE SOLVE
         ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-ki-dark z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="section-label mb-4 mx-auto w-fit block">The Problem We Solve</span>
            <h2 className="section-title mb-4">
              Why This Platform <span className="gradient-text">Exists</span>
            </h2>
            <p className="section-subtitle mx-auto">
              India produces Olympic-level athletes, but millions of talented youth never get the chance to be noticed. 
              Here's what we're solving.
            </p>
          </FadeInSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'Rural Talent Goes Unnoticed', desc: 'Over 65% of India\'s population lives in rural areas where access to trained coaches and evaluation infrastructure is virtually nonexistent. Exceptional athletes remain undiscovered simply due to geography.', icon: FaMapMarkedAlt, stat: '65%', statLabel: 'rural population' },
              { title: 'Assessments Don\'t Scale', desc: 'Traditional talent hunts rely on physical presence of evaluators, limiting reach to a handful of districts per year. Our platform enables simultaneous assessment across unlimited locations.', icon: FaUsers, stat: '500+', statLabel: 'districts covered' },
              { title: 'Government Integration', desc: 'State and national sports bodies need a standardized, data-driven system to identify and track talent. SportsGauge provides the technology layer that makes centralized talent management possible.', icon: FaHandshake, stat: '28', statLabel: 'states integrated' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="glass-card p-8 h-full card-hover group relative overflow-hidden bg-ki-dark-2 border-white/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ki-saffron/[0.03] rounded-full blur-[40px] group-hover:bg-ki-saffron/[0.08] transition-colors duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ki-saffron/20 to-ki-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-ki-saffron/20">
                      <item.icon className="text-ki-saffron" size={24} />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-4 text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors flex-1">{item.desc}</p>
                    <div className="pt-5 border-t border-white/10 flex items-baseline">
                      <span className="text-3xl font-display font-bold text-ki-saffron">{item.stat}</span>
                      <span className="text-sm text-gray-400 ml-2 font-medium uppercase tracking-wider">{item.statLabel}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Technology Stack ── */}
      <section className="py-24 bg-ki-dark relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="section-label mb-4 mx-auto w-fit block">Technology</span>
            <h2 className="section-title mb-4">
              Powered by <span className="gradient-text">Cutting-Edge AI</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Our proprietary technology stack combines the latest advances in computer vision and machine 
              learning to deliver professional-grade athletic analysis.
            </p>
          </FadeInSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((t, i) => (
              <StaggerItem key={i}>
                <div className="glass-card p-8 h-full card-hover group text-center relative overflow-hidden bg-ki-dark-2 border-white/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ki-saffron/15 to-ki-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-black/40">
                      <t.icon className="text-ki-saffron drop-shadow-md" size={28} />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-4 text-white">{t.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{t.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="py-24 relative bg-ki-dark z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-ki-dark-2/40 via-transparent to-ki-dark" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-20">
            <span className="section-label mb-4 mx-auto w-fit block">Our Journey</span>
            <h2 className="section-title mb-4">
              Building the <span className="gradient-text">Future of Sports</span>
            </h2>
          </FadeInSection>

          <div className="relative pb-10">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-1 bg-gradient-to-b from-ki-saffron via-ki-saffron/20 to-transparent rounded-full" />

            {timeline.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <div className={`relative flex items-center gap-8 mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-ki-saffron border-4 border-ki-dark z-10 shadow-[0_0_15px_rgba(255,153,51,0.5)]" />
                  
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] glass-card p-6 bg-ki-dark-2 border-white/10 card-hover ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-sm font-display font-bold text-ki-saffron tracking-widest">{item.year}</span>
                    <h3 className="text-xl font-display font-bold mt-2 mb-3 text-white">{item.title}</h3>
                    <p className="text-base text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-20 bg-ki-dark">
        <Footer />
      </div>
    </motion.div>
  );
}
