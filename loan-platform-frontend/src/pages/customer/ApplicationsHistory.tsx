import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../hooks/useApplication';
import { useApplications } from '../../hooks/useApplications';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import type { Application, ApplicationStage, ApplicationStatus } from '../../types/application';
import '../../styles/CustomerDashboard.css';
import '../../styles/ApplicationsHistory.css';
import { applicationApi } from '../../api/applicationApi';
import { useState } from 'react';

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

const getContinuePath = (stage: ApplicationStage): string | null => {
  switch (stage) {
    case 'KYC': return '/application/kyc';
    case 'ELIGIBILITY': return '/application/eligibility';
    case 'EMI_SELECTION': return '/application/emi';
    case 'BANK_ACCOUNT': return '/application/bank-account';
    case 'DECLARATION': return '/application/declaration';
    case 'SELFIE': return '/application/selfie';
    default: return null;
  }
};

const formatStatus = (status: ApplicationStatus): string => {
  switch (status) {
    case 'WAITING_FOR_ADMIN_REVIEW': return 'Under Review';
    case 'APPROVED': return 'Approved';
    case 'REJECTED': return 'Rejected';
    case 'DISBURSED': return 'Disbursed';
    case 'WITHDRAWN': return 'Withdrawn';
    case 'NOT_ELIGIBLE': return 'Not Eligible';
    case 'SELFIE_PENDING': return 'Selfie Pending';
    default: return 'In Progress';
  }
};

const formatDate = (value: string | undefined): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
};

const statusTone = (status: ApplicationStatus): string => {
  if (status === 'REJECTED' || status === 'NOT_ELIGIBLE') return 'error';
  if (status === 'APPROVED' || status === 'DISBURSED') return 'success';
  if (status === 'WAITING_FOR_ADMIN_REVIEW') return 'warning';
  return 'default';
};

export const ApplicationsHistory: React.FC = () => {
  const navigate = useNavigate();

  const {
    applications,
    isLoading,
    error,
    refetch: refetchApplications,
  } = useApplications();

  const {
    application: currentApplication,
    isLoading: isCurrentLoading,
    createApplication,
    refetch: refetchCurrentApplication,
    error: createError,
  } = useApplication();

  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const handleStartApplication = async () => {
    const created = await createApplication();

    if (!created) return;

    const path = getContinuePath(created.currentStage);
    navigate(path ?? '/dashboard');
  };

  const handleWithdraw = async (applicationId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to withdraw this application?'
    );

    if (!confirmed) return;

    try {
      setWithdrawingId(applicationId);
      setWithdrawError(null);

      await applicationApi.withdrawApplication(applicationId);

      // Refresh both lists after withdrawal.
      await Promise.all([
        refetchApplications(),
        refetchCurrentApplication(),
      ]);
    } catch {
      setWithdrawError(
        'Unable to withdraw the application. Please try again.'
      );
    } finally {
      setWithdrawingId(null);
    }
  };

  if (isLoading || isCurrentLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="customer-dashboard applications-history">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="customer-dashboard applications-history">
      <div className="welcome-card">
        <div className="welcome-content">
          <h1>Your applications</h1>
          <p>
            Review your current and past loan applications with Ezfinanz.
          </p>
        </div>
      </div>

      {createError && createError === 'Email must be verified first' ? (
        <section className="application-status-card verification-required-card">
          <span className="workflow-eyebrow">
            Verification required
          </span>

          <h2>Email verification required</h2>

          <p>
            Please verify your email before starting a loan application.
          </p>

          <button
            className="action-button primary"
            type="button"
            onClick={() => navigate('/verify-email')}
          >
            Verify Email
          </button>
        </section>
      ) : (
        createError && (
          <ErrorMessage message={createError} />
        )
      )}
      {withdrawError && <ErrorMessage message={withdrawError} />}

      {applications.length === 0 ? (
        <section
          className="application-status-card empty-application-card"
          aria-labelledby="no-applications-heading"
        >
          <span className="workflow-eyebrow">Applications</span>

          <h2 id="no-applications-heading">
            No applications yet
          </h2>

          <p>
            You don't have any loan applications. Start a new
            application to begin the loan process.
          </p>

          <button
            className="action-button primary"
            type="button"
            onClick={handleStartApplication}
          >
            Start New Application
          </button>
        </section>
      ) : (
        <>
          {!currentApplication && (
            <section className="application-status-card empty-application-card">
              <span className="workflow-eyebrow">
                Get started
              </span>

              <h2>No active application</h2>

              <p>
                You can start a new application. Previous
                applications stay available below for reference.
              </p>

              <button
                className="action-button primary"
                type="button"
                onClick={handleStartApplication}
              >
                Start New Application
              </button>
            </section>
          )}

          <ul className="application-history-list">
            {applications.map((application) => (
              <li key={application.id}>
                <ApplicationHistoryCard
                  application={application}
                  isCurrent={currentApplication?.id === application.id}
                  onContinue={(path) => navigate(path)}
                  onWithdraw={handleWithdraw}
                  onViewDetails={(id) => navigate(`/applications/${id}`)}
                  isWithdrawing={withdrawingId === application.id}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

interface ApplicationHistoryCardProps {
  application: Application;
  isCurrent: boolean;
  onContinue: (path: string) => void;
  onWithdraw: (applicationId: number) => void;
  isWithdrawing: boolean;
  onViewDetails: (applicationId: number) => void;
}

const ApplicationHistoryCard: React.FC<ApplicationHistoryCardProps> = ({
  application,
  isCurrent,
  onContinue,
  onViewDetails,
  onWithdraw,
  isWithdrawing,
}) => {
  const continuePath = isCurrent
    ? getContinuePath(application.currentStage)
    : null;

  const createdDate = formatDate(application.createdAt);
  const updatedDate = formatDate(application.updatedAt);
  const tone = statusTone(application.status);

  const canWithdraw =
    isCurrent &&
    (
      application.status === 'DRAFT' ||
      application.status === 'ELIGIBLE' ||
      application.status === 'PARTIALLY_ELIGIBLE' ||
      application.status === 'SELFIE_PENDING'
    );

  return (
    <article
      className="application-status-card application-history-card"
      aria-labelledby={`application-${application.id}-heading`}
    >
      <div className="status-card-header">
        <div>
          <span className="workflow-eyebrow">
            {isCurrent ? 'Current application' : 'Past application'}
          </span>

          <h2 id={`application-${application.id}-heading`}>
            Application #{application.id}
          </h2>
        </div>

        <span className={`status-pill ${tone}`}>
          {formatStatus(application.status)}
        </span>
      </div>

      <div className="status-summary history-summary">
        <div className="summary-item">
          <span className="summary-label">Status</span>
          <span className="summary-value">
            {formatStatus(application.status)}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Current step</span>
          <span className="summary-value">
            {STAGE_LABELS[application.currentStage]}
          </span>
        </div>

        {createdDate && (
          <div className="summary-item">
            <span className="summary-label">Created</span>
            <span className="summary-value">
              {createdDate}
            </span>
          </div>
        )}

        {updatedDate && (
          <div className="summary-item">
            <span className="summary-label">Last updated</span>
            <span className="summary-value">
              {updatedDate}
            </span>
          </div>
        )}
      </div>

      {application.rejectionReason && (
        <div className="rejection-notice">
          <h3>Reason provided</h3>
          <p>{application.rejectionReason}</p>
        </div>
      )}

      {isCurrent && !continuePath && (
        <div className="status-note">
          <h3>No further action needed from you right now</h3>

          <p>
            This application is in{' '}
            {STAGE_LABELS[application.currentStage]}.
            Updates will appear here and on your dashboard.
          </p>
        </div>
      )}

      {!isCurrent && (
        <div className="status-note">
          <h3>Read only</h3>

          <p>
            This application is no longer active. You can
            review its details here.
          </p>
        </div>
      )}

      <div className="application-actions">
        {continuePath && (
          <button
            className="action-button primary"
            type="button"
            onClick={() => onContinue(continuePath)}
            disabled={isWithdrawing}
          >
            Continue Application
          </button>
        )}
        {!isCurrent && (
          <button
            className="action-button"
            type="button"
            onClick={() => onViewDetails(application.id)}
          >
            View Details
          </button>
        )}

        {canWithdraw && (
          <button
            className="action-button"
            type="button"
            onClick={() => onWithdraw(application.id)}
            disabled={isWithdrawing}
          >
            {isWithdrawing
              ? 'Withdrawing...'
              : 'Withdraw Application'}
          </button>
        )}
      </div>
    </article>
  );
};
