import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { API_BASE, fetchUser } from '../utils/api.js';
import { useToast } from '../components/Toast.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck, HiUser, HiAcademicCap, HiScale, HiLockClosed, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import Logo from '../components/Logo.jsx';

const steps = [
  { id: 1, title: 'Personal', icon: HiUser },
  { id: 2, title: 'Sports', icon: HiAcademicCap },
  { id: 3, title: 'Physical', icon: HiScale },
  { id: 4, title: 'Security', icon: HiLockClosed },
];

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];
const SPORTS = ['Athletics','Football','Cricket','Basketball','Volleyball','Kabaddi','Gymnastics','Weightlifting','Wrestling','Swimming','Boxing','Badminton'];

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: 'Male', mobile_number: '',
    email: '', password: '', confirmPassword: '',
    state: '', district: '', sports_interest: 'Athletics',
    height: '', weight: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Password validation
  const pw = formData.password;
  const pwChecks = [
    { label: 'Uppercase Letter', ok: /[A-Z]/.test(pw) },
    { label: 'Lowercase Letter', ok: /[a-z]/.test(pw) },
    { label: 'Number', ok: /\d/.test(pw) },
    { label: 'Special Character', ok: /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    { label: 'Minimum 8 Characters', ok: pw.length >= 8 },
  ];
  const pwScore = pwChecks.filter(c => c.ok).length;
  
  let pwStrength = 'Weak';
  let pwColor = 'bg-red-500';
  let pwTextColor = 'text-red-400';
  
  if (pwScore === 5) {
    pwStrength = 'Strong';
    pwColor = 'bg-green-500';
    pwTextColor = 'text-green-400';
  } else if (pwScore >= 3) {
    pwStrength = 'Medium';
    pwColor = 'bg-amber-500';
    pwTextColor = 'text-amber-400';
  }

  const canNext = () => {
    if (step === 1) return formData.full_name && formData.age && formData.mobile_number && formData.state && formData.district;
    if (step === 2) return formData.sports_interest;
    if (step === 3) return formData.height && formData.weight;
    if (step === 4) return formData.email && pwScore === 5 && formData.password === formData.confirmPassword;
    return false;
  };

  const handleSubmit = async () => {
    if (pwScore < 5) { setError('Password is not strong enough. Please meet all criteria.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        const profileData = await fetchUser(data.user_id);
        setUser(profileData);
        showToast('Registration successful!', 'success');
        navigate('/dashboard');
      } else {
        setError(data.error || data.message || 'Registration failed');
      }
    } catch { setError('Unable to connect. Ensure backend is running.'); }
    finally { setLoading(false); }
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };
  const [direction, setDirection] = useState(1);

  const goNext = () => { if (canNext()) { setDirection(1); setStep(s => s + 1); } };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  return (
    <div className="page-shell flex min-h-screen">
      {/* ── Left Visual Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=1600&fit=crop&q=80" alt="Sports Training" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-ki-dark/60 via-ki-dark/30 to-ki-dark" />
        <div className="absolute inset-0 bg-gradient-to-t from-ki-dark via-transparent to-ki-dark/50" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-ki-saffron/15 rounded-full blur-[100px] animate-float" />
        
        <div className="relative z-10 flex flex-col justify-between p-14 h-full">
          <Logo size="auth" asLink />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-5 leading-tight">
              Begin Your<br /><span className="gradient-text">Athletic Journey</span>
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Create your athlete profile and get access to AI-powered assessments, 
              personalized training insights, and nationwide talent benchmarking.
            </p>
            
            {/* Testimonials snippet */}
            <div className="mt-10 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md max-w-sm relative">
              <div className="absolute -top-3 -left-3 text-4xl text-ki-saffron/40 font-display">"</div>
              <p className="text-sm text-gray-300 italic relative z-10 leading-relaxed mb-3">
                SportsGauge gave me the data I needed to prove my potential. Now I'm training with the state team.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-ki-saffron flex items-center justify-center text-[10px] font-bold text-white">RK</div>
                <span className="text-xs text-gray-400 font-medium">Rohit Kumar, Bihar</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Form Area ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative h-screen overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-ki-dark-2/40 to-transparent lg:hidden" />
        
        <div className="w-full max-w-xl relative z-10 py-10">
          <Logo size="auth" asLink className="mb-10 lg:hidden mx-auto flex justify-center" />

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
            <p className="text-sm text-gray-400">
              Already registered?{' '}
              <Link to="/login" className="text-ki-saffron hover:text-orange-400 font-medium transition-colors">Sign in</Link>
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 relative z-10 ${
                    step > s.id 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : step === s.id 
                        ? 'bg-gradient-to-br from-ki-saffron to-ki-accent text-white shadow-lg shadow-ki-saffron/20 ring-4 ring-ki-saffron/10' 
                        : 'bg-ki-dark-3 text-gray-500 border border-white/10'
                  }`}>
                    {step > s.id ? <HiCheck size={18} /> : <s.icon size={18} />}
                  </div>
                  <span className={`text-[11px] mt-2 font-medium absolute -bottom-5 whitespace-nowrap transition-colors duration-300 ${step >= s.id ? 'text-gray-300' : 'text-gray-600'}`}>
                    {s.title}
                  </span>
                  
                  {/* Connecting Line */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-5 left-[50%] w-full h-[2px] -z-10">
                      <div className="w-full h-full bg-white/[0.04]" />
                      <motion.div 
                        className="absolute inset-0 bg-emerald-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > s.id ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-4" /> {/* Spacer for labels */}

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 overflow-hidden"
              >
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Full Name <span className="text-ki-saffron">*</span></label>
                      <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="input-field" placeholder="Enter your full name as per Govt. ID" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Age <span className="text-ki-saffron">*</span></label>
                        <input type="number" name="age" required value={formData.age} onChange={handleChange} className="input-field" placeholder="e.g. 18" min="8" max="60" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Gender <span className="text-ki-saffron">*</span></label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field appearance-none">
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Mobile Number <span className="text-ki-saffron">*</span></label>
                      <input type="tel" name="mobile_number" required value={formData.mobile_number} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">State <span className="text-ki-saffron">*</span></label>
                        <select name="state" value={formData.state} onChange={handleChange} className="input-field appearance-none">
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">District <span className="text-ki-saffron">*</span></label>
                        <input type="text" name="district" required value={formData.district} onChange={handleChange} className="input-field" placeholder="Your district" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Primary Sports Interest <span className="text-ki-saffron">*</span></label>
                      <select name="sports_interest" value={formData.sports_interest} onChange={handleChange} className="input-field appearance-none text-base">
                        {SPORTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="glass-card p-6 mt-6">
                      <h3 className="text-sm font-semibold mb-4 text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ki-green" />
                        Assessments Available for {formData.sports_interest}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['Sit Ups (Strength)','Vertical Jump (Power)','Shuttle Run (Agility)','Sprint (Speed)'].map(t => (
                          <div key={t} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-gray-300">
                            <HiCheck className="text-emerald-500 shrink-0" size={14} />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Height (cm) <span className="text-ki-saffron">*</span></label>
                        <input type="number" name="height" required value={formData.height} onChange={handleChange} className="input-field" placeholder="170" min="100" max="250" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Weight (kg) <span className="text-ki-saffron">*</span></label>
                        <input type="number" name="weight" required value={formData.weight} onChange={handleChange} className="input-field" placeholder="70" min="20" max="200" />
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {formData.height && formData.weight && (
                        <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="overflow-hidden">
                          <div className="glass-card p-6 mt-2">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium text-gray-300">Estimated Body Mass Index (BMI)</span>
                              <span className="text-3xl font-display font-bold text-ki-saffron">
                                {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                              </span>
                            </div>
                            
                            {/* BMI Scale */}
                            <div className="relative pt-2">
                              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>Underweight</span><span className="ml-4">Normal</span><span>Overweight</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                                <div className="h-full w-1/3 bg-blue-400" />
                                <div className="h-full w-1/3 bg-emerald-400" />
                                <div className="h-full w-1/3 bg-red-400" />
                              </div>
                              {/* Indicator Marker */}
                              <div 
                                className="absolute top-6 -ml-1 w-2 h-4 bg-white rounded-full shadow border border-gray-300 transition-all duration-500" 
                                style={{
                                  left: `${Math.max(0, Math.min(100, ((formData.weight / Math.pow(formData.height / 100, 2)) - 15) / 20 * 100))}%`
                                }} 
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-4 italic">
                              *BMI is a general indicator. Final assessment relies on dynamic performance tests.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address <span className="text-ki-saffron">*</span></label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Create Password <span className="text-ki-saffron">*</span></label>
                      <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input-field" placeholder="Create a strong password" />
                      
                      <AnimatePresence>
                        {pw.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mt-3">
                            <div className="glass-card p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-400 font-medium">Password Strength</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${pwColor} text-white`}>
                                  {pwStrength}
                                </span>
                              </div>
                              <div className="flex gap-1 mb-4 h-1.5 w-full">
                                {[1,2,3,4,5].map(i => (
                                  <div key={i} className={`flex-1 rounded-full transition-colors duration-300 ${i <= pwScore ? pwColor : 'bg-white/10'}`} />
                                ))}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {pwChecks.map(c => (
                                  <div key={c.label} className={`flex items-center gap-2 text-[11px] font-medium transition-colors duration-300 ${c.ok ? 'text-emerald-400' : 'text-gray-500'}`}>
                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${c.ok ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                                      {c.ok && <HiCheck size={8} />}
                                    </div>
                                    {c.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-medium">Confirm Password <span className="text-ki-saffron">*</span></label>
                      <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className={`input-field ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500/50 focus:border-red-500' : ''}`} placeholder="Repeat your password" />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" /> Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 mt-8">
            {step > 1 ? (
              <button onClick={goBack} className="btn-secondary flex-none w-auto px-6 py-4 flex items-center gap-2">
                <HiArrowLeft /> Back
              </button>
            ) : (
              <div className="w-[104px]" /> // Spacer
            )}
            
            {step < 4 ? (
              <button 
                onClick={goNext} 
                disabled={!canNext()} 
                className={`btn-primary flex-1 py-4 flex items-center justify-center gap-2 ${!canNext() ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                Continue <HiArrowRight />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading || !canNext()} 
                className={`btn-primary flex-1 py-4 flex items-center justify-center gap-2 ${!canNext() ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Athlete Account'}
              </button>
            )}
          </div>

          <p className="mt-8 text-center text-[11px] text-gray-500 tracking-wide uppercase">
            By registering, you agree to our <Link to="#" className="text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Terms of Service</Link> and <Link to="#" className="text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
