import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useCoach } from '../context/CoachContext.jsx';
import UserAvatar from './UserAvatar.jsx';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiChevronDown, HiBell } from 'react-icons/hi';
import { commsApi } from '../utils/commsApi.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const { coach, logoutCoach, token: coachToken } = useCoach();
  const [unread, setUnread] = useState(0);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const [exploreOpen, setExploreOpen] = useState(false);
  const authToken = coach?.coach_id ? coachToken : (localStorage.getItem('sportsgauge_token') || '');

  useEffect(() => {
    if (!(user?.id || coach?.coach_id) || !authToken) {
      setUnread(0);
      return;
    }
    commsApi.unreadCount(authToken).then((d) => setUnread(d.unread || 0)).catch(() => setUnread(0));
  }, [user?.id, coach?.coach_id, authToken]);

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/stories', label: 'Success Stories' },
  ];

  const ecosystemLinks = [
    { to: '/coaches', label: 'Coaches' },
    { to: '/news', label: 'News' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/talent', label: 'Talent' },
    { to: '/events', label: 'Events' },
    { to: '/academies', label: 'Academies' },
    { to: '/scholarships', label: 'Scholarships' },
    { to: '/faq', label: 'FAQ' },
    { to: '/resources', label: 'Resources' },
  ];

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/messages', label: 'Messages' },
    { to: '/profile', label: 'Profile' },
  ];

  const navLinks = user?.id ? authLinks : publicLinks;
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-theme-nav backdrop-blur-2xl border-b border-theme-nav shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            <Logo size="nav" asLink className="group-hover:scale-[1.02] transition-transform duration-300" />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              <div className="relative" onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)}>
                <button
                  type="button"
                  className={`relative px-4 py-2 rounded-lg text-[13px] font-medium tracking-wide flex items-center gap-1 ${
                    ecosystemLinks.some(l => isActive(l.to)) ? 'text-theme' : 'text-theme-muted hover:text-theme'
                  }`}
                >
                  Explore <HiChevronDown className={`w-4 h-4 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {exploreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1 w-52 py-2 rounded-xl glass-card-strong border border-theme shadow-xl z-50"
                    >
                      {ecosystemLinks.map(l => (
                        <Link key={l.to} to={l.to} className="block px-4 py-2.5 text-sm text-theme-secondary hover:text-ki-saffron hover:bg-theme-elevated/50">
                          {l.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-300 ${
                    isActive(link.to)
                      ? 'text-theme'
                      : 'text-theme-muted hover:text-theme hover:bg-theme-elevated/50'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-ki-saffron to-ki-accent rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              {(user?.id || coach?.coach_id) && (
                <Link to="/notifications" className="relative p-2.5 rounded-xl border border-theme hover:border-ki-saffron/30">
                  <HiBell className="text-theme-muted" size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ki-saffron text-black text-[10px] font-bold flex items-center justify-center">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </Link>
              )}
              {coach?.coach_id ? (
                <div className="flex items-center gap-2">
                  <Link to="/coach/dashboard" className="px-4 py-2 rounded-lg text-[13px] font-medium text-ki-saffron border border-ki-saffron/30 hover:bg-ki-saffron/10">
                    Coach Dashboard
                  </Link>
                  <button onClick={() => { logoutCoach(); navigate('/coaches'); }} className="text-[13px] text-theme-muted hover:text-red-400">Log out</button>
                </div>
              ) : user?.id ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full glass-card py-1.5 hover:border-ki-saffron/30 transition-all duration-300"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm font-medium text-theme-secondary max-w-[100px] truncate">
                      {user.full_name || 'Athlete'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-red-400 transition-colors duration-300"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link to="/coaches/login" className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-theme-muted border border-theme hover:border-ki-saffron/30">
                    Coach Login
                  </Link>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-theme-muted hover:text-theme border border-theme hover:border-ki-saffron/30 hover:bg-theme-elevated/50 transition-all duration-300"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-ki-saffron to-ki-accent shadow-lg shadow-ki-saffron/15 hover:shadow-ki-saffron/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl text-theme-muted hover:text-theme hover:bg-theme-elevated/50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.2}}>
                    <HiX size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.2}}>
                    <HiMenuAlt3 size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 h-full w-[280px] bg-theme-nav backdrop-blur-2xl border-l border-theme flex flex-col"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/[0.04]">
                <Logo size="sm" asLink className="max-w-[140px]" />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <HiX size={18} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500">Ecosystem</p>
                {ecosystemLinks.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link to={link.to} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${isActive(link.to) ? 'text-ki-saffron bg-ki-saffron/[0.08]' : 'text-gray-400 hover:text-white'}`}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <p className="px-4 py-2 mt-2 text-[10px] uppercase tracking-wider text-gray-500">Menu</p>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive(link.to)
                          ? 'text-ki-saffron bg-ki-saffron/[0.08]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {isActive(link.to) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-ki-saffron" />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Bottom Actions */}
              <div className="p-4 border-t border-white/[0.04] space-y-2">
                {!user?.id ? (
                  <>
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 rounded-xl text-center text-sm font-medium text-gray-300 border border-white/[0.08] hover:border-white/[0.15] transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-3 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-ki-saffron to-ki-accent"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 border border-white/[0.08] hover:border-white/[0.15] transition-all"
                    >
                      <UserAvatar user={user} size="sm" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 rounded-xl text-center text-sm font-medium text-red-400/70 hover:text-red-400 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
