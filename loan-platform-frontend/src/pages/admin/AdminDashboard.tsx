import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/adminApi';
import { ApplicationList } from './ApplicationList';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loading } from '../../components/common/Loading';

import type { AdminApplication } from '../../types/admin';

import '../../styles/admin.css';

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'Applications could not be loaded. Please try again.';
  }

  switch (error.response?.status) {
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to view customer applications.';
    case 404:
      return 'The applications service could not be found.';
    case 500:
      return 'The applications service is temporarily unavailable.';
    default:
      return 'Applications could not be loaded. Please try again.';
  }
};

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await adminApi.getApplications();

      setApplications(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const totalApplications = applications.length;

  const pendingReview = applications.filter(
    (application) =>
      application.status === 'WAITING_FOR_ADMIN_REVIEW'
  ).length;

  const approved = applications.filter(
    (application) =>
      application.status === 'APPROVED'
  ).length;

  const rejected = applications.filter(
    (application) =>
      application.status === 'REJECTED'
  ).length;

  const disbursed = applications.filter(
    (application) =>
      application.status === 'DISBURSED'
  ).length;

  if (isLoading) {
    return <Loading message="Loading applications..." />;
  }

  if (error) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <ErrorMessage message={error} />

          <button
            className="admin-button"
            type="button"
            onClick={loadApplications}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">
            Operations
          </span>

          <h1>Application review</h1>

          <p>
            Review customer applications and update their
            status when appropriate.
          </p>
        </div>

        <div className="admin-user-section">
          <span>
            Signed in as {user?.email}
          </span>

          <button
            type="button"
            className="admin-button secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* =========================
          APPLICATION STATISTICS
          ========================= */}

      <section
        className="admin-stats"
        aria-label="Application statistics"
      >
        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Total Applications
          </span>

          <strong className="admin-stat-value">
            {totalApplications}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Pending Review
          </span>

          <strong className="admin-stat-value">
            {pendingReview}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Approved
          </span>

          <strong className="admin-stat-value">
            {approved}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Rejected
          </span>

          <strong className="admin-stat-value">
            {rejected}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Disbursed
          </span>

          <strong className="admin-stat-value">
            {disbursed}
          </strong>
        </div>
      </section>

      <ApplicationList
        applications={applications}
        onRefresh={loadApplications}
      />
    </main>
  );
};