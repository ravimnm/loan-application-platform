import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/CustomerLayout.css';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="customer-layout">
      <aside className="customer-sidebar">
        <div className="customer-sidebar-brand">
          <h2>Ezfinanz</h2>
          <span>Loan Platform</span>
        </div>

        <div className="customer-user-card">
          <div className="customer-user-avatar">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="customer-user-info">
            <strong>{user?.email || 'Customer'}</strong>
            <span>Customer</span>
          </div>
        </div>

        <nav className="customer-navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `customer-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `customer-nav-link ${isActive ? 'active' : ''}`
            }
          >
            My Applications
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `customer-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) =>
              `customer-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Help
          </NavLink>
        </nav>

        <div className="customer-sidebar-footer">
          <button
            type="button"
            className="customer-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="customer-content">
        {children}
      </main>
    </div>
  );
};