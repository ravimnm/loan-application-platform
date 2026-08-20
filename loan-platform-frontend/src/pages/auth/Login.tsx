import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { getAuthErrorMessage } from '../../utils/userFacingErrors';

export const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    try {

      setIsLoading(true);

      const loggedInUser =
        await login(
          email.trim(),
          password
        );

      switch (loggedInUser.role) {

        case 'CUSTOMER':
          navigate('/dashboard');
          break;

        case 'ADMIN':
          navigate('/admin/dashboard');
          break;

        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard');
          break;

        default:
          setError(
            'Your account has an invalid role.'
          );
      }

    } catch (err: unknown) {

      setError(
        getAuthErrorMessage(
          err,
          'Login failed. Please check your credentials.'
        )
      );

    } finally {

      setIsLoading(false);

    }
  };


  return (
    <main className="auth-page">

      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <nav className="auth-nav">

        <Link
          to="/"
          className="auth-brand"
        >
          Ezfinanz
        </Link>

        <Link
          to="/"
          className="auth-home-link"
        >
          Back to home
        </Link>

      </nav>


      {/* =====================================================
          LOGIN CONTENT
          ===================================================== */}

      <section className="auth-layout">

        <div className="auth-intro">

          <span className="auth-eyebrow">
            Secure access
          </span>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to continue managing your Ezfinanz
            application and access the features available
            for your account.
          </p>

          <div className="auth-benefits">

            <div className="auth-benefit">
              <span>01</span>

              <div>
                <strong>Track your application</strong>

                <p>
                  Follow your application through each
                  workflow stage.
                </p>
              </div>
            </div>


            <div className="auth-benefit">
              <span>02</span>

              <div>
                <strong>Review loan information</strong>

                <p>
                  Access eligibility, EMI and application
                  information from one place.
                </p>
              </div>
            </div>


            <div className="auth-benefit">
              <span>03</span>

              <div>
                <strong>Role-based access</strong>

                <p>
                  Your account determines which platform
                  capabilities you can access.
                </p>
              </div>
            </div>

          </div>

        </div>


        {/* ===================================================
            FORM
            =================================================== */}

        <div className="auth-card">

          <div className="auth-header">

            <span className="auth-card-eyebrow">
              Account access
            </span>

            <h2>
              Sign in
            </h2>

            <p>
              Enter your credentials to continue.
            </p>

          </div>


          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError('')}
            />
          )}

          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="google-login-button"
          >
            Continue with Google
          </a>
          
          <div className="oauth-divider">
            <span>OR</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={isLoading}
                autoComplete="email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={isLoading}
                autoComplete="current-password"
                required
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Signing in...'
                : 'Sign In'}
            </button>

          </form>


          <div className="auth-security-note">
            <span>🔒</span>

            <p>
              Your account is protected by authenticated
              API access and role-based authorization.
            </p>
          </div>


          <div className="auth-footer">

            <p>
              Don't have an account?{' '}

              <Link
                to="/register"
                className="auth-link"
              >
                Create one
              </Link>
            </p>

          </div>

        </div>

      </section>


      <footer className="auth-page-footer">
        Ezfinanz · Digital Loan Processing Platform
      </footer>

    </main>
  );
};