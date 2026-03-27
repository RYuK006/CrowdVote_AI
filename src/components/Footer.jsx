import React from 'react';

const Footer = () => {
  return (
    <footer className="section-highest" style={{ padding: 'var(--spacing-12) 0', marginTop: 'auto' }}>
      <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-12)' }}>
        <div className="stack">
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)' }}>CrowdVote AI</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            The Digital Archivist for Kerala's democratic pulse. Professional, neutral, and data-driven forecasting.
          </p>
        </div>
        <div className="stack">
          <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Sections</h4>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Forecasting Methodology</a>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Constituency Maps</a>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Historical Data</a>
        </div>
        <div className="stack">
          <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Resources</h4>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.875rem' }}>Admin Access</a>
        </div>
        <div className="stack">
          <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Archives</h4>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            © 2026 Kerala Election Bureau. <br/>All data sovereignty reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
