export default function AttachmentPreview({ file, onClear }) {
  if (!file) return null
  return (
    <div className="text-xs p-2 rounded-lg border border-theme bg-theme-elevated flex items-center justify-between">
      <span className="truncate mr-2">{file.name}</span>
      <button className="text-red-400" onClick={onClear} type="button">Remove</button>
    </div>
  )
}
