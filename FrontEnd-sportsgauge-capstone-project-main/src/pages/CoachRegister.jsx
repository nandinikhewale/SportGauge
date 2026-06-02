import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registerCoach } from '../utils/ecosystemApi';
import { useToast } from '../components/Toast';

export default function CoachRegister() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', state: '', district: '',
    specialization: 'Athletics', experience_years: 0, certifications: '', bio: '',
  });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerCoach(form);
      if (data.success) {
        showToast('Coach registration submitted. Log in to access your dashboard.', 'success');
        navigate('/coaches/login');
      } else showToast(data.error || 'Registration failed', 'error');
    } catch {
      showToast('Cannot reach SportsGauge API. Start the backend: cd backend && python app.py, then restart npm run dev.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <section className="pt-28 pb-16 max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-2">Coach Registration</h1>
        <p className="text-theme-muted mb-8">Join the SportsGauge coaches network.</p>
        <form onSubmit={submit} className="glass-card p-6 space-y-4">
          {['full_name', 'email', 'password', 'state', 'district', 'specialization'].map(f => (
            <div key={f}>
              <label className="text-xs text-theme-muted capitalize">{f.replace('_', ' ')}</label>
              <input
                className="input-field mt-1"
                type={f === 'password' ? 'password' : 'text'}
                required={f !== 'district'}
                value={form[f]}
                onChange={e => setForm({ ...form, [f]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-theme-muted">Experience (years)</label>
            <input type="number" className="input-field mt-1" value={form.experience_years}
              onChange={e => setForm({ ...form, experience_years: +e.target.value })} />
          </div>
          <textarea className="input-field" placeholder="Certifications" rows={2}
            value={form.certifications} onChange={e => setForm({ ...form, certifications: e.target.value })} />
          <textarea className="input-field" placeholder="Bio" rows={3}
            value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Register'}</button>
        </form>
      </section>
      <Footer />
    </div>
  );
}
