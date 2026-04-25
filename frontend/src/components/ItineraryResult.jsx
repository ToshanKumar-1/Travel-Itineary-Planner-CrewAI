import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ItineraryResult({ markdown, destination, onClear }) {
  const handleDownload = () => {
    if (!markdown) return
    const filename = `itinerary_${destination.replace(/\s+/g, '_').toLowerCase()}.md`
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Your Itinerary is Ready
        </h2>
      </div>

      <div className="glass-card">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" id="download-btn" onClick={handleDownload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Markdown
        </button>
        <button className="btn-outline" id="clear-btn" onClick={onClear}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 119 9"/><polyline points="3 3 3 12 12 12"/></svg>
          Clear and Start Over
        </button>
      </div>
    </div>
  )
}
