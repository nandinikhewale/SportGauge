import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeInSection, StaggerContainer, StaggerItem, Counter } from '../components/Motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LazyImage from '../components/LazyImage';
import { VIDEOS, GALLERY, ATHLETE_SHOWCASE, IMAGES } from '../constants/media';
import HomeEcosystem from '../components/ecosystem/HomeEcosystem';
import { HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineCube, HiArrowRight, HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaRunning, FaFootballBall, FaBasketballBall, FaVolleyballBall } from 'react-icons/fa';
import { MdSportsCricket, MdSportsKabaddi } from 'react-icons/md';

/* ── Data ── */
const stats = [
  { value: 10000, suffix: '+', label: 'Athletes Assessed', icon: '🏅' },
  { value: 500, suffix: '+', label: 'Districts Covered', icon: '📍' },
  { value: 50, suffix: '+', label: 'Sports Programs', icon: '🏆' },
  { value: 95, suffix: '%', label: 'AI Accuracy', icon: '🤖' },
];

const features = [
  { icon: HiOutlineChartBar, title: 'AI-Based Assessment', desc: 'Computer vision algorithms analyze biomechanics in real-time, delivering objective performance metrics that eliminate human bias from talent evaluation.', color: 'from-orange-500/20 to-amber-500/10' },
  { icon: HiOutlineShieldCheck, title: 'Transparent Evaluation', desc: 'Every assessment is recorded, verified, and scored with full audit trails. Athletes and coaches receive detailed breakdowns of each performance metric.', color: 'from-emerald-500/20 to-teal-500/10' },
  { icon: HiOutlineGlobeAlt, title: 'Nationwide Accessibility', desc: 'From metropolitan cities to rural villages, our platform requires only a smartphone camera — making world-class assessment available everywhere.', color: 'from-blue-500/20 to-cyan-500/10' },
  { icon: HiOutlineCube, title: 'Government-Ready Framework', desc: 'Built to integrate with Khelo India, SAI, and state sports authority databases for streamlined talent pipeline management across all levels.', color: 'from-purple-500/20 to-violet-500/10' },
];

const sports = [
  { name: 'Athletics', icon: FaRunning, color: 'from-orange-500 to-red-500', img: IMAGES.track, tagline: 'Track & Field events' },
  { name: 'Football', icon: FaFootballBall, color: 'from-green-500 to-emerald-600', img: IMAGES.rural, tagline: '11-a-side beautiful game' },
  { name: 'Cricket', icon: MdSportsCricket, color: 'from-blue-500 to-indigo-600', img: IMAGES.team, tagline: 'Batting & bowling analysis' },
  { name: 'Basketball', icon: FaBasketballBall, color: 'from-amber-500 to-orange-600', img: IMAGES.youth, tagline: 'Court performance metrics' },
  { name: 'Volleyball', icon: FaVolleyballBall, color: 'from-yellow-500 to-amber-600', img: IMAGES.fitness, tagline: 'Spike & serve dynamics' },
  { name: 'Kabaddi', icon: MdSportsKabaddi, color: 'from-purple-500 to-violet-600', img: IMAGES.athlete, tagline: 'Raider & defender analysis' },
];

const testimonials = [
  { name: 'Rohit Kumar', state: 'Bihar', sport: 'Sprint', quote: 'Improved my sprint timing by 18% and qualified for district-level trials. The AI analysis showed me exactly where I was losing time in my stride pattern.', improvement: '+18% Speed', avatar: 'RK', photo: IMAGES.sprint },
  { name: 'Priya Sharma', state: 'Rajasthan', sport: 'High Jump', quote: 'Coming from a small village near Jaipur, I never had access to professional coaching. SportsGauge identified my potential in high jump and connected me with SAI coaches within weeks.', improvement: 'SAI Selected', avatar: 'PS', photo: IMAGES.track },
  { name: 'Arjun Patel', state: 'Gujarat', sport: 'Kabaddi', quote: 'The biomechanical assessment revealed I had exceptional agility metrics. Within 6 months of targeted training based on the AI report, I was selected for the state U-19 Kabaddi team.', improvement: 'State U-19', avatar: 'AP', photo: IMAGES.fitness },
  { name: 'Anjali Devi', state: 'Jharkhand', sport: 'Weightlifting', quote: 'The AI-powered sit-up and strength assessments helped my coach design a targeted training program that addressed my weaknesses. I won bronze at Junior Nationals last year.', improvement: 'Jr. National Bronze', avatar: 'AD', photo: IMAGES.training },
];

const partners = ['Sports Authority of India', 'Khelo India', 'National Sports Federation', 'BCCI', 'Indian Olympic Association'];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialTimer = useRef(null);
  const videoRef = useRef(null);
  
  // Parallax effect for video
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  // Manage video performance (pause when not visible)
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

  // Auto-advance testimonials
  useEffect(() => {
    testimonialTimer.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(testimonialTimer.current);
  }, []);

  const nextTestimonial = () => {
    clearInterval(testimonialTimer.current);
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    clearInterval(testimonialTimer.current);
    setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="page-shell">
      <Navbar />

      {/* ════════════════════════════════════════════
          STICKY VIDEO HERO + STATS CONTAINER
         ════════════════════════════════════════════ */}
      <div className="relative w-full">
        {/* Sticky Video Background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-theme-base">
          <motion.video
            ref={videoRef}
            style={{ scale: videoScale, opacity: videoOpacity }}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={VIDEOS.hero.poster}
          >
            <source src={VIDEOS.hero.src} type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-theme-overlay backdrop-blur-[2px] transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-theme-base/80 via-theme-base/40 to-theme-base transition-colors duration-500" />
          
          {/* Floating accent blurs */}
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-ki-saffron/10 rounded-full blur-[140px] animate-float" />
          <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-ki-blue/10 rounded-full blur-[160px] animate-float-delayed" />
        </div>

        {/* Scrolling Content over Video */}
        <div className="relative z-10 -mt-[100vh]">
          {/* Hero Content Section */}
          <section className="min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4">
            <div className="max-w-7xl w-full mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Badge */}
                <div className="section-label mb-8 mx-auto w-fit bg-ki-dark/50 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-ki-saffron animate-pulse" />
                  National Sports Talent Discovery Initiative
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.08] text-white shadow-black/50 drop-shadow-lg">
                  Discover India's Next{' '}
                  <br className="hidden sm:block" />
                  <span className="gradient-text">Sporting Champions</span>
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md font-medium">
                  AI-powered biomechanical assessments that identify, evaluate, and nurture 
                  athletic talent from every corner of India — no expensive equipment required.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/assessment"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-ki-saffron to-ki-accent text-white font-semibold text-base shadow-lg shadow-ki-saffron/20 hover:shadow-xl hover:shadow-ki-saffron/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    Start Assessment
                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 text-white bg-white/5 backdrop-blur-md font-semibold text-base hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>

                {/* Trusted By strip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-20 pt-8 border-t border-white/10"
                >
                  <p className="text-xs text-gray-300 uppercase tracking-widest mb-4 font-semibold drop-shadow-md">Designed for integration with</p>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {partners.map(p => (
                      <span key={p} className="text-sm text-gray-200 font-medium whitespace-nowrap drop-shadow-md">{p}</span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <div className="w-5 h-9 rounded-full border-2 border-white/30 flex justify-center pt-2 bg-ki-dark/20 backdrop-blur-sm">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1 h-1 rounded-full bg-white"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Statistics Section - Scrolls over the video with glassmorphism */}
          <section className="py-24 bg-ki-dark/60 backdrop-blur-2xl border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <FadeInSection key={i} delay={i * 0.08}>
                    <div className="glass-card p-6 sm:p-8 text-center card-hover group bg-white/[0.03]">
                      <div className="text-3xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-lg">{stat.icon}</div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-ki-saffron mb-2 drop-shadow-md">
                        <Counter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-semibold tracking-wide uppercase">{stat.label}</div>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          WHY CHOOSE US (Solid Background)
         ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-ki-dark z-20" id="about">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection className="text-center mb-16">
            <span className="section-label mb-4 mx-auto w-fit block">Why SportsGauge</span>
            <h2 className="section-title mb-4">
              Technology That <span className="gradient-text">Levels the Playing Field</span>
            </h2>
            <p className="section-subtitle mx-auto">
              We combine computer vision, pose estimation, and biomechanical analysis to deliver 
              professional-grade athletic assessments accessible to everyone.
            </p>
          </FadeInSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <div className="glass-card p-7 sm:p-8 h-full card-hover group relative overflow-hidden bg-ki-dark-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ki-saffron/20 to-ki-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-ki-saffron/20">
                      <f.icon className="text-ki-saffron" size={26} />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-3 text-white">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">{f.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <HomeEcosystem />

      <section className="py-20 bg-ki-dark z-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-12">
            <span className="section-label mb-4 mx-auto w-fit block">How It Works</span>
            <h2 className="section-title mb-4">AI Assessment <span className="gradient-text">Explained</span></h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              Record four standard fitness tests on video. Our computer vision engine counts reps, measures jump height, and times sprints — then maps your profile to national benchmarks and recommended sports.
            </p>
          </FadeInSection>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Record', desc: 'Use your phone camera in a well-lit space. Follow on-screen guides for sit-ups, vertical jump, sprint, and shuttle run.' },
              { step: '02', title: 'Analyze', desc: 'MediaPipe pose estimation tracks 33 body landmarks. AI validates form and flags suspicious submissions.' },
              { step: '03', title: 'Discover', desc: 'Receive sport-fit recommendations, strengths, improvement areas, and a personalized training plan.' },
              { step: '04', title: 'Advance', desc: 'Appear on leaderboards, connect with coaches, and apply for events, scholarships, and academy programmes.' },
            ].map(s => (
              <div key={s.step} className="glass-card p-6 text-center">
                <span className="text-2xl font-display font-bold text-ki-saffron">{s.step}</span>
                <h3 className="font-semibold mt-3 mb-2">{s.title}</h3>
                <p className="text-xs text-theme-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-theme-base z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <span className="section-label mb-4 block w-fit">National Initiatives</span>
            <h2 className="text-3xl font-display font-bold mb-6">Government Sports <span className="gradient-text">Partnerships</span></h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-bold text-ki-saffron mb-2">Khelo India</h3>
                <p className="text-sm text-theme-secondary leading-relaxed">SportsGauge assessment reports are accepted as supplementary fitness documentation at multiple state nodal centres for Khelo India Youth Games trials and scholarship applications.</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-bold text-ki-saffron mb-2">Sports Authority of India</h3>
                <p className="text-sm text-theme-secondary leading-relaxed">SAI talent identification programmes use standardized metrics aligned with our four-test battery. Partner coaches upload cohort data to federation dashboards.</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-bold text-ki-saffron mb-2">Fit India & State Bodies</h3>
                <p className="text-sm text-theme-secondary leading-relaxed">State sports councils in 28 states run district camps with SportsGauge facilitators, connecting rural athletes directly to state trial shortlists.</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Athlete Showcase ── */}
      <section className="py-24 relative bg-theme-base z-20 overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-ki-saffron/10 -top-20 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <FadeInSection className="text-center mb-14">
            <span className="section-label mb-4 mx-auto w-fit block">Athlete Showcase</span>
            <h2 className="section-title mb-4">
              Elite Performers <span className="gradient-text">Discovered by AI</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Real training environments. Real biomechanical data. National-level talent surfaced from every district.
            </p>
          </FadeInSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ATHLETE_SHOWCASE.map((a, i) => (
              <StaggerItem key={i}>
                <div className="glass-card glow-border overflow-hidden card-hover group p-0">
                  <div className="relative aspect-[4/5] image-reveal">
                    <LazyImage src={a.img} alt={a.name} seed={a.seed} className="group-hover:scale-110 transition-transform duration-700" wrapperClassName="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <span className="badge badge-saffron mb-2">{a.metric}</span>
                      <h3 className="font-display font-bold text-lg text-theme">{a.name}</h3>
                      <p className="text-sm text-theme-muted">{a.sport}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Sports Gallery ── */}
      <section className="py-20 bg-theme-elevated/50 z-20 border-y border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-10">
            <span className="section-label mb-3 block w-fit">Visual Gallery</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Performance in Motion</h2>
          </FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.05}>
                <div className={`image-reveal rounded-2xl overflow-hidden relative group ${i === 0 ? 'md:row-span-2 md:col-span-1 aspect-square md:aspect-auto md:min-h-[320px]' : 'aspect-[4/3]'}`}>
                  <LazyImage src={item.src} alt={item.alt} seed={item.seed} wrapperClassName="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-base/90 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-wider text-ki-saffron">{item.tag}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED SPORTS
         ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-theme-base z-20" id="programs">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ki-dark-2/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <span className="section-label mb-4 mx-auto w-fit block">Sports Categories</span>
            <h2 className="section-title mb-4">
              Assessments Across <span className="gradient-text">Every Discipline</span>
            </h2>
            <p className="section-subtitle mx-auto">
              From track and field to team sports — our AI models are trained to evaluate 
              performance across India's most popular sporting disciplines.
            </p>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {sports.map((sport, i) => (
              <StaggerItem key={i}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3] ring-1 ring-theme hover:ring-ki-saffron/50 transition-all duration-500 glow-border">
                  <LazyImage
                    src={sport.img}
                    alt={sport.name}
                    seed={`sport-${sport.name}`}
                    className="transition-transform duration-700 group-hover:scale-110"
                    wrapperClassName="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ki-dark/95 via-ki-dark/40 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-20 transition-opacity duration-600`} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${sport.color} flex items-center justify-center shadow-lg shadow-black/50`}>
                        <sport.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <span className="text-lg sm:text-xl font-display font-bold block leading-tight text-white">{sport.name}</span>
                        <span className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{sport.tagline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SUCCESS STORIES CAROUSEL
         ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-ki-dark z-20" id="success">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="section-label mb-4 mx-auto w-fit block">Success Stories</span>
            <h2 className="section-title mb-4">
              Transforming Lives Through <span className="gradient-text">Sports</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Real athletes, real results. See how SportsGauge is helping identify and develop 
              talent from every corner of India.
            </p>
          </FadeInSection>

          {/* Carousel */}
          <FadeInSection>
            <div className="relative max-w-4xl mx-auto">
              {/* Testimonial Card */}
              <div className="glass-card-strong p-8 sm:p-12 relative overflow-hidden min-h-[300px] border-white/10 bg-white/[0.02]">
                <div className="absolute top-6 right-8 text-8xl font-display text-white/[0.02] leading-none select-none">"</div>
                <div className="absolute inset-0 bg-gradient-to-br from-ki-saffron/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex gap-1.5 mb-6">
                    {[1,2,3,4,5].map(s => (
                      <HiStar key={s} className="w-5 h-5 text-ki-saffron drop-shadow-md" />
                    ))}
                  </div>

                  <motion.p
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10 italic max-w-3xl font-medium"
                  >
                    "{testimonials[activeTestimonial].quote}"
                  </motion.p>

                  <motion.div
                    key={`author-${activeTestimonial}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-center justify-between flex-wrap gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-ki-saffron shadow-lg">
                        <img src={testimonials[activeTestimonial].photo} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-white text-lg">{testimonials[activeTestimonial].name}</div>
                        <div className="text-sm text-ki-saffron font-medium">{testimonials[activeTestimonial].state} · {testimonials[activeTestimonial].sport}</div>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold shadow-lg shadow-emerald-500/10">
                      {testimonials[activeTestimonial].improvement}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.08] transition-all"
                >
                  <HiChevronLeft size={20} />
                </button>
                <div className="flex gap-3">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { clearInterval(testimonialTimer.current); setActiveTestimonial(i); }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === activeTestimonial ? 'w-10 bg-ki-saffron shadow-[0_0_10px_rgba(255,153,51,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.08] transition-all"
                >
                  <HiChevronRight size={20} />
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
         ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-ki-dark overflow-hidden z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ki-dark-2/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="section-label mb-4 mx-auto w-fit block">How It Works</span>
            <h2 className="section-title mb-4">
              Three Steps to <span className="gradient-text">Your Assessment</span>
            </h2>
          </FadeInSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-ki-saffron/30 to-transparent -translate-y-1/2 z-0" />
            
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Register with your basic details, sports interest, and physical measurements. Our platform builds a personalized athlete profile in under two minutes.', icon: '📝' },
              { step: '02', title: 'Record Your Performance', desc: 'Use your smartphone camera to record yourself performing standardized fitness tests — sit-ups, vertical jumps, sprints, and shuttle runs.', icon: '📹' },
              { step: '03', title: 'Get AI Analysis', desc: 'Our AI engine analyzes your form, counts reps, measures heights, and grades your performance against national benchmarks for your age group.', icon: '📊' },
            ].map((item, i) => (
              <StaggerItem key={i} className="z-10">
                <div className="glass-card p-8 sm:p-10 h-full card-hover group relative text-center bg-ki-dark border-white/10">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-ki-dark-3 border border-white/10 flex items-center justify-center text-4xl mb-6 shadow-xl shadow-black/50 group-hover:-translate-y-2 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <div className="text-xs font-display font-bold text-ki-saffron tracking-widest mb-3">STEP {item.step}</div>
                  <h3 className="text-xl font-display font-semibold mb-4 text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA
         ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-ki-dark z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-ki-dark via-ki-blue/15 to-ki-dark" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ki-saffron/[0.05] rounded-full blur-[180px]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Ready to Discover Your <span className="gradient-text">True Potential?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium">
              Join thousands of athletes across India who have already taken the first step 
              towards their sporting dreams. All you need is a camera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-ki-saffron to-ki-accent text-white font-semibold text-lg shadow-lg shadow-ki-saffron/30 hover:shadow-xl hover:shadow-ki-saffron/50 hover:-translate-y-1 transition-all duration-300"
              >
                Create Free Account
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      <div className="relative z-20 bg-ki-dark">
        <Footer />
      </div>
    </div>
  );
}
