import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext.jsx'
import { useCoach } from '../context/CoachContext.jsx'
import { commsApi } from '../utils/commsApi.js'

export default function Notifications() {
  const { user, token: athleteToken } = useApp()
  const { coach, token: coachToken } = useCoach()
  const token = coach?.coach_id ? coachToken : athleteToken
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('all')
  const [category, setCategory] = useState('')

  const load = () => {
    if (!token) return
    const filter = tab === 'unread' ? 'unread' : ''
    commsApi.listNotifications(token, { filter, category }).then(setItems).catch(() => setItems([]))
  }
  useEffect(load, [token, tab, category]) // eslint-disable-line

  const alerts = useMemo(() => items.filter((x) => x.category === 'admin' || x.category === 'platform'), [items])

  return (
    <div className="page-shell min-h-screen">
      <Navbar />
      <div className="pt-24 pb-10 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-5">Notifications</h1>
        <div className="glass-card p-4 mb-4 flex flex-wrap gap-2 items-center">
          {['all', 'unread', 'alerts'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm ${tab === t ? 'bg-ki-saffron/20 text-ki-saffron' : 'bg-theme-elevated'}`}>{t}</button>
          ))}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field max-w-[220px] ml-auto">
            <option value="">All categories</option>
            {['assessment', 'badge', 'coach_feedback', 'event', 'ranking', 'platform', 'admin'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => commsApi.markAllNotificationsRead(token).then(load)} className="btn-secondary px-3 py-2 text-xs">Mark all read</button>
        </div>
        <div className="space-y-3">
          {(tab === 'alerts' ? alerts : items).map((n) => (
            <div key={n.id} className="glass-card p-4 flex gap-3 items-start">
              <div className={`mt-1 w-2.5 h-2.5 rounded-full ${n.read_status ? 'bg-gray-500' : 'bg-ki-saffron'}`} />
              <div className="flex-1">
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-theme-muted">{n.message}</p>
                <p className="text-xs text-theme-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read_status && <button onClick={() => commsApi.markNotificationRead(token, n.id).then(load)} className="text-xs text-ki-saffron">Read</button>}
              <button onClick={() => commsApi.deleteNotification(token, n.id).then(load)} className="text-xs text-red-400">Delete</button>
            </div>
          ))}
          {!items.length && <div className="glass-card p-8 text-center text-theme-muted">No notifications yet.</div>}
        </div>
      </div>
      <Footer />
    </div>
  )
}
