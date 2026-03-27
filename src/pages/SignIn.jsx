import React from 'react';

const SignIn = () => {
  return (
    <div className="section-low" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--spacing-8)'
    }}>
      <div className="layered-card ambient-lift" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        padding: 'var(--spacing-12)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          borderRadius: 'var(--radius-xl)',
          margin: '0 auto var(--spacing-8) auto'
        }}></div>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>Archive Access</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-8)' }}>
          Secure sign-in for the Kerala Election Bureau.
        </p>
        
        <form className="stack" style={{ gap: 'var(--spacing-6)' }} onSubmit={(e) => e.preventDefault()}>
          <div className="stack" style={{ gap: 'var(--spacing-2)', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Email Address</label>
            <input type="email" placeholder="name@election.kerala.gov.in" style={{
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--surface-container-low)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem'
            }} />
          </div>
          <div className="stack" style={{ gap: 'var(--spacing-2)', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--surface-container-low)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem'
            }} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: 'var(--spacing-4)' }}>Access the Archive</button>
        </form>
        
        <div style={{ marginTop: 'var(--spacing-8)', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
          Don't have an archivist account? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Apply for access</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
