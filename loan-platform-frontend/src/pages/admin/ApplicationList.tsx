import { Link } from 'react-router-dom';

import { StatusBadge } from '../../components/common/StatusBadge';

import type { AdminApplication } from '../../types/admin';

import '../../styles/admin.css';

interface ApplicationListProps {
  applications: AdminApplication[];
  onRefresh: () => Promise<void>;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onRefresh,
}) => {
  return (
    <section
      className="admin-panel"
      aria-labelledby="applications-heading"
    >
      <div className="admin-panel-header">
        <div>
          <h2 id="applications-heading">
            Customer applications
          </h2>

          <p>
            {applications.length}{' '}
            application
            {applications.length === 1 ? '' : 's'} available.
          </p>
        </div>

        <button
          className="admin-button secondary"
          type="button"
          onClick={() => {
            void onRefresh();
          }}
        >
          Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="admin-empty">
          There are no customer applications to review right now.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => {
                const isAwaitingReview =
                  application.status ===
                  'WAITING_FOR_ADMIN_REVIEW';

                return (
                  <tr key={application.applicationId}>
                    <td>
                      #{application.applicationId}
                    </td>

                    <td>
                      <div>
                        <strong>
                          {application.applicantName ||
                            'Customer'}
                        </strong>

                        <div>
                          {application.applicantEmail}
                        </div>
                      </div>
                    </td>

                    <td>
                      {application.applicantPhone ||
                        'Not provided'}
                    </td>

                    <td>
                      {application.requestedAmount != null
                        ? new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(
                            application.requestedAmount
                          )
                        : 'Not provided'}
                    </td>

                    <td>
                      {application.currentStage.replace(
                        /_/g,
                        ' '
                      )}
                    </td>

                    <td>
                      <StatusBadge
                        status={application.status}
                      />
                    </td>

                    <td>
                      {application.updatedAt
                        ? new Date(
                            application.updatedAt
                          ).toLocaleDateString()
                        : 'Not provided'}
                    </td>

                    <td>
                      <Link
                        className="admin-link"
                        to={`/admin/applications/${application.applicationId}`}
                      >
                        {isAwaitingReview
                          ? 'Review'
                          : 'View details'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};