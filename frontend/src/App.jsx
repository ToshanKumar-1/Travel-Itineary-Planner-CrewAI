import { useState } from 'react'
import TravelForm from './components/TravelForm'
import FeatureCards from './components/FeatureCards'
import ProgressPanel from './components/ProgressPanel'
import ItineraryResult from './components/ItineraryResult'

// App states: 'idle' | 'loading' | 'done' | 'error'
export default function App() {
  const [appState, setAppState] = useState('idle')
  const [itinerary, setItinerary] = useState('')
  const [progressLogs, setProgressLogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [tripSummary, setTripSummary] = useState(null)

  const handleSubmit = async (formData) => {
    setAppState('loading')
    setProgressLogs([])
    setItinerary('')
    setErrorMessage('')
    setTripSummary({
      origin: formData.origin,
      destination: formData.destination,
      numDays: formData.num_days,
      numPersons: formData.num_persons,
      budget: formData.budget,
      currencySymbol: formData.currency_symbol,
    })

    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Server error ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'progress') {
              setProgressLogs((prev) => [...prev, event.message])
            } else if (event.type === 'complete') {
              setItinerary(event.itinerary)
              setAppState('done')
            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          } catch (parseErr) {
            if (parseErr.message && !parseErr.message.includes('JSON')) {
              throw parseErr
            }
          }
        }
      }

      // If we haven't received a complete event via SSE, fallback
      if (!itinerary && appState !== 'done') {
        // Check buffer for remaining data
        if (buffer.startsWith('data: ')) {
          try {
            const event = JSON.parse(buffer.slice(6))
            if (event.type === 'complete') {
              setItinerary(event.itinerary)
              setAppState('done')
            }
          } catch (_) {
            // ignore
          }
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred')
      setAppState('error')
    }
  }

  const handleClear = () => {
    setAppState('idle')
    setItinerary('')
    setProgressLogs([])
    setErrorMessage('')
    setTripSummary(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      {/* Hero */}
      <header className="hero">
        <div className="hero-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
        </div>
        <h1>AI Travel Planner</h1>
        <p>Enter your trip details and get a personalized, budget-aware itinerary powered by AI agents.</p>
      </header>

      {/* Form */}
      <TravelForm
        onSubmit={handleSubmit}
        disabled={appState === 'loading'}
      />

      <div className="divider" />

      {/* Idle — feature cards */}
      {appState === 'idle' && <FeatureCards />}

      {/* Loading — progress panel */}
      {appState === 'loading' && (
        <ProgressPanel logs={progressLogs} tripSummary={tripSummary} />
      )}

      {/* Error */}
      {appState === 'error' && (
        <div className="glass-card">
          <div className="error-box">
            <h4>Generation Failed</h4>
            <p>{errorMessage}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Check your API keys in the .env file and try again.
            </p>
          </div>
          <div className="button-center" style={{ marginTop: '1rem' }}>
            <button className="btn-outline" onClick={handleClear}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 119 9"/><polyline points="3 3 3 12 12 12"/></svg>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Done — itinerary */}
      {appState === 'done' && (
        <ItineraryResult
          markdown={itinerary}
          destination={tripSummary?.destination || 'trip'}
          onClear={handleClear}
        />
      )}
    </div>
  )
}
