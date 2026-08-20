import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { adminApi } from '../../api/adminApi';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loading } from '../../components/common/Loading';
import { StatusBadge } from '../../components/common/StatusBadge';

import type {
  AdminApplicationDetail,
  Application,
} from '../../types/application';

import '../../styles/admin.css';

// =========================================================
// ERROR HANDLING
// =========================================================

const getErrorMessage = (
  error: unknown,
  action = 'load this application'
): string => {

  if (!isAxiosError(error)) {
    return `We could not ${action}. Please try again.`;
  }

  switch (error.response?.status) {

    case 400:
      return 'The request could not be completed. Please check the application and try again.';

    case 401:
      return 'Your session has expired. Please sign in again.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'This application could not be found.';

    case 409:
      return 'The application has changed. Refresh and review the current status.';

    case 500:
      return 'The application service is temporarily unavailable.';

    default:
      return `We could not ${action}. Please try again.`;
  }
};


// =========================================================
// REVIEW CONDITIONS
// =========================================================

const canReview = (
  application: AdminApplicationDetail
): boolean =>
  application.status === 'WAITING_FOR_ADMIN_REVIEW';


const canDisburse = (
  application: AdminApplicationDetail
): boolean =>
  application.currentStage === 'DISBURSEMENT' &&
  application.status === 'APPROVED';


// =========================================================
// COMPONENT
// =========================================================

export const ApplicationDetails: React.FC = () => {

  const { applicationId } =
    useParams<{ applicationId: string }>();

  // =========================================================
  // STATE
  // =========================================================

  const [application, setApplication] =
    useState<AdminApplicationDetail | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isActing, setIsActing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [rejectReason, setRejectReason] =
    useState('');

  const [isRejecting, setIsRejecting] =
    useState(false);

  const [kycDocumentUrl, setKycDocumentUrl] =
    useState<string | null>(null);

  const [selfieUrl, setSelfieUrl] =
    useState<string | null>(null);

  const [isLoadingKycDocument, setIsLoadingKycDocument] =
    useState(false);

  const [isLoadingSelfie, setIsLoadingSelfie] =
    useState(false);

  const [kycDocumentError, setKycDocumentError] =
    useState<string | null>(null);

  const [selfieError, setSelfieError] =
    useState<string | null>(null);

  const [isVerifyingKyc, setIsVerifyingKyc] =
    useState(false);

  const [isKycRejectModalOpen, setIsKycRejectModalOpen] =
    useState(false);

  const [isRejectingKyc, setIsRejectingKyc] =
    useState(false);

  const [kycRejectReason, setKycRejectReason] =
    useState('');

  // =========================================================
  // PARSE APPLICATION ID
  // =========================================================

  const parsedId =
    applicationId
      ? Number(applicationId)
      : NaN;


  // =========================================================
  // LOAD APPLICATION
  // =========================================================

  const loadApplication = async () => {

    if (
      !Number.isInteger(parsedId) ||
      parsedId <= 0
    ) {

      setError(
        'This application link is invalid.'
      );

      setIsLoading(false);

      return;
    }

    try {

      setIsLoading(true);
      setError(null);

      const loadedApplication =
        await adminApi.getApplicationDetails(
          parsedId
        );

      setApplication(
        loadedApplication
      );

    } catch (loadError) {

      setError(
        getErrorMessage(loadError)
      );

    } finally {

      setIsLoading(false);
    }
  };


  // =========================================================
  // LOAD KYC DOCUMENT
  // =========================================================

  const loadKycDocument = async () => {

    if (
      !Number.isInteger(parsedId) ||
      parsedId <= 0
    ) {
      return;
    }

    // No point calling the endpoint when backend says
    // there is no KYC document.

    if (
      !application?.kyc?.documentUploaded
    ) {

      setKycDocumentUrl(null);

      return;
    }

    try {

      setIsLoadingKycDocument(true);
      setKycDocumentError(null);

      const url =
        await adminApi.getKycDocument(
          parsedId
        );

      setKycDocumentUrl(url);

    } catch (documentLoadError) {

      setKycDocumentUrl(null);

      setKycDocumentError(
        getErrorMessage(
          documentLoadError,
          'load the KYC document'
        )
      );

    } finally {

      setIsLoadingKycDocument(false);
    }
  };


  // =========================================================
  // LOAD SELFIE
  // =========================================================

  const loadSelfie = async () => {

    if (
      !Number.isInteger(parsedId) ||
      parsedId <= 0
    ) {
      return;
    }

    // No selfie path means there is no reason to
    // call the protected file endpoint.

    if (!application?.selfiePath) {

      setSelfieUrl(null);

      return;
    }

    try {

      setIsLoadingSelfie(true);
      setSelfieError(null);

      const url =
        await adminApi.getSelfie(
          parsedId
        );

      setSelfieUrl(url);

    } catch (selfieLoadError) {

      setSelfieUrl(null);

      setSelfieError(
        getErrorMessage(
          selfieLoadError,
          'load the selfie'
        )
      );

    } finally {

      setIsLoadingSelfie(false);
    }
  };


  // =========================================================
  // INITIAL APPLICATION LOAD
  // =========================================================

  useEffect(() => {

    let active = true;

    const load = async () => {

      if (
        !Number.isInteger(parsedId) ||
        parsedId <= 0
      ) {

        if (active) {

          setError(
            'This application link is invalid.'
          );

          setIsLoading(false);
        }

        return;
      }

      try {

        setIsLoading(true);
        setError(null);

        const loadedApplication =
          await adminApi.getApplicationDetails(
            parsedId
          );

        if (active) {

          setApplication(
            loadedApplication
          );
        }

      } catch (loadError) {

        if (active) {

          setError(
            getErrorMessage(loadError)
          );
        }

      } finally {

        if (active) {

          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };

  }, [applicationId, parsedId]);


  // =========================================================
  // LOAD DOCUMENTS AFTER APPLICATION LOAD
  // =========================================================

  useEffect(() => {

    if (!application) {
      return;
    }

    void loadKycDocument();
    void loadSelfie();

    return () => {

      if (kycDocumentUrl) {

        URL.revokeObjectURL(
          kycDocumentUrl
        );
      }

      if (selfieUrl) {

        URL.revokeObjectURL(
          selfieUrl
        );
      }
    };

  }, [application]);


  // =========================================================
  // CLEANUP WHEN PAGE UNMOUNTS
  // =========================================================

  useEffect(() => {

    return () => {

      if (kycDocumentUrl) {

        URL.revokeObjectURL(
          kycDocumentUrl
        );
      }

      if (selfieUrl) {

        URL.revokeObjectURL(
          selfieUrl
        );
      }
    };

  }, []);


  // =========================================================
  // RUN ACTION
  // =========================================================

  const runAction = async (
    action: () => Promise<Application>,
    message: string
  ) => {

    try {

      setIsActing(true);
      setError(null);

      await action();

      // Important:
      // Approve/reject/disburse return LoanApplication,
      // not AdminApplicationDetail.
      //
      // Therefore reload the admin detail DTO after action.

      const refreshedApplication =
        await adminApi.getApplicationDetails(
          parsedId
        );

      setApplication(
        refreshedApplication
      );

    } catch (actionError) {

      setError(
        getErrorMessage(
          actionError,
          message
        )
      );

    } finally {

      setIsActing(false);
    }
  };


  // =========================================================
  // APPROVE
  // =========================================================

  const handleApprove = async () => {

    if (
      !application ||
      !window.confirm(
        'Approve this application?'
      )
    ) {
      return;
    }

    await runAction(

      () =>
        adminApi.approveApplication(
          application.applicationId
        ),

      'approve this application'
    );
  };


  // =========================================================
  // REJECT
  // =========================================================

  const handleReject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (
      !application ||
      !rejectReason.trim()
    ) {
      return;
    }

    await runAction(

      () =>
        adminApi.rejectApplication(
          application.applicationId,
          rejectReason.trim()
        ),

      'reject this application'
    );

    setIsRejecting(false);
    setRejectReason('');
  };


  // =========================================================
  // DISBURSE
  // =========================================================

  const handleDisburse = async () => {

    if (
      !application ||
      !window.confirm(
        'Mark this application for disbursement?'
      )
    ) {
      return;
    }

    await runAction(

      () =>
        adminApi.disburseApplication(
          application.applicationId
        ),

      'disburse this application'
    );
  };

  // =========================================================
  // VERIFY KYC
  // =========================================================

  const handleVerifyKyc = async () => {

    if (
      !application ||
      !application.kyc
    ) {
      return;
    }

    if (
      !application.kyc.documentUploaded
    ) {
      return;
    }

    if (
      !window.confirm(
        'Confirm that the KYC document details match the information entered by the customer?'
      )
    ) {
      return;
    }

    try {

      setIsVerifyingKyc(true);
      setError(null);

      const updatedApplication =
        await adminApi.verifyKyc(
          application.applicationId
        );

      setApplication(
        updatedApplication
      );

    } catch (verificationError) {

      setError(
        getErrorMessage(
          verificationError,
          'verify the KYC'
        )
      );

    } finally {

      setIsVerifyingKyc(false);
    }
  };


  // =========================================================
  // REJECT KYC
  // =========================================================
  const handleRejectKyc = async () => {

    if (
      !application ||
      !kycRejectReason.trim()
    ) {
      return;
    }

    try {

      setIsRejectingKyc(true);
      setError(null);

      const updatedApplication =
        await adminApi.rejectKyc(
          application.applicationId,
          kycRejectReason.trim()
        );

      // Update application with backend response
      setApplication(updatedApplication);

      // Clear the reason
      setKycRejectReason('');

      // Close modal ONLY after successful rejection
      setIsKycRejectModalOpen(false);

    } catch (verificationError) {

      setError(
        getErrorMessage(
          verificationError,
          'reject the KYC'
        )
      );

      // IMPORTANT:
      // Do not close the modal.
      // Do not clear kycRejectReason.
      // User can fix/retry the rejection.

    } finally {

      setIsRejectingKyc(false);
    }
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {

    await loadApplication();

    // Application state updates asynchronously.
    // The document/selfie effects will reload the
    // resources after the new application arrives.
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {

    return (
      <Loading
        message="Loading application details..."
      />
    );
  }


  // =========================================================
  // APPLICATION NOT FOUND
  // =========================================================

  if (!application) {

    return (
      <main className="admin-page">

        <section className="admin-panel">

          <ErrorMessage
            message={
              error ||
              'Application unavailable.'
            }
          />

          <button
            className="admin-button"
            type="button"
            onClick={loadApplication}
          >
            Try again
          </button>

        </section>

      </main>
    );
  }


  // =========================================================
  // DERIVED STATE
  // =========================================================

  const hasKyc =
    Boolean(application.kyc);

  const hasKycDocument =
    Boolean(kycDocumentUrl);

  const hasSelfie =
    Boolean(selfieUrl);


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="admin-detail-topbar">

        <Link
          className="admin-link"
          to="/admin/applications"
        >
          Back to applications
        </Link>

        <button
          className="admin-button secondary"
          type="button"
          onClick={() => {
            void handleRefresh();
          }}
        >
          Refresh
        </button>

      </div>


      {/* =====================================================
          APPLICATION HEADER
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Application #{application.applicationId}
            </span>

            <h1>
              Application details
            </h1>

          </div>

          <StatusBadge
            status={application.status}
          />

        </div>

        {error && (
          <ErrorMessage
            message={error}
          />
        )}


        {/* ===================================================
            APPLICATION SUMMARY
        =================================================== */}

        <div className="admin-detail-grid">

          <div>

            <span>
              Application ID
            </span>

            <strong>
              #{application.applicationId}
            </strong>

          </div>


          <div>

            <span>
              User ID
            </span>

            <strong>
              #{application.userId}
            </strong>

          </div>


          <div>

            <span>
              Current stage
            </span>

            <strong>
              {application.currentStage.replace(
                /_/g,
                ' '
              )}
            </strong>

          </div>


          <div>

            <span>
              Created
            </span>

            <strong>
              {application.createdAt
                ? new Date(
                    application.createdAt
                  ).toLocaleString()
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Last updated
            </span>

            <strong>
              {application.updatedAt
                ? new Date(
                    application.updatedAt
                  ).toLocaleString()
                : 'Not provided'}
            </strong>

          </div>

        </div>


        {/* ===================================================
            REJECTION
        =================================================== */}

        {application.rejectionReason && (

          <div className="admin-rejection">

            <strong>
              Rejection reason
            </strong>

            <p>
              {application.rejectionReason}
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          CUSTOMER INFORMATION
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Customer
            </span>

            <h2>
              Customer information
            </h2>

          </div>

        </div>


        <div className="admin-detail-grid">

          <div>

            <span>
              Email
            </span>

            <strong>
              {application.email || 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Phone
            </span>

            <strong>
              {application.phone || 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Email verified
            </span>

            <strong>
              {application.emailVerified
                ? 'Yes'
                : 'No'}
            </strong>

          </div>


          <div>

            <span>
              Phone verified
            </span>

            <strong>
              {application.phoneVerified
                ? 'Yes'
                : 'No'}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          KYC INFORMATION
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Identity verification
            </span>

            <h2>
              KYC information
            </h2>

          </div>

        </div>


        {hasKyc ? (

          <div className="admin-detail-grid">

            <div>

              <span>
                Full name
              </span>

              <strong>
                {application.kyc?.fullName ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                Date of birth
              </span>

              <strong>
                {application.kyc?.dateOfBirth ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                Gender
              </span>

              <strong>
                {application.kyc?.gender ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                ID type
              </span>

              <strong>
                {application.kyc?.idType ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                ID number
              </span>

              <strong>
                {application.kyc?.idNumber ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                Address
              </span>

              <strong>
                {application.kyc?.address ||
                  'Not provided'}
              </strong>

            </div>


            <div>

              <span>
                Document uploaded
              </span>

              <strong>
                {application.kyc?.documentUploaded
                  ? 'Yes'
                  : 'No'}
              </strong>

            </div>


            <div>

              <span>
                Document uploaded at
              </span>

              <strong>
                {application.kyc?.documentUploadedAt
                  ? new Date(
                      application.kyc.documentUploadedAt
                    ).toLocaleString()
                  : 'Not provided'}
              </strong>

            </div>
            <div className="admin-kyc-verification">

              <div className="admin-kyc-status-row">

                <span>
                  Verification status
                </span>

                <strong
                  className={
                    `admin-kyc-status ` +
                    `admin-kyc-status-${(
                      application.kyc?.verificationStatus || 'PENDING'
                    ).toLowerCase()}`
                  }
                >
                  {(
                    application.kyc?.verificationStatus ||
                    'PENDING'
                  ).replace('_', ' ')}
                </strong>

              </div>

              {application.kyc?.verifiedAt && (
                <div className="admin-kyc-status-row">

                  <span>
                    Verified at
                  </span>

                  <strong>
                    {new Date(
                      application.kyc.verifiedAt
                    ).toLocaleString()}
                  </strong>

                </div>
              )}

              {application.kyc?.verificationReason && (
                <div className="admin-kyc-reason">

                  <strong>
                    Verification note
                  </strong>

                  <p>
                    {application.kyc.verificationReason}
                  </p>

                </div>
              )}

              {application.kyc?.verificationStatus !== 'VERIFIED' && (
                <div className="admin-actions admin-kyc-actions">

                  <button
                    type="button"
                    className="admin-button accent"
                    onClick={() => {
                      void handleVerifyKyc();
                    }}
                    disabled={
                      isVerifyingKyc ||
                      isRejectingKyc ||
                      !application.kyc?.documentUploaded
                    }
                  >
                    {isVerifyingKyc
                      ? 'Verifying...'
                      : 'Verify KYC'}
                  </button>

                  <button
                    type="button"
                    className="admin-button danger"
                    onClick={() => {
                      setKycRejectReason('');
                      setIsKycRejectModalOpen(true);
                    }}
                    disabled={
                      isVerifyingKyc ||
                      isRejectingKyc
                    }
                  >
                    Reject KYC
                  </button>

                </div>
              )}

            </div>

          </div>

        ) : (

          <div className="admin-warning">

            <strong>
              KYC information missing
            </strong>

            <p>
              No KYC information is available
              for this application.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          KYC DOCUMENT
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Identity verification
            </span>

            <h2>
              KYC document
            </h2>

          </div>

        </div>


        {isLoadingKycDocument ? (

          <Loading
            message="Loading KYC document..."
          />

        ) : kycDocumentError ? (

          <div className="admin-warning">

            <strong>
              KYC document unavailable
            </strong>

            <p>
              {kycDocumentError}
            </p>

          </div>

        ) : hasKycDocument ? (

          <div className="admin-document-viewer">

            <iframe
              src={kycDocumentUrl || undefined}
              title="Customer KYC document"
              className="admin-document-frame"
            />

            <div className="admin-actions">

              <a
                href={kycDocumentUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-button secondary"
              >
                Open document
              </a>

            </div>

          </div>

        ) : (

          <div className="admin-warning">

            <strong>
              KYC document missing
            </strong>

            <p>
              The customer has not uploaded
              the required identity document.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          LOAN INFORMATION
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Loan
            </span>

            <h2>
              Loan information
            </h2>

          </div>

        </div>


        <div className="admin-detail-grid">

          <div>

            <span>
              Requested amount
            </span>

            <strong>
              {application.requestedAmount !== null &&
              application.requestedAmount !== undefined
                ? `₹${application.requestedAmount.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Tenure
            </span>

            <strong>
              {application.tenure !== null &&
              application.tenure !== undefined
                ? `${application.tenure} months`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Monthly income
            </span>

            <strong>
              {application.monthlyIncome !== null &&
              application.monthlyIncome !== undefined
                ? `₹${application.monthlyIncome.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Existing debt
            </span>

            <strong>
              {application.existingDebt !== null &&
              application.existingDebt !== undefined
                ? `₹${application.existingDebt.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              CIBIL score
            </span>

            <strong>
              {application.cibilScore ??
                'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Debt-to-income ratio
            </span>

            <strong>
              {application.debtToIncomeRatio !== null &&
              application.debtToIncomeRatio !== undefined
                ? application.debtToIncomeRatio
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Employer
            </span>

            <strong>
              {application.employerName ||
                'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Designation
            </span>

            <strong>
              {application.designation ||
                'Not provided'}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          LOAN CALCULATION
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Financial calculation
            </span>

            <h2>
              Loan calculation
            </h2>

          </div>

        </div>


        <div className="admin-detail-grid">

          <div>

            <span>
              Interest rate
            </span>

            <strong>
              {application.interestRate !== null &&
              application.interestRate !== undefined
                ? `${application.interestRate}%`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              EMI
            </span>

            <strong>
              {application.emi !== null &&
              application.emi !== undefined
                ? `₹${application.emi.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Total interest
            </span>

            <strong>
              {application.totalInterest !== null &&
              application.totalInterest !== undefined
                ? `₹${application.totalInterest.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Total repayment
            </span>

            <strong>
              {application.totalRepayment !== null &&
              application.totalRepayment !== undefined
                ? `₹${application.totalRepayment.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Processing fee
            </span>

            <strong>
              {application.processingFee !== null &&
              application.processingFee !== undefined
                ? `₹${application.processingFee.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              GST
            </span>

            <strong>
              {application.gst !== null &&
              application.gst !== undefined
                ? `₹${application.gst.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Total charges
            </span>

            <strong>
              {application.totalCharges !== null &&
              application.totalCharges !== undefined
                ? `₹${application.totalCharges.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              Net disbursement
            </span>

            <strong>
              {application.netDisbursement !== null &&
              application.netDisbursement !== undefined
                ? `₹${application.netDisbursement.toLocaleString('en-IN')}`
                : 'Not provided'}
            </strong>

          </div>


          <div>

            <span>
              IRR
            </span>

            <strong>
              {application.irr !== null &&
              application.irr !== undefined
                ? `${application.irr}%`
                : 'Not provided'}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          DECLARATION
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Declaration
            </span>

            <h2>
              Customer declaration
            </h2>

          </div>

        </div>


        <div className="admin-detail-grid">

          <div>

            <span>
              Declaration accepted
            </span>

            <strong>
              {application.declarationAccepted
                ? 'Yes'
                : 'No'}
            </strong>

          </div>


          <div>

            <span>
              Accepted at
            </span>

            <strong>
              {application.declarationAcceptedAt
                ? new Date(
                    application.declarationAcceptedAt
                  ).toLocaleString()
                : 'Not provided'}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          SELFIE
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Identity verification
            </span>

            <h2>
              Customer selfie
            </h2>

          </div>

        </div>


        {isLoadingSelfie ? (

          <Loading
            message="Loading selfie..."
          />

        ) : selfieError ? (

          <div className="admin-warning">

            <strong>
              Selfie unavailable
            </strong>

            <p>
              {selfieError}
            </p>

          </div>

        ) : hasSelfie ? (

          <div className="admin-selfie-container">

            <img
              src={selfieUrl || undefined}
              alt="Customer selfie"
              className="admin-selfie"
            />

            <div className="admin-actions">

              <a
                href={selfieUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-button secondary"
              >
                Open selfie
              </a>

            </div>

          </div>

        ) : (

          <div className="admin-warning">

            <strong>
              Selfie missing
            </strong>

            <p>
              The customer has not submitted
              the required selfie.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          REVIEW ACTIONS
      ===================================================== */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <span className="admin-eyebrow">
              Decision
            </span>

            <h2>
              Application decision
            </h2>

          </div>

        </div>


        <div className="admin-actions">

          {canReview(application) && (

            <button
              className="admin-button"
              type="button"
              onClick={handleApprove}
              disabled={isActing}
            >
              Approve
            </button>

          )}


          {canReview(application) && (

            <button
              className="admin-button danger"
              type="button"
              onClick={() =>
                setIsRejecting(true)
              }
              disabled={isActing}
            >
              Reject
            </button>

          )}


          {canDisburse(application) && (

            <button
              className="admin-button accent"
              type="button"
              onClick={handleDisburse}
              disabled={isActing}
            >
              Disburse
            </button>

          )}


          {isActing && (

            <span className="admin-action-status">
              Updating application...
            </span>

          )}

        </div>

      </section>


      {/* =====================================================
          REJECTION DIALOG
      ===================================================== */}

      {isRejecting && (

        <div
          className="admin-dialog-backdrop"
          role="presentation"
        >

          <section
            className="admin-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-heading"
          >

            <h2 id="reject-heading">
              Reject application
            </h2>

            <p>
              Provide a reason that can be kept
              with the application record.
            </p>


            <form onSubmit={handleReject}>

              <label className="admin-field">

                Reason

                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(event) =>
                    setRejectReason(
                      event.target.value
                    )
                  }
                  disabled={isActing}
                />

              </label>


              <div className="admin-dialog-actions">

                <button
                  className="admin-button secondary"
                  type="button"
                  onClick={() =>
                    setIsRejecting(false)
                  }
                  disabled={isActing}
                >
                  Cancel
                </button>


                <button
                  className="admin-button danger"
                  type="submit"
                  disabled={
                    isActing ||
                    !rejectReason.trim()
                  }
                >
                  Confirm rejection
                </button>

              </div>

            </form>

          </section>

        </div>

      )}
       {/* =====================================================
          KYC REJECTION DIALOG
          ===================================================== */}
      {isKycRejectModalOpen && (

        <div
          className="admin-dialog-backdrop"
          role="presentation"
        >

          <section
            className="admin-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kyc-reject-heading"
          >

            <h2 id="kyc-reject-heading">
              Reject KYC
            </h2>

            <p>
              Provide a reason for rejecting the customer's KYC.
            </p>

            <label className="admin-field">

              Reason

              <textarea
                required
                rows={4}
                value={kycRejectReason}
                onChange={(event) =>
                  setKycRejectReason(
                    event.target.value
                  )
                }
                disabled={isRejectingKyc}
                placeholder="Example: Name on document does not match submitted details."
              />

            </label>

            <div className="admin-dialog-actions">

              <button
                className="admin-button secondary"
                type="button"
                onClick={() => {
                  setIsRejectingKyc(false);
                  setKycRejectReason('');
                }}
                disabled={isRejectingKyc}
              >
                Cancel
              </button>

              <button
                className="admin-button danger"
                type="button"
                onClick={() => {
                  void handleRejectKyc();
                }}
                disabled={
                  isRejectingKyc ||
                  !kycRejectReason.trim()
                }
              >
                {isRejectingKyc
                  ? 'Rejecting...'
                  : 'Confirm KYC rejection'}
              </button>

            </div>

          </section>

        </div>
      )}

    </main>
  );
};