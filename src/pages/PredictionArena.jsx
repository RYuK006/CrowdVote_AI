import React from 'react';

const PredictionArena = () => {
  return (
    <div className="container" style={{ padding: 'var(--spacing-12) 0', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
        <div className="stack" style={{ gap: 'var(--spacing-1)' }}>
          <h1 style={{ fontSize: '2rem' }}>Prediction Arena</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>Kerala State Board • Live Forecasting Engine</p>
        </div>
        <div className="flex" style={{ gap: 'var(--spacing-4)' }}>
          <div className="layered-card flex-center" style={{ padding: 'var(--spacing-2) var(--spacing-6)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)', marginRight: 'var(--spacing-4)' }}>SESSION TIME</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>42:15</span>
          </div>
          <button className="btn btn-primary" style={{ padding: 'var(--spacing-2) var(--spacing-6)' }}>Submit Ballot</button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-8)', flex: 1, overflow: 'hidden' }}>
        {/* Interactive Map Placeholder */}
        <div className="layered-card ambient-lift" style={{ 
          position: 'relative', 
          backgroundColor: 'var(--surface-container-low)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 'var(--spacing-6)', left: 'var(--spacing-6)', zIndex: 10 }}>
            <div className="glass" style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', maxWidth: '200px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-2)' }}>Wayanad District</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Selected Constituency: Sultan Bathery</p>
              <div className="stack" style={{ gap: 'var(--spacing-1)', marginTop: 'var(--spacing-4)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>CURRENT CONSENSUS</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></div>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>UDF Lean (+12%)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Abstract Map UI */}
          <div style={{ 
            width: '60%', 
            height: '80%', 
            backgroundColor: 'var(--surface-container-highest)', 
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            opacity: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-surface-variant)',
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            textAlign: 'center'
          }}>
            [INTERACTIVE MAP GRID ARCHIVE]
          </div>
          
          <div className="flex" style={{ position: 'absolute', bottom: 'var(--spacing-6)', left: 'var(--spacing-6)', gap: 'var(--spacing-2)' }}>
            <button className="btn btn-secondary glass" style={{ fontSize: '0.75rem' }}>Zoom In</button>
            <button className="btn btn-secondary glass" style={{ fontSize: '0.75rem' }}>Zoom Out</button>
            <button className="btn btn-secondary glass" style={{ fontSize: '0.75rem' }}>Reset Projection</button>
          </div>
        </div>

        {/* Prediction Controls */}
        <div className="stack" style={{ gap: 'var(--spacing-6)', overflowY: 'auto', paddingRight: 'var(--spacing-2)' }}>
          <div className="layered-card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)' }}>Forecaster Ballot</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-6)' }}>Allocate democratic weight for Sultan Bathery constituency.</p>
            
            <div className="stack" style={{ gap: 'var(--spacing-8)' }}>
              <div className="stack" style={{ gap: 'var(--spacing-2)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>UDF (Cong/IUML)</span>
                  <span>52%</span>
                </div>
                <input type="range" style={{ width: '100%', accentColor: 'var(--secondary)' }} />
              </div>
              
              <div className="stack" style={{ gap: 'var(--spacing-2)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>LDF (CPM/CPI)</span>
                  <span>41%</span>
                </div>
                <input type="range" style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>

              <div className="stack" style={{ gap: 'var(--spacing-2)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>NDA (BJP/BDJS)</span>
                  <span>7%</span>
                </div>
                <input type="range" style={{ width: '100%', accentColor: 'var(--tertiary)' }} />
              </div>
            </div>
          </div>

          <div className="layered-card section-low">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-2)' }}>Predictive Insights</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              AI Archive indicates a 64% historical correlation between rain on election day and UDF margin growth in this constituency. 
              <br/><br/>
              <b>Archivist Tip:</b> Check the rubber tapper belt turnout before final submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionArena;
