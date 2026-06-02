export default function TypingIndicator({ visible }) {
  if (!visible) return null
  return <div className="text-xs text-theme-muted px-2">Typing...</div>
}
