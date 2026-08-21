import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { applicationApi } from '../../api/applicationApi';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { StatusBadge } from '../../components/common/StatusBadge';

import type {
  Application,
  ApplicationStage,
  ApplicationStatus,
} from '../../types/application';

import '../../styles/CustomerDashboard.css';

const stageLabels: Record<ApplicationStage, string> = {
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

const statusLabels: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  ELIGIBLE: 'Eligible',
  PARTIALLY_ELIGIBLE: 'Partially Eligible',
  NOT_ELIGIBLE: 'Not Eligible',
  SELFIE_PENDING: 'Selfie Pending',
  WAITING_FOR_ADMIN_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  DISBURSED: 'Disbursed',
  WITHDRAWN: 'Withdrawn',
  IN_PROGRESS: 'In Progress',
};

const formatDate = (value?: string): string => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString();
};

const getStatusVariant = (
  status: ApplicationStatus
): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'APPROVED':
    case 'DISBURSED':
    case 'ELIGIBLE':
      return 'success';

    case 'REJECTED':
    case 'NOT_ELIGIBLE':
    case 'WITHDRAWN':
      return 'error';

    case 'WAITING_FOR_ADMIN_REVIEW':
    case 'SELFIE_PENDING':
      return 'warning';

    case 'PARTIALLY_ELIGIBLE':
      return 'info';

    default:
      return 'default';
  }
};

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'Unable to load this application.';
  }

  switch (error.response?.status) {
    case 401:
      return 'Your session has expired. Please sign in again.';

    case 403:
      return 'You are not allowed to view this application.';

    case 404:
      return 'Application not found.';

    default:
      return 'Unable to load this application. Please try again.';
  }
};

export const CustomerApplicationDetails: React.FC = () => {
  const { applicationId } =
    useParams<{ applicationId: string }>();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadApplication = async () => {
      const id = Number(applicationId);

      if (!Number.isInteger(id) || id <= 0) {
        setError('Invalid application ID.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result =
          await applicationApi.getApplication(id);

        setApplication(result);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    void loadApplication();
  }, [applicationId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !application) {
    return (
      <main className="customer-dashboard">
        <ErrorMessage
          message={error ?? 'Application not found.'}
        />

        <Link to="/applications">
          Back to Applications
        </Link>
      </main>
    );
  }

  return (
    <main className="customer-dashboard">

      <div style={{ marginBottom: '20px' }}>
        <Link to="/applications">
          ← Back to Applications
        </Link>
      </div>

      <section className="application-status-card">

        <div className="status-card-header">

          <div>
            <span className="workflow-eyebrow">
              Loan Application
            </span>

            <h1>
              Application #{application.id}
            </h1>
          </div>

          <StatusBadge
            status={statusLabels[application.status]}
            variant={getStatusVariant(application.status)}
          />

        </div>

        <div className="status-summary">

          <div className="summary-item">
            <span className="summary-label">
              Status
            </span>

            <span className="summary-value">
              {statusLabels[application.status]}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              Current Stage
            </span>

            <span className="summary-value">
              {stageLabels[application.currentStage]}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              Created
            </span>

            <span className="summary-value">
              {formatDate(application.createdAt)}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              Last Updated
            </span>

            <span className="summary-value">
              {formatDate(application.updatedAt)}
            </span>
          </div>

        </div>

      </section>

      {application.kyc && (
        <section className="application-status-card">

          <div className="status-card-header">
            <div>
              <span className="workflow-eyebrow">
                KYC
              </span>

              <h2>Personal Information</h2>
            </div>
          </div>

          <div className="status-summary">

            <div className="summary-item">
              <span className="summary-label">
                Full Name
              </span>

              <span className="summary-value">
                {application.kyc.fullName}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                Date of Birth
              </span>

              <span className="summary-value">
                {application.kyc.dateOfBirth}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                Gender
              </span>

              <span className="summary-value">
                {application.kyc.gender}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                Address
              </span>

              <span className="summary-value">
                {application.kyc.address}
              </span>
            </div>

          </div>

        </section>
      )}

      {application.eligibility && (
        <section className="application-status-card">

          <div className="status-card-header">
            <div>
              <span className="workflow-eyebrow">
                Eligibility
              </span>

              <h2>Eligibility Result</h2>
            </div>
          </div>

          <div className="status-summary">

            <div className="summary-item">
              <span className="summary-label">
                Result
              </span>

              <span className="summary-value">
                {application.eligibility.eligible
                  ? 'Eligible'
                  : 'Not Eligible'}
              </span>
            </div>

            {application.eligibility.message && (
              <div className="summary-item">
                <span className="summary-label">
                  Message
                </span>

                <span className="summary-value">
                  {application.eligibility.message}
                </span>
              </div>
            )}

          </div>

        </section>
      )}

      {application.emi !=null && (
        <section className="application-status-card">

          <div className="status-card-header">
            <div>
              <span className="workflow-eyebrow">
                EMI
              </span>

              <h2>Loan Calculation</h2>
            </div>
          </div>

          <div className="status-summary">

            <div className="summary-item">
              <span className="summary-label">
                Monthly EMI
              </span>

              <span className="summary-value">
                ₹{application.emi.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                Total Interest
              </span>

              <span className="summary-value">
                ₹{application.totalInterest?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                Total Repayment
              </span>

              <span className="summary-value">
                ₹{application.totalRepayment?.toLocaleString('en-IN')}
              </span>
            </div>

          </div>

        </section>
      )}

      {application.rejectionReason && (
        <section className="application-status-card">

          <div className="status-card-header">
            <div>
              <span className="workflow-eyebrow">
                Application Decision
              </span>

              <h2>Rejected</h2>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              Reason
            </span>

            <span className="summary-value">
              {application.rejectionReason}
            </span>
          </div>

        </section>
      )}

    </main>
  );
};
