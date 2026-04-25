export default function FeatureCards() {
  const features = [
    {
      title: 'Smart Research',
      desc: 'AI searches the web for attractions, restaurants, and local tips tailored to your interests.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      ),
    },
    {
      title: 'Budget Aware',
      desc: 'Compares multiple flight, hotel, and package options across budget tiers.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      ),
    },
    {
      title: 'Day-by-Day Plan',
      desc: 'Get a detailed itinerary with morning, afternoon, and evening activities.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      ),
    },
    {
      title: 'Dual Currency',
      desc: 'All prices shown in your currency and the destination local currency.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      ),
    },
  ]

  return (
    <div className="features-grid">
      {features.map((f) => (
        <div key={f.title} className="feature-card">
          <div className="feature-icon">{f.icon}</div>
          <h4>{f.title}</h4>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  )
}
