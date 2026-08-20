import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplication } from '../../hooks/useApplication';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import type {
  ApplicationStage,
  ApplicationStatus,
} from '../../types/application';

import '../../styles/CustomerDashboard.css';

interface StatusDetails {
  title: string;
  description: string;
  tone: 'default' | 'success' | 'warning' | 'error';
}

const STAGE_LABELS: Record<ApplicationStage, string> = {
  KYC: 'KYC',
  ELIGIBILITY: 'Eligibility',
  EMI_SELECTION: 'EMI Selection',
  BANK_ACCOUNT: 'Bank Account',
  DECLARATION: 'Declaration',
  SELFIE: 'Selfie',
  ADMIN_REVIEW: 'Admin Review',
  DISBURSEMENT: 'Disbursement',
  COMPLETED: 'Completed',
};

const STAGE_DETAILS: Record<ApplicationStage, StatusDetails> = {
  KYC: {
    title: 'Identity details needed',
    description:
      'Continue providing your personal and identity information.',
    tone: 'default',
  },

  ELIGIBILITY: {
    title: 'Eligibility check needed',
    description:
      'Provide the financial information required to evaluate your eligibility.',
    tone: 'default',
  },

  EMI_SELECTION: {
    title: 'Choose your repayment plan',
    description:
      'Review the available repayment options for your application.',
    tone: 'default',
  },

  BANK_ACCOUNT: {
    title: 'Bank details needed',
    description:
      'Provide the bank account required for potential fund transfer.',
    tone: 'default',
  },

  DECLARATION: {
    title: 'Confirmation required',
    description:
      'Review your application information and confirm the declaration.',
    tone: 'default',
  },

  SELFIE: {
    title: 'Selfie verification required',
    description:
      'Submit a clear selfie to complete identity verification.',
    tone: 'default',
  },

  ADMIN_REVIEW: {
    title: 'Application under review',
    description:
      'Your application has been submitted and is currently being reviewed.',
    tone: 'warning',
  },

  DISBURSEMENT: {
    title: 'Funds are being prepared',
    description:
      'Your approved application has reached the disbursement stage.',
    tone: 'success',
  },

  COMPLETED: {
    title: 'Application completed',
    description:
      'Your application workflow has been completed.',
    tone: 'success',
  },
};

const getContinuePath = (
  stage: ApplicationStage
): string | null => {
  switch (stage) {
    case 'KYC':
      return '/application/kyc';

    case 'ELIGIBILITY':
      return '/application/eligibility';

    case 'EMI_SELECTION':
      return '/application/emi';

    case 'BANK_ACCOUNT':
      return '/application/bank-account';

    case 'DECLARATION':
      return '/application/declaration';

    case 'SELFIE':
      return '/application/selfie';

    default:
      return null;
  }
};

const formatStatus = (
  status: ApplicationStatus
): string => {
  switch (status) {
    case 'WAITING_FOR_ADMIN_REVIEW':
      return 'Under Review';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Rejected';

    case 'DISBURSED':
      return 'Disbursed';

    case 'NOT_ELIGIBLE':
      return 'Not Eligible';

    case 'SELFIE_PENDING':
      return 'Selfie Pending';

    case 'ELIGIBLE':
      return 'Eligible';

    case 'PARTIALLY_ELIGIBLE':
      return 'Partially Eligible';

    case 'DRAFT':
      return 'Draft';

    default:
      return 'In Progress';
  }
};

const getStatusTone = (
  status: ApplicationStatus,
  defaultTone: StatusDetails['tone']
): StatusDetails['tone'] => {
  if (
    status === 'REJECTED' ||
    status === 'NOT_ELIGIBLE'
  ) {
    return 'error';
  }

  if (status === 'APPROVED' || status === 'DISBURSED') {
    return 'success';
  }

  if (
    status === 'WAITING_FOR_ADMIN_REVIEW' ||
    status === 'SELFIE_PENDING'
  ) {
    return 'warning';
  }

  return defaultTone;
};

const formatDate = (
  value?: string
): string | null => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString();
};

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    application,
    isLoading,
    error,
    createApplication,
  } = useApplication();

  const handleStartApplication = async () => {
    const created = await createApplication();

    if (!created) {
      return;
    }

    const path = getContinuePath(
      created.currentStage
    );

    if (path) {
      navigate(path);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  /*
   * No active application.
   */
  if (!application) {
    return (
      <div className="customer-dashboard">

        <header className="dashboard-page-header">
          <div>
            <span className="dashboard-eyebrow">
              Customer Dashboard
            </span>

            <h1>
              Welcome back
            </h1>

            <p>
              Manage your loan applications from one place.
            </p>
          </div>
        </header>

        {error && (
          <section className="dashboard-error">
            <ErrorMessage message={error} />

            {(error
              .toLowerCase()
              .includes('verify your email') ||
              error
                .toLowerCase()
                .includes('verify your phone')) && (
              <button
                type="button"
                className="action-button primary"
                onClick={() =>
                  navigate('/profile')
                }
              >
                Go to Profile
              </button>
            )}
          </section>
        )}

        <section className="empty-dashboard-card">

          <div className="empty-dashboard-icon">
            +
          </div>

          <span className="dashboard-eyebrow">
            Loan Application
          </span>

          <h2>
            Start a new loan application
          </h2>

          <p>
            Begin your application by providing your
            personal, financial, identity and bank
            information.
          </p>

          <button
            type="button"
            className="action-button primary"
            onClick={handleStartApplication}
            disabled={isLoading}
          >
            {isLoading
              ? 'Starting...'
              : 'Start New Application'}
          </button>

        </section>

        <section className="dashboard-info-grid">

          <div className="dashboard-info-card">
            <h3>Simple application process</h3>
            <p>
              Complete the required steps and track
              your application status from your dashboard.
            </p>
          </div>

          <div className="dashboard-info-card">
            <h3>Secure verification</h3>
            <p>
              Your identity and financial information
              is processed through the secure loan workflow.
            </p>
          </div>

          <div className="dashboard-info-card">
            <h3>Application tracking</h3>
            <p>
              Once submitted, you can monitor the progress
              of your application here.
            </p>
          </div>

        </section>
      </div>
    );
  }

  const details =
    STAGE_DETAILS[application.currentStage];

  const continuePath =
    getContinuePath(application.currentStage);

  const createdDate =
    formatDate(application.createdAt);

  const updatedDate =
    formatDate(application.updatedAt);

  const statusTone =
    getStatusTone(
      application.status,
      details.tone
    );

  return (
    <div className="customer-dashboard">

      <header className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">
            Customer Dashboard
          </span>

          <h1>
            Welcome back
          </h1>

          <p>
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          className="action-button primary"
          onClick={() =>
            navigate('/applications')
          }
        >
          View All Applications
        </button>
      </header>

      <section className="dashboard-application-card">

        <div className="dashboard-application-header">

          <div>
            <span className="dashboard-eyebrow">
              Current Application
            </span>

            <h2>
              Application #{application.id}
            </h2>
          </div>

          <span
            className={`dashboard-status ${statusTone}`}
          >
            {formatStatus(application.status)}
          </span>

        </div>

        <div className="dashboard-application-body">

          <div>
            <span className="dashboard-field-label">
              Current Stage
            </span>

            <strong>
              {STAGE_LABELS[
                application.currentStage
              ]}
            </strong>
          </div>

          <div>
            <span className="dashboard-field-label">
              Application ID
            </span>

            <strong>
              #{application.id}
            </strong>
          </div>

          {createdDate && (
            <div>
              <span className="dashboard-field-label">
                Created
              </span>

              <strong>
                {createdDate}
              </strong>
            </div>
          )}

          {updatedDate && (
            <div>
              <span className="dashboard-field-label">
                Last Updated
              </span>

              <strong>
                {updatedDate}
              </strong>
            </div>
          )}

        </div>

        <div className="dashboard-status-message">

          <h3>
            {details.title}
          </h3>

          <p>
            {details.description}
          </p>

        </div>

        {application.rejectionReason && (
          <div className="rejection-notice">

            <h3>
              Application rejected
            </h3>

            <p>
              {application.rejectionReason}
            </p>

          </div>
        )}

        <div className="dashboard-application-actions">

          {continuePath && (
            <button
              type="button"
              className="action-button primary"
              onClick={() =>
                navigate(continuePath)
              }
            >
              Continue Application
            </button>
          )}

          <button
            type="button"
            className="action-button secondary"
            onClick={() =>
              navigate(
                `/applications/${application.id}`
              )
            }
          >
            View Application
          </button>

        </div>

      </section>

      <section className="dashboard-progress-card">

        <div className="dashboard-section-header">

          <div>
            <span className="dashboard-eyebrow">
              Application Progress
            </span>

            <h2>
              Track your application
            </h2>
          </div>

        </div>

        <ProgressIndicator
          currentStage={
            application.currentStage
          }
        />

      </section>

      <section className="dashboard-info-grid">

        <div className="dashboard-info-card">
          <h3>
            Need help?
          </h3>

          <p>
            If you have questions about your
            application, visit the help section.
          </p>

          <button
            type="button"
            className="dashboard-text-button"
            onClick={() =>
              navigate('/help')
            }
          >
            Open Help
          </button>
        </div>

        <div className="dashboard-info-card">
          <h3>
            Manage your profile
          </h3>

          <p>
            Keep your contact and verification
            information up to date.
          </p>

          <button
            type="button"
            className="dashboard-text-button"
            onClick={() =>
              navigate('/profile')
            }
          >
            Open Profile
          </button>
        </div>

        <div className="dashboard-info-card">
          <h3>
            Application history
          </h3>

          <p>
            Review your previous loan applications
            and their outcomes.
          </p>

          <button
            type="button"
            className="dashboard-text-button"
            onClick={() =>
              navigate('/applications')
            }
          >
            View History
          </button>
        </div>

      </section>

    </div>
  );
};