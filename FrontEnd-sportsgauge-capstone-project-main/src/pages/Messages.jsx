import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext.jsx'
import { useCoach } from '../context/CoachContext.jsx'
import { commsApi } from '../utils/commsApi.js'
import ChatHeader from '../components/chat/ChatHeader.jsx'
import MessageBubble from '../components/chat/MessageBubble.jsx'
import TypingIndicator from '../components/chat/TypingIndicator.jsx'
import AttachmentPreview from '../components/chat/AttachmentPreview.jsx'

export default function Messages() {
  const { user, token: athleteToken } = useApp()
  const { coach, token: coachToken } = useCoach()
  const token = coach?.coach_id ? coachToken : athleteToken
  const meType = coach?.coach_id ? 'coach' : 'athlete'
  const meId = coach?.coach_id || user?.id
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [file, setFile] = useState(null)

  const loadConversations = () => token && commsApi.listConversations(token).then((r) => { setConversations(r); if (!active && r[0]) setActive(r[0]) }).catch(() => {})
  useEffect(loadConversations, [token]) // eslint-disable-line
  useEffect(() => {
    if (!token || !active?.id) return
    commsApi.listMessages(token, active.id).then(setMessages).catch(() => setMessages([]))
  }, [token, active?.id])
  useEffect(() => {
    if (!token || !query.trim()) return setResults([])
    const t = setTimeout(() => commsApi.searchUsers(token, query).then(setResults).catch(() => setResults([])), 250)
    return () => clearTimeout(t)
  }, [query, token])

  const send = async () => {
    if (!token || !active?.id || (!text.trim() && !file)) return
    let attachment_path = ''
    if (file) {
      const up = await commsApi.uploadAttachment(token, file)
      attachment_path = up.attachment_path
    }
    await commsApi.sendMessage(token, active.id, { content: text, attachment_path })
    setText('')
    setFile(null)
    const rows = await commsApi.listMessages(token, active.id)
    setMessages(rows)
    loadConversations()
  }

  const startWith = async (row) => {
    const c = await commsApi.startConversation(token, { other_type: row.type, other_id: row.id })
    const next = { id: c.id, other_name: row.name }
    setActive(next)
    setQuery('')
    setResults([])
    loadConversations()
  }

  const activeTitle = active?.other_name || 'Select conversation'
  const sorted = useMemo(() => [...messages], [messages])

  return (
    <div className="page-shell min-h-screen">
      <Navbar />
      <div className="pt-24 pb-10 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-5">Messages</h1>
        <div className="grid lg:grid-cols-12 gap-4 min-h-[70vh]">
          <div className="lg:col-span-4 glass-card p-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field mb-3" placeholder="Search users..." />
            {!!results.length && (
              <div className="mb-3 space-y-2">
                {results.map((r) => <button key={`${r.type}-${r.id}`} onClick={() => startWith(r)} className="w-full text-left p-2 rounded-lg bg-theme-elevated hover:bg-theme">{r.name} <span className="text-xs text-theme-muted">({r.type})</span></button>)}
              </div>
            )}
            <div className="space-y-2">
              {conversations.map((c) => (
                <button key={c.id} onClick={() => setActive(c)} className={`w-full text-left p-3 rounded-lg ${active?.id === c.id ? 'bg-ki-saffron/15 border border-ki-saffron/20' : 'bg-theme-elevated'}`}>
                  <p className="font-medium">{c.other_name}</p>
                  <p className="text-xs text-theme-muted truncate">{c.last_message || 'No messages yet'}</p>
                  {!!c.unread && <span className="text-[10px] text-ki-saffron">{c.unread} unread</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 glass-card p-0 flex flex-col">
            <ChatHeader title={activeTitle} subtitle="WhatsApp-style messaging with read receipts" />
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {sorted.map((m) => <MessageBubble key={m.id} message={m} mine={m.sender_type === meType && m.sender_id === meId} />)}
              <TypingIndicator visible={false} />
            </div>
            <div className="p-3 border-t border-theme space-y-2">
              <AttachmentPreview file={file} onClear={() => setFile(null)} />
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="input-field flex-1" placeholder="Type a message" />
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs max-w-[180px]" />
                <button onClick={send} className="btn-primary px-4">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
