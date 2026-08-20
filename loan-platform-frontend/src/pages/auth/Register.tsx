import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { getAuthErrorMessage } from '../../utils/userFacingErrors';

export const Register: React.FC = () => {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();
    setError('');

    if (
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        'Please complete all required fields.'
      );
      return;
    }


    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );
      return;
    }


    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }


    if (phone.length < 10) {
      setError(
        'Please enter a valid phone number.'
      );
      return;
    }


    try {

      setIsLoading(true);

      await register(
        email.trim(),
        phone,
        password
      );

      navigate('/verify-email');

    } catch (err: unknown) {

      setError(
        getAuthErrorMessage(
          err,
          'Registration failed. Please try again.'
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
          REGISTER CONTENT
          ===================================================== */}

      <section className="auth-layout">

        <div className="auth-intro">

          <span className="auth-eyebrow">
            Get started
          </span>

          <h1>
            Create your Ezfinanz account.
          </h1>

          <p>
            Create an account to begin your digital loan
            application and track it through the complete
            processing workflow.
          </p>


          <div className="auth-process">

            <div className="auth-process-step">

              <span>1</span>

              <div>
                <strong>Create your account</strong>

                <p>
                  Register with your email address and
                  phone number.
                </p>
              </div>

            </div>


            <div className="auth-process-step">

              <span>2</span>

              <div>
                <strong>Verify your contact details</strong>

                <p>
                  Complete the required verification
                  steps before continuing.
                </p>
              </div>

            </div>


            <div className="auth-process-step">

              <span>3</span>

              <div>
                <strong>Complete your application</strong>

                <p>
                  Submit KYC, financial and other required
                  application information.
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
              New account
            </span>

            <h2>
              Create account
            </h2>

            <p>
              Enter your details to get started.
            </p>

          </div>


          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError('')}
            />
          )}


          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* EMAIL */}

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

              <small>
                Use an email address you can access.
              </small>

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone number
              </label>

              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value.replace(/\D/g, '')
                  )
                }
                disabled={isLoading}
                autoComplete="tel"
                inputMode="numeric"
                required
              />

              <small>
                Your phone number will be used for
                account verification.
              </small>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={isLoading}
                autoComplete="new-password"
                required
              />

              <small>
                At least 6 characters.
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                disabled={isLoading}
                autoComplete="new-password"
                required
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>


          <div className="auth-security-note">

            <span>✓</span>

            <p>
              Your account will need to complete the
              required verification steps before starting
              the application workflow.
            </p>

          </div>


          <div className="auth-footer">

            <p>
              Already have an account?{' '}

              <Link
                to="/login"
                className="auth-link"
              >
                Sign in
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