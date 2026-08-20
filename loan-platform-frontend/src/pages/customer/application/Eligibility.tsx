import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';
import type { EligibilityData, EligibilityResult } from '../../../types/application';

const initialForm: EligibilityData = {
  monthlyIncome: 0,
  requestedAmount: 0,
  cibilScore: 0,
  existingDebt: 0,
  employerName: '',
  designation: '',
};

const formatInr = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'We could not complete the eligibility check. Please try again.';
  }

  switch (error.response?.status) {
    case 400:
      return 'Please check the financial details and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to check eligibility for this application.';
    case 404:
      return 'The current application could not be found.';
    default:
      return error.response && error.response.status >= 500
        ? 'The eligibility service is temporarily unavailable. Please try again later.'
        : 'We could not complete the eligibility check. Please try again.';
  }
};

const validateForm = (form: EligibilityData): string | null => {
  if (!form.monthlyIncome || form.monthlyIncome < 0) return 'Enter your monthly income in INR.';
  if (!form.requestedAmount || form.requestedAmount < 0) return 'Enter the requested loan amount in INR.';
  if (form.cibilScore < 0) return 'Enter a valid CIBIL score.';
  if (form.existingDebt < 0) return 'Enter existing debt as zero or a positive amount.';
  if (!form.employerName.trim()) return 'Enter your employer name.';
  if (!form.designation.trim()) return 'Enter your designation.';
  return null;
};

export const Eligibility: React.FC = () => {
  const navigate = useNavigate();
  const { application, isLoading: isApplicationLoading, refetch } = useApplication();
  const [form, setForm] = useState<EligibilityData>(initialForm);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof EligibilityData>(field: K, value: EligibilityData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    if (!application) {
      setError('No active application was found. Return to the dashboard and try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const eligibilityResult = await applicationApi.checkEligibility(application.id, form);
      setResult(eligibilityResult);
      await refetch();
    } catch (submissionError) {
      setResult(null);
      setError(getErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplicationLoading) return <Loading />;

  if (result) {
    const eligible = result.eligible;

    return (
      <main className="workflow-page">
        <section
          className={`workflow-card eligibility-result ${
            eligible ? 'eligible' : 'not-eligible'
          }`}
          aria-live="polite"
        >
          <span className="workflow-eyebrow">
            Eligibility result
          </span>

          <h1>
            {eligible
              ? 'You are eligible'
              : 'You are not eligible'}
          </h1>

          <p>
            {result.message}
          </p>

          <div className="eligibility-summary">
            <div>
              <span>Requested amount</span>

              <strong>
                {formatInr(form.requestedAmount)}
              </strong>
            </div>

            <div>
              <span>Maximum eligible amount</span>

              <strong>
                {formatInr(result.eligibleAmount)}
              </strong>
            </div>

            <div>
              <span>Debt-to-income ratio</span>

              <strong>
                {result.debtToIncomeRatio}%
              </strong>
            </div>

            <div>
              <span>Applicable interest rate</span>

              <strong>
                {result.interestRate}%
              </strong>
            </div>
          </div>

          {eligible ? (
            <button
              type="button"
              className="btn btn-primary workflow-submit"
              onClick={() => navigate('/application/emi')}
            >
              Continue to EMI selection
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary workflow-submit"
              onClick={() => navigate('/dashboard')}
            >
              Return to dashboard
            </button>
          )}
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
          <span className="workflow-eyebrow">Eligibility evaluation</span>
          <h1>Check your loan eligibility</h1>
          <p>We review the information below to assess your application. The backend eligibility service makes the final decision.</p>
        </header>

        <section className="workflow-info" aria-labelledby="eligibility-help-heading">
          <h2 id="eligibility-help-heading">What these details mean</h2>
          <p><strong>Income and requested amount:</strong> Tell us what you earn each month and how much you want to borrow, in INR.</p>
          <p><strong>CIBIL score and existing debt:</strong> Share your current credit score and monthly debt commitments.</p>
          <p><strong>Employer and designation:</strong> Tell us where you work and your current role.</p>
        </section>

        {error && <ErrorMessage message={error} />}

        <form className="workflow-form" onSubmit={handleSubmit}>
          <label className="workflow-field">
            Monthly income (INR) <span aria-hidden="true">*</span>
            <input
              required
              min="0"
              type="number"
              value={form.monthlyIncome || ''}
              onChange={(event) => updateField('monthlyIncome', Number(event.target.value))}
              disabled={isSubmitting}
              inputMode="decimal"
            />
          </label>

          <label className="workflow-field">
            Requested amount (INR) <span aria-hidden="true">*</span>
            <input
              required
              min="0"
              type="number"
              value={form.requestedAmount || ''}
              onChange={(event) => updateField('requestedAmount', Number(event.target.value))}
              disabled={isSubmitting}
              inputMode="decimal"
            />
          </label>

          <label className="workflow-field">
            CIBIL score <span aria-hidden="true">*</span>
            <input
              required
              min="0"
              type="number"
              value={form.cibilScore || ''}
              onChange={(event) => updateField('cibilScore', Number(event.target.value))}
              disabled={isSubmitting}
              inputMode="numeric"
            />
          </label>

          <label className="workflow-field">
            Existing debt (INR) <span aria-hidden="true">*</span>
            <input
              required
              min="0"
              type="number"
              value={form.existingDebt || ''}
              onChange={(event) => updateField('existingDebt', Number(event.target.value))}
              disabled={isSubmitting}
              inputMode="decimal"
            />
          </label>

          <label className="workflow-field">
            Employer name <span aria-hidden="true">*</span>
            <input
              required
              value={form.employerName}
              onChange={(event) => updateField('employerName', event.target.value)}
              disabled={isSubmitting}
              autoComplete="organization"
            />
          </label>

          <label className="workflow-field">
            Designation <span aria-hidden="true">*</span>
            <input
              required
              value={form.designation}
              onChange={(event) => updateField('designation', event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <button className="btn btn-primary workflow-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking eligibility...' : 'Check eligibility'}
          </button>
        </form>
      </section>
    </main>
  );
};
