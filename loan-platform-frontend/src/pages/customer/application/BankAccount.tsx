import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';
import type { Application, BankAccountData } from '../../../types/application';

const initialForm: BankAccountData = {
  accountHolderName: '',
  accountNumber: '',
  ifsc: '',
  bankName: '',
};

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'We could not submit your bank details. Please try again.';
  }

  switch (error.response?.status) {
    case 400:
      return 'Please check your bank details and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to update bank details for this application.';
    case 404:
      return 'The current application could not be found.';
    default:
      return error.response && error.response.status >= 500
        ? 'The bank account service is temporarily unavailable. Please try again later.'
        : 'We could not submit your bank details. Please try again.';
  }
};

const validateForm = (form: BankAccountData): string | null => {
  if (!form.accountHolderName.trim()) return 'Enter the account holder name.';
  if (!form.accountNumber.trim() || !/^\d+$/.test(form.accountNumber.trim())) {
    return 'Enter a valid account number using digits only.';
  }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) {
    return 'Enter a valid IFSC code, such as ABCD0123456.';
  }
  if (!form.bankName.trim()) return 'Enter the bank name.';
  return null;
};

export const BankAccount: React.FC = () => {
  const navigate = useNavigate();
  const { application, isLoading: isApplicationLoading, refetch } = useApplication();
  const [form, setForm] = useState<BankAccountData>(initialForm);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [submittedAccountLastFour, setSubmittedAccountLastFour] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof BankAccountData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!application) {
      setError('No active application was found. Return to the dashboard and try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedApplication = await applicationApi.submitBankAccount(application.id, {
        accountHolderName: form.accountHolderName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifsc: form.ifsc.trim().toUpperCase(),
        bankName: form.bankName.trim(),
      });
      await refetch();
      setSubmittedAccountLastFour(form.accountNumber.trim().slice(-4));
      setSubmittedApplication(updatedApplication);
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplicationLoading) return <Loading />;

  if (submittedApplication && submittedAccountLastFour) {
    return (
      <main className="workflow-page">
        <section className="workflow-card workflow-result" aria-live="polite">
          <span className="workflow-eyebrow">Bank details submitted</span>
          <h1>Your bank account was saved</h1>
          <p>
            The account ending in {submittedAccountLastFour} is associated with your application.
            Your account number is not displayed here.
          </p>
          <p className="workflow-result-next">
            Your application has moved to the next backend stage.
          </p>
          <button type="button" className="btn btn-primary workflow-submit" onClick={() => navigate('/application/declaration')}>
            Continue to NextStep.
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="workflow-page">
      <section className="workflow-card">
        <button type="button" className="workflow-back" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </button>

        <header className="workflow-header">
          <span className="workflow-eyebrow">Bank account</span>
          <h1>Add your bank details</h1>
          <p>We use these details to send approved funds to the right account.</p>
        </header>

        <section className="workflow-info" aria-labelledby="bank-help-heading">
          <h2 id="bank-help-heading">Before you start</h2>
          <p>The account must belong to you. Make sure the name, account number, IFSC, and bank name match your bank records.</p>
          <p>We use this information for disbursement and account verification. We do not store it in browser local storage.</p>
        </section>

        {error && <ErrorMessage message={error} />}

        <form className="workflow-form" onSubmit={handleSubmit}>
          <label className="workflow-field workflow-field-wide">
            Account holder name <span aria-hidden="true">*</span>
            <input
              required
              value={form.accountHolderName}
              onChange={(event) => updateField('accountHolderName', event.target.value)}
              disabled={isSubmitting}
              autoComplete="name"
            />
          </label>

          <label className="workflow-field">
            Account number <span aria-hidden="true">*</span>
            <input
              required
              inputMode="numeric"
              value={form.accountNumber}
              onChange={(event) => updateField('accountNumber', event.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
            />
          </label>

          <label className="workflow-field">
            IFSC code <span aria-hidden="true">*</span>
            <input
              required
              value={form.ifsc}
              onChange={(event) => updateField('ifsc', event.target.value.toUpperCase())}
              disabled={isSubmitting}
              autoComplete="off"
              maxLength={11}
            />
          </label>

          <label className="workflow-field workflow-field-wide">
            Bank name <span aria-hidden="true">*</span>
            <input
              required
              value={form.bankName}
              onChange={(event) => updateField('bankName', event.target.value)}
              disabled={isSubmitting}
              autoComplete="organization"
            />
          </label>

          <button className="btn btn-primary workflow-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit bank details'}
          </button>
        </form>
      </section>
    </main>
  );
};
