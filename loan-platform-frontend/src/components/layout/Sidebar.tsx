import React, { useState } from 'react';

interface CustomerSidebarProps {
  children?: React.ReactNode;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-sidebar-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        =
      </button>

      <aside
        className={`customer-sidebar ${
          isOpen ? 'mobile-sidebar-open' : ''
        }`}
      >
        {children}
      </aside>
    </>
  );
};