import { useEffect, useRef } from 'react'

export default function ProgressPanel({ logs, tripSummary }) {
  const logEndRef = useRef(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour12: false })
  }

  // Determine which step is active based on logs
  const getStepStatus = (keyword) => {
    const joined = logs.join(' ').toLowerCase()
    if (keyword === 'research' && joined.includes('destination expert')) return 'active'
    if (keyword === 'research' && (joined.includes('logistics') || joined.includes('compiler') || joined.includes('complete'))) return 'completed'
    if (keyword === 'logistics' && joined.includes('logistics')) return 'active'
    if (keyword === 'logistics' && (joined.includes('compiler') || joined.includes('complete'))) return 'completed'
    if (keyword === 'compile' && joined.includes('compil')) return 'active'
    if (keyword === 'compile' && joined.includes('complete')) return 'completed'
    return ''
  }

  return (
    <div className="glass-card progress-panel">
      <div className="progress-header">
        <h3>Generating Your Itinerary</h3>
        {tripSummary && (
          <p>
            {tripSummary.numDays}-day trip: {tripSummary.origin} to {tripSummary.destination} for {tripSummary.numPersons} traveler{tripSummary.numPersons > 1 ? 's' : ''} — {tripSummary.currencySymbol}{tripSummary.budget.toLocaleString()}/person
          </p>
        )}
      </div>

      <div className="progress-spinner">
        <div className="spinner" />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          AI agents are working...
        </span>
      </div>

      {/* Step indicators */}
      <div className="progress-steps">
        <div className={`progress-step ${getStepStatus('research')}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Research
        </div>
        <div className={`progress-step ${getStepStatus('logistics')}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Logistics
        </div>
        <div className={`progress-step ${getStepStatus('compile')}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Compile
        </div>
      </div>

      {/* Live log */}
      {logs.length > 0 && (
        <div className="progress-log">
          {logs.map((msg, i) => (
            <div key={i} className="progress-log-entry">
              <span className="timestamp">[{getTimestamp()}]</span>
              {msg}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  )
}
