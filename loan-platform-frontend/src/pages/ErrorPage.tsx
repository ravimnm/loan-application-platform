import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, message }) => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-code">{code}</div>
        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export const NotFound = () => (
  <ErrorPage
    code={404}
    title="Page Not Found"
    message="The page you're looking for doesn't exist."
  />
);

export const Unauthorized = () => (
  <ErrorPage
    code={403}
    title="Access Denied"
    message="You don't have permission to access this page."
  />
);
