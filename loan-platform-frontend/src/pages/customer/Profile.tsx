import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userApi, type UserProfile } from '../../api/userApi';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import '../../styles/Profile.css';

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString();
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { resendPhoneOtp, resendEmailOtp } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await userApi.getCurrentUser();
        setProfile(data);
      } catch {
        setError('Unable to load your profile.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleVerifyEmail = async () => {
    try {
      setIsVerifyingEmail(true);
      setError(null);

      await resendEmailOtp();

      navigate('/verify-email');
    } catch {
      setError('Unable to send email verification OTP. Please try again.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      setIsVerifyingPhone(true);
      setError(null);

      // Generate a fresh phone OTP
      await resendPhoneOtp();

      // Then go to OTP entry page
      navigate('/verify-phone');
    } catch {
      setError('Unable to send phone verification OTP. Please try again.');
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error && !profile) {
    return (
      <div className="customer-dashboard profile-page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="customer-dashboard profile-page">
        <ErrorMessage message="Profile not found." />
      </div>
    );
  }

  return (
    <div className="customer-dashboard profile-page">

      <div className="welcome-card">
        <div className="welcome-content">
          <span className="workflow-eyebrow">Account</span>
          <h1>My Profile</h1>
          <p>View your Ezfinanz account information.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <section className="application-status-card profile-card">
        <div className="status-card-header">
          <div>
            <span className="workflow-eyebrow">
              Personal information
            </span>

            <h2>Account details</h2>
          </div>
        </div>

        <div className="profile-details">

          <div className="profile-detail">
            <span className="summary-label">Email</span>
            <span className="summary-value">
              {profile.email}
            </span>
          </div>

          <div className="profile-detail">
            <span className="summary-label">Phone</span>
            <span className="summary-value">
              {profile.phone}
            </span>
          </div>

          <div className="profile-detail">
            <span className="summary-label">Role</span>
            <span className="summary-value">
              {profile.role}
            </span>
          </div>

          <div className="profile-detail">
            <span className="summary-label">
              Account created
            </span>

            <span className="summary-value">
              {formatDate(profile.createdAt)}
            </span>
          </div>

        </div>
      </section>

      <section className="application-status-card profile-card">

        <div className="status-card-header">
          <div>
            <span className="workflow-eyebrow">
              Verification
            </span>

            <h2>Account verification</h2>
          </div>
        </div>

        <div className="profile-details">

          {/* EMAIL */}
          <div className="profile-detail">

            <span className="summary-label">
              Email
            </span>

            <div className="profile-verification-row">

              <span
                className={`profile-verification ${
                  profile.emailVerified
                    ? 'verified'
                    : 'not-verified'
                }`}
              >
                {profile.emailVerified
                  ? 'Verified'
                  : 'Not verified'}
              </span>

              {!profile.emailVerified && (
                <button
                  type="button"
                  className="action-button"
                  onClick={handleVerifyEmail}
                  disabled={isVerifyingEmail}
                >
                  {isVerifyingEmail
                    ? 'Sending...'
                    : 'Verify'}
                </button>
              )}

            </div>
          </div>

          {/* PHONE */}
          <div className="profile-detail">

            <span className="summary-label">
              Phone
            </span>

            <div className="profile-verification-row">

              <span
                className={`profile-verification ${
                  profile.phoneVerified
                    ? 'verified'
                    : 'not-verified'
                }`}
              >
                {profile.phoneVerified
                  ? 'Verified'
                  : 'Not verified'}
              </span>

              {!profile.phoneVerified && (
                <button
                  type="button"
                  className="action-button"
                  onClick={handleVerifyPhone}
                  disabled={isVerifyingPhone}
                >
                  {isVerifyingPhone
                    ? 'Sending...'
                    : 'Verify'}
                </button>
              )}

            </div>
          </div>

        </div>
      </section>

      <button
        type="button"
        className="action-button primary"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>

    </div>
  );
};