import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';

import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';

import type {
  KYCData,
  KYCIdType,
} from '../../../types/application';

import '../../../styles/workflow.css';

const initialForm: KYCData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  idType: 'PAN',
  idNumber: '',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];

const validateForm = (
  form: KYCData,
  document: File | null
): string | null => {

  if (!form.fullName.trim()) {
    return 'Enter your full name.';
  }

  if (!form.dateOfBirth) {
    return 'Enter your date of birth.';
  }

  if (!form.gender.trim()) {
    return 'Enter your gender.';
  }

  if (!form.address.trim()) {
    return 'Enter your current address.';
  }

  if (!form.idType) {
    return 'Select your identity document type.';
  }

  if (!form.idNumber.trim()) {
    return 'Enter your identity document number.';
  }

  if (!document) {
    return 'Upload your identity document.';
  }

  if (!ALLOWED_FILE_TYPES.includes(document.type)) {
    return 'Only PDF, JPG and PNG documents are allowed.';
  }

  if (document.size > MAX_FILE_SIZE) {
    return 'The document must be 5 MB or smaller.';
  }

  return null;
};

const getSafeErrorMessage = (): string => {
  return 'We could not submit your KYC details. Please review the form and try again.';
};

export const Kyc: React.FC = () => {

  const navigate = useNavigate();

  const {
    application,
    isLoading: isApplicationLoading,
    refetch,
  } = useApplication();

  const [form, setForm] =
    useState<KYCData>(initialForm);

  const [document, setDocument] =
    useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // UPDATE FORM
  // =========================================================

  const updateField = (
    field: keyof KYCData,
    value: string
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0] ?? null;

    setDocument(file);
    setError(null);
  };

  // =========================================================
  // SUBMIT KYC
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    const validationError =
      validateForm(form, document);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!application) {
      setError(
        'No active application was found. Return to the dashboard and try again.'
      );
      return;
    }

    if (!document) {
      setError(
        'Please upload your identity document.'
      );
      return;
    }

    try {

      setIsSubmitting(true);
      setError(null);

      // =====================================================
      // SUBMIT KYC + DOCUMENT
      // =====================================================

      await applicationApi.submitKYC(
        application.id,
        form,
        document
      );

      // =====================================================
      // REFRESH APPLICATION
      //
      // Backend has moved the application to
      // ApplicationStage.ELIGIBILITY
      // =====================================================

      await refetch();

      // =====================================================
      // MOVE TO NEXT STAGE
      // =====================================================

      navigate('/application/eligibility');

    } catch (submissionError) {

      console.error(
        'KYC submission failed:',
        submissionError
      );

      setError(
        getSafeErrorMessage()
      );

    } finally {

      setIsSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isApplicationLoading) {
    return <Loading />;
  }

  // =========================================================
  // NO APPLICATION
  // =========================================================

  if (!application) {
    return (
      <main className="workflow-page">

        <section className="workflow-card">

          <ErrorMessage
            message={
              'No active application was found. Return to the dashboard and try again.'
            }
          />

          <button
            type="button"
            className="btn btn-primary workflow-submit"
            onClick={() => navigate('/dashboard')}
          >
            Back to dashboard
          </button>

        </section>

      </main>
    );
  }

  // =========================================================
  // FORM
  // =========================================================

  return (
    <main className="workflow-page">

      <section className="workflow-card">

        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          className="workflow-back"
          onClick={() =>
            navigate('/dashboard')
          }
          disabled={isSubmitting}
        >
          Back to dashboard
        </button>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="workflow-header">

          <span className="workflow-eyebrow">
            KYC verification
          </span>

          <h1>
            Verify your identity
          </h1>

          <p>
            Provide your personal information and
            upload a valid identity document.
          </p>

        </header>

        {/* =====================================================
            INFORMATION
        ===================================================== */}

        <section
          className="workflow-info"
          aria-labelledby="before-start-heading"
        >

          <h2 id="before-start-heading">
            Before you start
          </h2>

          <p>
            Enter the information exactly as it
            appears on your identity document.
          </p>

          <p>
            Accepted document formats:
            PDF, JPG and PNG.
          </p>

          <p>
            Maximum file size: 5 MB.
          </p>

        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <ErrorMessage
            message={error}
          />
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          className="workflow-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* ===================================================
              FULL NAME
          =================================================== */}

          <label className="workflow-field">

            Full name
            <span aria-hidden="true">
              *
            </span>

            <input
              required
              value={form.fullName}
              onChange={(event) =>
                updateField(
                  'fullName',
                  event.target.value
                )
              }
              disabled={isSubmitting}
              autoComplete="name"
            />

          </label>

          {/* ===================================================
              DATE OF BIRTH
          =================================================== */}

          <label className="workflow-field">

            Date of birth
            <span aria-hidden="true">
              *
            </span>

            <input
              required
              type="date"
              value={form.dateOfBirth}
              onChange={(event) =>
                updateField(
                  'dateOfBirth',
                  event.target.value
                )
              }
              disabled={isSubmitting}
            />

          </label>

          {/* ===================================================
              GENDER
          =================================================== */}

          <label className="workflow-field">

            Gender
            <span aria-hidden="true">
              *
            </span>

            <select
              required
              value={form.gender}
              onChange={(event) =>
                updateField(
                  'gender',
                  event.target.value
                )
              }
              disabled={isSubmitting}
            >

              <option value="">
                Select gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

          </label>

          {/* ===================================================
              ADDRESS
          =================================================== */}

          <label
            className="workflow-field workflow-field-wide"
          >

            Address
            <span aria-hidden="true">
              *
            </span>

            <textarea
              required
              rows={4}
              value={form.address}
              onChange={(event) =>
                updateField(
                  'address',
                  event.target.value
                )
              }
              disabled={isSubmitting}
              autoComplete="street-address"
            />

          </label>

          {/* ===================================================
              ID TYPE
          =================================================== */}

          <label className="workflow-field">

            Identity document
            <span aria-hidden="true">
              *
            </span>

            <select
              required
              value={form.idType}
              onChange={(event) =>
                updateField(
                  'idType',
                  event.target.value as KYCIdType
                )
              }
              disabled={isSubmitting}
            >

              <option value="PAN">
                PAN Card
              </option>

              <option value="AADHAAR">
                Aadhaar Card
              </option>

              <option value="DRIVING_LICENSE">
                Driving License
              </option>

              <option value="PASSPORT">
                Passport
              </option>

              <option value="VOTER_ID">
                Voter ID
              </option>

            </select>

          </label>

          {/* ===================================================
              ID NUMBER
          =================================================== */}

          <label className="workflow-field">

            ID number
            <span aria-hidden="true">
              *
            </span>

            <input
              required
              value={form.idNumber}
              onChange={(event) =>
                updateField(
                  'idNumber',
                  event.target.value
                )
              }
              disabled={isSubmitting}
              autoComplete="off"
            />

          </label>

          {/* ===================================================
              DOCUMENT UPLOAD
          =================================================== */}

          <label
            className="workflow-field workflow-field-wide"
          >

            Upload identity document
            <span aria-hidden="true">
              *
            </span>

            <input
              required
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleDocumentChange}
              disabled={isSubmitting}
            />

            <small>
              Upload the selected identity document.
              Maximum size: 5 MB.
            </small>

            {document && (
              <small>
                Selected:{' '}
                <strong>
                  {document.name}
                </strong>
              </small>
            )}

          </label>

          {/* ===================================================
              SUBMIT
          =================================================== */}

          <button
            className="btn btn-primary workflow-submit"
            type="submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? 'Submitting KYC...'
              : 'Submit KYC'}

          </button>

        </form>

      </section>

    </main>
  );
};