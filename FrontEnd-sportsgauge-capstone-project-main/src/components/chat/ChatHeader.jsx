export default function ChatHeader({ title, subtitle }) {
  return (
    <div className="p-3 border-b border-theme flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{title || 'Conversation'}</h3>
        <p className="text-xs text-theme-muted">{subtitle || 'Online status available in real time'}</p>
      </div>
    </div>
  )
}
