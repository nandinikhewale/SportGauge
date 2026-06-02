import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoach } from '../context/CoachContext';
import { useToast } from '../components/Toast';
import { coachLogin } from '../utils/ecosystemApi';
import Logo from '../components/Logo';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function CoachLogin() {
  const navigate = useNavigate();
  const { setCoach } = useCoach();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await coachLogin(form);
      setCoach(data);
      showToast(`Welcome, Coach ${data.full_name.split(' ')[0]}!`, 'success');
      navigate('/coach/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try rajesh.coach@sportsgauge.in / coach123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <Logo size="lg" className="mb-8" />
      <div className="glass-card-strong p-8 w-full max-w-md glow-border">
        <h1 className="text-2xl font-display font-bold mb-2">Coach Login</h1>
        <p className="text-sm text-theme-muted mb-6">Access your athlete management dashboard</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-theme-muted">Email</label>
            <div className="relative mt-1">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input className="input-field pl-10" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="coach@academy.in" />
            </div>
          </div>
          <div>
            <label className="text-xs text-theme-muted">Password</label>
            <div className="relative mt-1">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input className="input-field pl-10" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-xs text-theme-muted mt-6 text-center">
          Demo: rajesh.coach@sportsgauge.in / coach123<br />
          <Link to="/coaches/register" className="text-ki-saffron hover:underline">Register as coach</Link>
          {' · '}
          <Link to="/coaches" className="text-ki-saffron hover:underline">Browse coaches</Link>
        </p>
      </div>
    </div>
  );
}
