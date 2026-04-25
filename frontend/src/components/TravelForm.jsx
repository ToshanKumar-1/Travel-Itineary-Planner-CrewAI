import { useState } from 'react'

const CURRENCIES = [
  { code: 'INR', symbol: 'Rs.' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: 'E' },
  { code: 'GBP', symbol: 'GBP' },
]

const INTERESTS = [
  'History & Culture',
  'Food & Drink',
  'Adventure & Outdoors',
  'Nightlife & Entertainment',
  'Nature & Wildlife',
  'Shopping',
  'Art & Museums',
  'Relaxation & Wellness',
]

export default function TravelForm({ onSubmit, disabled }) {
  const [currency, setCurrency] = useState('INR|Rs.')
  const [selectedInterests, setSelectedInterests] = useState(['History & Culture', 'Food & Drink'])
  
  // Get today's date in YYYY-MM-DD format for the date picker minimum
  const today = new Date().toISOString().split('T')[0]

  const currencySymbol = currency.split('|')[1]

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    
    const origin = fd.get('origin').trim()
    const destination = fd.get('destination').trim()
    const budget = parseInt(fd.get('budget'))
    const num_days = parseInt(fd.get('num_days'))
    const num_persons = parseInt(fd.get('num_persons'))
    const [currencyCode, currSymbol] = currency.split('|')

    // Basic Validation
    if (origin.toLowerCase() === destination.toLowerCase()) {
      alert("Origin and destination cannot be the same city.")
      return
    }
    
    if (budget < 500) {
      alert("Please enter a realistic budget per person (minimum 500).")
      return
    }
    
    if (num_days > 30) {
      alert("Trips are limited to a maximum of 30 days.")
      return
    }

    onSubmit({
      origin,
      destination,
      budget,
      num_persons,
      currency: currencyCode,
      currency_symbol: currSymbol,
      start_date: fd.get('start_date'),
      num_days,
      interests: selectedInterests.join(', ') || 'General sightseeing',
    })
  }

  return (
    <div className="glass-card form-section">
      <form onSubmit={handleSubmit}>
        {/* Row 1: Origin, Destination, Currency */}
        <div className="form-row cols-3">
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              Origin City
            </label>
            <input type="text" name="origin" id="input-origin" placeholder="e.g., Mumbai, India" required />
          </div>
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              Destination
            </label>
            <input type="text" name="destination" id="input-destination" placeholder="e.g., Paris, France" required />
          </div>
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </span>
              Currency
            </label>
            <select
              id="input-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={`${c.code}|${c.symbol}`}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Budget, Travelers, Start Date, Days */}
        <div className="form-row cols-4">
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </span>
              Budget / Person ({currencySymbol})
            </label>
            <input type="number" name="budget" id="input-budget" min="500" defaultValue="50000" step="100" required />
          </div>
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </span>
              Travelers
            </label>
            <input type="number" name="num_persons" id="input-persons" min="1" max="20" defaultValue="1" required />
          </div>
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </span>
              Start Date
            </label>
            <input type="date" name="start_date" id="input-date" min={today} required />
          </div>
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              Days
            </label>
            <input type="number" name="num_days" id="input-days" min="1" max="30" defaultValue="5" required />
          </div>
        </div>

        {/* Row 3: Interests (chip toggle) */}
        <div className="form-row cols-1">
          <div className="form-group">
            <label>
              <span className="label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              Travel Interests
            </label>
            <div className="interest-chips">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-chip ${selectedInterests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="button-center">
          <button type="submit" className="btn-primary" id="generate-btn" disabled={disabled}>
            {disabled ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Generate Itinerary
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
