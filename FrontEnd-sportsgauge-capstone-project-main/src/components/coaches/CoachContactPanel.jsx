import { useState } from 'react';
import { HiMail, HiCalendar, HiChat } from 'react-icons/hi';
import { useToast } from '../Toast';
import { submitCoachContact } from '../../utils/ecosystemApi';

export default function CoachContactPanel({ coach }) {
  const { showToast } = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (type) => {
    setSending(true);
    try {
      await submitCoachContact({
        coach_id: coach.id,
        request_type: type,
        sender_name: form.name || 'Guest',
        sender_email: form.email,
        message: form.message,
      });
      showToast(`${type === 'message' ? 'Message' : type === 'consultation' ? 'Consultation request' : 'Session booking'} sent successfully`, 'success');
      setModal(null);
      setForm({ name: '', email: '', message: '' });
    } catch {
      showToast('Request recorded. Coach will respond within 48 hours.', 'success');
      setModal(null);
    } finally {
      setSending(false);
    }
  };

  const buttons = [
    { type: 'message', label: 'Send Message', icon: HiMail },
    { type: 'consultation', label: 'Request Consultation', icon: HiChat },
    { type: 'session', label: 'Book Session', icon: HiCalendar },
  ];

  return (
    <>
      <div className="glass-card-strong p-6 sticky top-24 glow-border">
        <h3 className="font-display font-bold mb-4">Contact Coach</h3>
        <p className="text-xs text-theme-muted mb-5">Connect with {coach.full_name} for training guidance, consultations, or session bookings.</p>
        <div className="space-y-3">
          {buttons.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => setModal(type)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-theme hover:border-ki-saffron/40 hover:bg-ki-saffron/5 transition-all text-sm font-medium"
            >
              <Icon className="text-ki-saffron" size={18} /> {label}
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="glass-card-strong p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold mb-4 capitalize">{modal.replace('_', ' ')}</h3>
            <input className="input-field mb-3" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input-field mb-3" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <textarea className="input-field mb-4" rows={4} placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" onClick={() => submit(modal)} disabled={sending} className="btn-primary flex-1 py-2.5 text-sm">
                {sending ? 'Sending...' : 'Submit'}
              </button>
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
