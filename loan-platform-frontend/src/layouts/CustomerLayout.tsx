import React, { useState } from 'react';
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="customer-layout">

      {/* Mobile top bar */}
      <header className="mobile-customer-header">
        <button
          type="button"
          className="mobile-sidebar-toggle"
          onClick={() =>
            setSidebarOpen((previous) => !previous)
          }
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
        >
          =
        </button>

        <strong>Ezfinanz</strong>
      </header>


      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="customer-sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}


      {/* Sidebar */}
      <aside
        className={`customer-sidebar ${
          sidebarOpen ? 'mobile-sidebar-open' : ''
        }`}
      >

        <div className="customer-sidebar-brand">
          <h2>Ezfinanz</h2>
          <span>Loan Platform</span>
        </div>


        <div className="customer-user-card">

          <div className="customer-user-avatar">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="customer-user-info">
            <strong>
              {user?.email || 'Customer'}
            </strong>

            <span>
              Customer
            </span>
          </div>

        </div>


        <nav className="customer-navigation">

          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `customer-nav-link ${
                isActive ? 'active' : ''
              }`
            }
          >
            Dashboard
          </NavLink>


          <NavLink
            to="/applications"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `customer-nav-link ${
                isActive ? 'active' : ''
              }`
            }
          >
            My Applications
          </NavLink>


          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `customer-nav-link ${
                isActive ? 'active' : ''
              }`
            }
          >
            Profile
          </NavLink>


          <NavLink
            to="/help"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `customer-nav-link ${
                isActive ? 'active' : ''
              }`
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


      {/* Main content */}
      <main className="customer-content">
        {children}
      </main>

    </div>
  );
};