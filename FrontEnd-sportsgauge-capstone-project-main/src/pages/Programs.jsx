import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoBackground, { VideoHeroContent } from '../components/VideoBackground';
import LazyImage from '../components/LazyImage';
import { FadeInSection, StaggerContainer, StaggerItem, Counter } from '../components/Motion';
import { VIDEOS, PROGRAM_IMAGES } from '../constants/media';
import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineGlobeAlt, HiOutlineLightningBolt, HiCheck, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const programs = [
  {
    id: 'talent-discovery',
    icon: HiOutlineAcademicCap,
    title: 'Talent Discovery Program',
    tagline: 'Find Your Sport',
    color: 'from-orange-500 to-amber-500',
    colorBg: 'from-orange-500/10 to-amber-500/5',
    description: 'A nationwide initiative designed to identify raw sporting talent in young athletes aged 10–18. Using AI-powered fitness assessments, we evaluate fundamental athletic abilities — speed, strength, agility, and endurance — to recommend the most suitable sport for each individual.',
    eligibility: [
      'Age group: 10 to 18 years',
      'Open to all Indian citizens',
      'No prior sports background required',
      'Must have access to a smartphone camera',
    ],
    benefits: [
      'Free AI-powered fitness assessment',
      'Personalized sport recommendation report',
      'Referral to district-level sports authorities',
      'Access to online training resources',
      'Certificate of assessment completion',
    ],
    objectives: [
      'Identify athletic potential in youth aged 10–18 using objective AI metrics',
      'Reduce selection bias in grassroots talent identification',
      'Map athletes to sports matching their biomechanical strengths',
      'Create a national database of pre-elite talent for federation review',
    ],
    selectionProcess: [
      'Register on SportsGauge and complete profile verification',
      'Complete all four core assessments with Valid status',
      'Receive AI sport-fit report and district percentile rankings',
      'Top performers referred to state nodal officers for trial invitations',
    ],
  },
  {
    id: 'youth-development',
    icon: HiOutlineUserGroup,
    title: 'Youth Athlete Development',
    tagline: 'Nurture Champions',
    color: 'from-blue-500 to-cyan-500',
    colorBg: 'from-blue-500/10 to-cyan-500/5',
    description: 'Designed for athletes who have completed the Talent Discovery assessment and shown exceptional promise. This program provides structured training pathways, periodic re-assessments, and connects athletes with certified coaches for ongoing mentorship.',
    criteria: [
      'Must have completed Talent Discovery assessment',
      'Minimum performance score of 70/100 in any test',
      'Recommendation from district sports officer (preferred)',
      'Commitment to quarterly re-assessments',
    ],
    benefits: [
      'Monthly progress tracking via AI assessments',
      'Connection with SAI-certified coaches',
      'Performance comparison against state benchmarks',
      'Priority access to state-level trials',
      'Access to advanced biomechanical analysis',
    ],
    objectives: [
      'Provide structured development pathways for identified talent',
      'Enable quarterly re-assessment to measure training effectiveness',
      'Connect athletes with verified coaches in their sport and region',
    ],
    trainingSupport: [
      'Personalized training plans from AI assessment history',
      'Coach messaging and progress review sessions',
      'Nutrition and recovery guidelines from SportsGauge resources',
      'Priority registration for partner academy summer camps',
    ],
    assessmentStructure: [
      'Baseline battery within 14 days of enrollment',
      'Monthly mini-assessments (two tests rotating)',
      'Full quarterly re-test of all four assessments',
      'Annual composite report for federation submission',
    ],
  },
  {
    id: 'rural-outreach',
    icon: HiOutlineGlobeAlt,
    title: 'Rural Sports Outreach',
    tagline: 'Bridging the Gap',
    color: 'from-emerald-500 to-teal-500',
    colorBg: 'from-emerald-500/10 to-teal-500/5',
    description: 'Focused on reaching underserved communities in rural and semi-urban India where access to professional sports infrastructure is minimal. We partner with schools, panchayats, and community organizations to conduct mobile assessment camps using our smartphone-based platform.',
    goals: [
      'Conduct assessments in 10,000+ rural locations by 2027',
      'Partner with 500+ rural schools and community centers',
      'Train 1,000 local volunteers as assessment facilitators',
      'Identify 50,000 previously unnoticed athletes annually',
    ],
    benefits: [
      'No cost to participants',
      'On-site assessment with trained facilitators',
      'Equipment-free — uses only smartphone cameras',
      'Reports delivered in local language',
      'Direct pipeline to state sports authorities',
    ],
    purpose: 'Deliver world-class sports assessment infrastructure to rural and semi-urban communities where professional coaching and laboratory testing are unavailable.',
    impact: 'Over 18,000 rural athletes assessed in 2025–26 pilot phases across Bihar, Jharkhand, Rajasthan, and northeastern states, with 2,400+ referrals to district programmes.',
  },
  {
    id: 'high-performance',
    icon: HiOutlineLightningBolt,
    title: 'High Performance Program',
    tagline: 'Elite Level',
    color: 'from-purple-500 to-violet-500',
    colorBg: 'from-purple-500/10 to-violet-500/5',
    description: 'An invitation-only program for athletes who demonstrate national-level potential. Selected athletes receive advanced biomechanical analysis, personalized training programs designed by sports scientists, and direct exposure to national selectors and elite training centers.',
    criteria: [
      'Top 5% performers in SportsGauge assessments',
      'Recommendation from state sports authority or SAI coach',
      'Consistent performance across minimum 3 assessments',
      'Age group: 14 to 25 years',
    ],
    benefits: [
      'Advanced 3D biomechanical analysis',
      'Personalized training program by sports scientists',
      'Exposure to national selectors and scouts',
      'Scholarship recommendations for elite academies',
      'Quarterly performance review with expert panel',
      'Priority consideration for Khelo India scholarships',
    ],
    eligibility: [
      'Top 5% composite score nationally or top 1% in state',
      'Minimum three validated assessment cycles',
      'Age 14–25 with federation or SAI coach endorsement',
    ],
    performanceStandards: [
      'Sit-up normalized score ≥ 0.70',
      'Vertical jump normalized score ≥ 0.75',
      'Sprint and shuttle scores in top national decile for age group',
    ],
    opportunities: [
      'National camp trials and selector showcases',
      'Elite academy scholarship nominations',
      'Sports science internship and mentorship access',
    ],
  },
];

export default function Programs() {
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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

      <VideoBackground src={VIDEOS.programs.src} poster={VIDEOS.programs.poster} minHeight="min-h-[80vh]">
        <VideoHeroContent>
          <span className="section-label mb-6 block w-fit">Our Programs</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight max-w-4xl">
            Structured Pathways to{' '}
            <span className="gradient-text">Sporting Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-theme-secondary leading-relaxed max-w-2xl font-medium">
            From first-time assessments to elite-level analysis — programs for every stage of the athlete journey.
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
            <source src="https://cdn.coverr.co/videos/coverr-basketball-practice-1667/1080p.mp4" type="video/mp4" />
          </motion.video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-ki-dark/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ki-dark via-transparent to-ki-dark" />
        </div>

        <div className="relative z-10 -mt-[100vh]">
          <section className="h-screen flex flex-col justify-center items-center px-4">
            <FadeInSection className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-10 leading-tight drop-shadow-xl">
                Our Programs Reach Athletes Across <span className="gradient-text">Urban and Rural India</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
                <div className="glass-card-strong p-6 text-center min-w-[160px] bg-white/5 backdrop-blur-xl border-white/20">
                  <div className="text-4xl font-display font-bold text-ki-saffron mb-2"><Counter end={4} suffix="+" /></div>
                  <div className="text-sm font-semibold text-white uppercase tracking-wider">Core Programs</div>
                </div>
                <div className="glass-card-strong p-6 text-center min-w-[160px] bg-white/5 backdrop-blur-xl border-white/20">
                  <div className="text-4xl font-display font-bold text-emerald-400 mb-2"><Counter end={100} suffix="%" /></div>
                  <div className="text-sm font-semibold text-white uppercase tracking-wider">Free Access</div>
                </div>
                <div className="glass-card-strong p-6 text-center min-w-[160px] bg-white/5 backdrop-blur-xl border-white/20">
                  <div className="text-4xl font-display font-bold text-blue-400 mb-2"><Counter end={50} suffix="k+" /></div>
                  <div className="text-sm font-semibold text-white uppercase tracking-wider">Annual Reach</div>
                </div>
              </div>
            </FadeInSection>
          </section>
        </div>
      </div>

      {/* ── Overview Cards ── */}
      <section className="py-12 relative bg-ki-dark z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((p, i) => (
              <StaggerItem key={i}>
                <a
                  href={`#${p.id}`}
                  className="glass-card p-6 block card-hover group text-center bg-ki-dark-2 border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.colorBg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                    <p.icon className="text-ki-saffron drop-shadow-md" size={26} />
                  </div>
                  <h3 className="text-base font-display font-bold mb-1 text-white">{p.title}</h3>
                  <p className="text-xs text-ki-saffron font-medium">{p.tagline}</p>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Detailed Program Sections ── */}
      <div className="relative bg-ki-dark z-20">
        {programs.map((program, i) => (
          <section key={i} id={program.id} className="py-24 relative scroll-mt-20">
            {i % 2 === 1 && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ki-dark-2/40 to-transparent" />
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left — Info */}
                <FadeInSection className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-5 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-lg shadow-black/30 border border-white/10`}>
                      <program.icon className="text-white drop-shadow-md" size={30} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold text-white">{program.title}</h2>
                      <span className="text-base font-semibold text-ki-saffron">{program.tagline}</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed mb-10 font-medium">
                    {program.description}
                  </p>

                  {program.purpose && (
                    <p className="text-base text-gray-400 leading-relaxed mb-6"><strong className="text-white">Purpose:</strong> {program.purpose}</p>
                  )}
                  {program.impact && (
                    <p className="text-base text-gray-400 leading-relaxed mb-8"><strong className="text-white">Impact:</strong> {program.impact}</p>
                  )}

                  {program.objectives && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Objectives</h3>
                      <div className="space-y-3">
                        {program.objectives.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.selectionProcess && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Selection Process</h3>
                      <div className="space-y-3">
                        {program.selectionProcess.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.trainingSupport && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Training Support</h3>
                      <div className="space-y-3">
                        {program.trainingSupport.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.assessmentStructure && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Assessment Structure</h3>
                      <div className="space-y-3">
                        {program.assessmentStructure.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.performanceStandards && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Performance Standards</h3>
                      <div className="space-y-3">
                        {program.performanceStandards.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.opportunities && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Opportunities</h3>
                      <div className="space-y-3">
                        {program.opportunities.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <HiCheck className="w-5 h-5 text-ki-saffron shrink-0 mt-0.5" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eligibility or Criteria */}
                  {(program.eligibility || program.criteria) && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">
                        {program.eligibility ? 'Eligibility Requirements' : program.goals ? 'Strategic Goals' : 'Selection Criteria'}
                      </h3>
                      <div className="space-y-3">
                        {(program.eligibility || program.criteria || program.goals).map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                              <HiCheck className="w-4 h-4 text-ki-saffron" />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.goals && (
                    <div className="mb-10">
                      <h3 className="text-sm font-display font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-2">Strategic Goals</h3>
                      <div className="space-y-3">
                        {program.goals.map((item, j) => (
                          <div key={j} className="flex items-start gap-4 text-base text-gray-300 font-medium">
                            <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                              <HiCheck className="w-4 h-4 text-ki-saffron" />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FadeInSection>

                {/* Right — Benefits Card */}
                <FadeInSection delay={0.15} className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/10] image-reveal glow-border">
                    <LazyImage
                      src={PROGRAM_IMAGES[program.id] || IMAGES.training}
                      alt={program.title}
                      seed={program.id}
                      wrapperClassName="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="glass-card-strong p-8 sm:p-10 relative overflow-hidden shadow-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${program.colorBg} opacity-60 pointer-events-none`} />
                    <div className="relative z-10">
                      <h3 className="text-sm font-display font-bold text-white mb-6 uppercase tracking-widest">
                        Program Benefits
                      </h3>
                      <div className="space-y-4">
                        {program.benefits.map((benefit, j) => (
                          <div key={j} className="flex items-start gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${program.color} flex items-center justify-center shrink-0 shadow-md`}>
                              <HiCheck className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base text-gray-200 font-medium leading-tight pt-1">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/register"
                        className={`mt-10 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r ${program.color} text-base font-bold text-white shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full`}
                      >
                        Apply Now <HiArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-ki-dark z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-ki-dark via-ki-blue/15 to-ki-dark" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ki-saffron/[0.05] rounded-full blur-[180px]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Not Sure Which Program is <span className="gradient-text">Right for You?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium">
              Start with a free Talent Discovery assessment. Our AI will analyze your performance 
              and recommend the best program based on your athletic profile.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-ki-saffron to-ki-accent text-white font-bold text-lg shadow-lg shadow-ki-saffron/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Free Assessment <HiArrowRight className="w-5 h-5" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      <div className="relative z-20 bg-ki-dark">
        <Footer />
      </div>
    </motion.div>
  );
}
