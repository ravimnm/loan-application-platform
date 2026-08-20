import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default' 
}) => {
  return (
    <span className={`status-badge status-badge-${variant}`}>
      {status}
    </span>
  );
};
