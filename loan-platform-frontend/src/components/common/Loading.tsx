import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullScreen = false }) => {
  const className = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={className}>
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};
