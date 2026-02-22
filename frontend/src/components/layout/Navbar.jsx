import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAll = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left: brand + home */}
      <div className="nav-left">
        <Link to="/" className="nav-brand" onClick={closeAll}>Cuisine</Link>
        <Link to="/" className="nav-link nav-home-link" onClick={closeAll}>Home</Link>
      </div>

      {/* Right: auth or user dropdown + hamburger */}
      <div className="nav-right">
        {!isAuthenticated ? (
          <div className="nav-auth-links">
            <Link to="/login" className="nav-link" onClick={closeAll}>Login</Link>
            <Link to="/register" className="nav-link nav-link--cta" onClick={closeAll}>Register</Link>
          </div>
        ) : (
          <div className="nav-user" ref={dropdownRef}>
            <button
              className="nav-user-trigger"
              onClick={() => setDropdownOpen(o => !o)}
              aria-expanded={dropdownOpen}
            >
              {user?.firstName || 'Account'}
              <span className="nav-chevron">{dropdownOpen ? '▴' : '▾'}</span>
            </button>

            {dropdownOpen && (
              <div className="nav-dropdown">
                <Link to="/dashboard" className="nav-dropdown-item" onClick={closeAll}>Dashboard</Link>
                <Link to="/profile" className="nav-dropdown-item" onClick={closeAll}>Profile</Link>
                <Link to="/create-recipe" className="nav-dropdown-item" onClick={closeAll}>Create Recipe</Link>
                <div className="nav-dropdown-divider" />
                <button
                  className="nav-dropdown-item nav-dropdown-logout"
                  onClick={() => { logout(); closeAll(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hamburger — mobile only */}
        <button
          className={`nav-hamburger ${mobileOpen ? 'nav-hamburger--open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Link to="/" className="nav-mobile-item" onClick={closeAll}>Home</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-mobile-item" onClick={closeAll}>Login</Link>
              <Link to="/register" className="nav-mobile-item" onClick={closeAll}>Register</Link>
            </>
          ) : (
            <>
              <div className="nav-mobile-user">{user?.firstName} {user?.lastName}</div>
              <Link to="/dashboard" className="nav-mobile-item" onClick={closeAll}>Dashboard</Link>
              <Link to="/profile" className="nav-mobile-item" onClick={closeAll}>Profile</Link>
              <Link to="/create-recipe" className="nav-mobile-item" onClick={closeAll}>Create Recipe</Link>
              <div className="nav-mobile-divider" />
              <button
                className="nav-mobile-item nav-mobile-logout"
                onClick={() => { logout(); closeAll(); }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
