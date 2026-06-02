import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: 'About Us', to: '/about' },
      { label: 'Programs', to: '/programs' },
      { label: 'Success Stories', to: '/stories' },
      { label: 'Assessment Portal', to: '/login' },
    ],
    Ecosystem: [
      { label: 'Coaches Portal', to: '/coaches' },
      { label: 'Sports News', to: '/news' },
      { label: 'Leaderboard', to: '/leaderboard' },
      { label: 'Talent Discovery', to: '/talent' },
      { label: 'Events', to: '/events' },
      { label: 'Academies', to: '/academies' },
      { label: 'Scholarships', to: '/scholarships' },
    ],
    Resources: [
      { label: 'Resource Library', to: '/resources' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Coach Registration', to: '/coaches/register' },
      { label: 'For Athletes', to: '/register' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Terms of Service', to: '/legal/terms' },
      { label: 'Data Protection', to: '/legal/data-protection' },
      { label: 'Cookie Policy', to: '/legal/cookies' },
    ],
  };

  const socialLinks = [
    { icon: FaXTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-ki-dark border-t border-white/[0.04]">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ki-saffron/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter CTA */}
        <div className="py-12 border-b border-white/[0.04]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-display font-semibold text-white mb-1">Stay updated with SportsGauge</h3>
              <p className="text-sm text-gray-500">Get the latest news on programs, assessments, and athlete success stories.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-ki-saffron/40 transition-colors"
              />
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ki-saffron to-ki-accent text-sm font-semibold text-white hover:shadow-lg hover:shadow-ki-saffron/20 transition-all duration-300 shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="footer" asLink className="mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              India's premier AI-powered sports talent assessment platform. Identifying, evaluating, and nurturing 
              the next generation of sporting champions through cutting-edge technology.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:contact@sportsgauge.in" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                <HiOutlineMail size={15} className="text-ki-saffron/60" />
                contact@sportsgauge.in
              </a>
              <a href="tel:+911800123456" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                <HiOutlinePhone size={15} className="text-ki-saffron/60" />
                1800-123-4567 (Toll Free)
              </a>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <HiOutlineLocationMarker size={15} className="text-ki-saffron/60 shrink-0" />
                New Delhi, India
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-ki-saffron hover:border-ki-saffron/20 hover:bg-ki-saffron/[0.06] transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[13px] font-semibold text-white mb-4 tracking-wider uppercase">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {currentYear} SportsGauge Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Built with</span>
            <span className="text-ki-saffron mx-0.5">♦</span>
            <span>for Indian Sports</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
