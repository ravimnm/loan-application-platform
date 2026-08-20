import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="logo-text">Ezfinanz</span>
        </Link>

        <div className="navbar-menu" aria-label="Customer navigation">
          <NavLink to="/dashboard" className="navbar-link">
            Dashboard
          </NavLink>
          <NavLink to="/applications" className="navbar-link">
            Applications
          </NavLink>
          <NavLink to="/profile" className="navbar-link">
            Profile
          </NavLink>
          <NavLink to="/help" className="navbar-link">
            Help
          </NavLink>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
