export default function MessageBubble({ message, mine }) {
  return (
    <div className={`max-w-[78%] px-4 py-2 rounded-2xl text-sm ${mine ? 'ml-auto bg-ki-saffron/20 border border-ki-saffron/30' : 'bg-theme-elevated border border-theme'}`}>
      {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
      {message.attachment_path && (
        <a href={message.attachment_path} target="_blank" rel="noreferrer" className="text-xs text-ki-saffron underline">
          Attachment
        </a>
      )}
      <p className="text-[10px] mt-1 text-theme-muted">{new Date(message.timestamp).toLocaleTimeString()}</p>
    </div>
  )
}
