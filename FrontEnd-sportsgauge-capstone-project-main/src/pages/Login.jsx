import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { API_BASE, fetchUser } from '../utils/api.js';
import { useToast } from '../components/Toast.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        const profileData = await fetchUser(data.user_id);
        setUser({ ...profileData, role: data.role }, data.access_token);
        showToast('Welcome back!', 'success');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Unable to connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Firebase Google Authentication Provider
    // const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider)
    console.log("Google Login clicked");
    setError("Google Login is configured for Firebase Auth. Connect your Firebase project to enable.");
  };

  const handleForgotPassword = async () => {
    const email = (formData.email || '').trim();
    if (!email) {
      setError('Enter your email first, then click Forgot password.');
      return;
    }
    setResetLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/password/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || 'Unable to process request');
      }
      showToast('Password reset request submitted. Check your email.', 'success');
    } catch (e) {
      setError(e.message || 'Unable to connect to server. Please ensure the backend is running.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen">
      {/* ── Left: Visual Panel (Video/Image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Dynamic Video Background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=1600&fit=crop&q=80"
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-man-lifting-a-barbell-2554/1080p.mp4" type="video/mp4" />
        </video>
        
        {/* Gradients and Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-ki-dark/60 via-ki-dark/40 to-ki-dark" />
        <div className="absolute inset-0 bg-gradient-to-t from-ki-dark via-transparent to-ki-dark/50" />
        
        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-ki-saffron/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-32 right-16 w-64 h-64 bg-ki-blue/20 rounded-full blur-[120px] animate-float-delayed" />
        
        <div className="relative z-10 flex flex-col justify-end p-14 h-full">
          <Logo size="auth" asLink className="absolute top-12 left-14" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 text-sm font-medium text-white shadow-xl">
              Platform Access
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-5 leading-tight">
              Welcome back,<br />
              <span className="gradient-text">Champion.</span>
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-md">
              Access your dashboard, review AI-powered performance analytics, and continue 
              your journey towards sporting excellence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-ki-dark-2/40 to-transparent lg:hidden" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <Logo size="auth" asLink className="mb-10 lg:hidden mx-auto justify-center flex" />

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Sign in</h1>
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-ki-saffron hover:text-orange-400 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 overflow-hidden"
              >
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-500" size={18} />
                </div>
                <input
                  type="email" name="email" required
                  onChange={handleChange} value={formData.email}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-400 font-medium">Password</label>
                <button type="button" onClick={handleForgotPassword} disabled={resetLoading} className="text-xs text-ki-saffron hover:text-orange-400 transition-colors font-medium disabled:opacity-60">
                  {resetLoading ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-500" size={18} />
                </div>
                <input
                  type="password" name="password" required
                  onChange={handleChange} value={formData.password}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <HiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Social Login Section */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:shadow-black/20"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="mt-10 text-center text-xs text-gray-600 leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}