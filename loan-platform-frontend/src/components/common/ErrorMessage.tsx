import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠</span>
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="error-close">
            ×
          </button>
        )}
      </div>
    </div>
  );
};
