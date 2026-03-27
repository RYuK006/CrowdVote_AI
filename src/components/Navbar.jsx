import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: 'var(--spacing-4) 0',
      borderBottom: 'none'
    }}>
      <div className="container flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            borderRadius: 'var(--radius-lg)'
          }}></div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--primary)',
            letterSpacing: '-0.02em'
          }}>CrowdVote AI</span>
        </Link>
        
        <div className="flex" style={{ gap: 'var(--spacing-8)' }}>
          <NavLink to="/" style={({ isActive }) => ({
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontSize: '0.875rem'
          })}>Home</NavLink>
          <NavLink to="/arena" style={({ isActive }) => ({
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontSize: '0.875rem'
          })}>Prediction Arena</NavLink>
          <NavLink to="/leaderboard" style={({ isActive }) => ({
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontSize: '0.875rem'
          })}>Leaderboard</NavLink>
          <NavLink to="/voting" style={({ isActive }) => ({
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontSize: '0.875rem'
          })}>Voting</NavLink>
        </div>

        <div className="flex">
          <Link to="/signin" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: 'var(--spacing-2) var(--spacing-4)' }}>Sign In</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
