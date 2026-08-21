import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { getAuthErrorMessage } from '../../utils/userFacingErrors';

export const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyEmail, user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      setIsLoading(true);
    
      await verifyEmail(otp);
    
      navigate('/dashboard', { replace: true });
    
    } catch (err: unknown) {
      setError(
        getAuthErrorMessage(
          err,
          'Email verification failed. Please check the OTP and try again.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Verify Your Email</h1>
          <p>We've sent an OTP to your email address</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading}
              maxLength={6}
              required
            />
            <small>Check your email for the 6-digit code</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Didn't receive the code? Check your spam folder or register again.</p>
        </div>
      </div>
    </div>
  );
};
