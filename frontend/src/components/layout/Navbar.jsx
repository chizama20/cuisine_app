import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../../services/token.service';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">RecipeApp</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {!loggedIn && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        {loggedIn && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/create-recipe">Create Recipe</Link></li>
            <li>
              <button onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
