import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';
import type { EMICalculationRequest, EMICalculationResult } from '../../../types/application';

const initialForm: EMICalculationRequest = {
  loanAmount: 0,
  tenureMonths: 0,
};

const formatInr = (amount: number | undefined): string => {
  if (amount === undefined) return 'Not provided';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const formatRate = (rate: number | undefined): string =>
  rate === undefined ? 'Not provided' : `${rate}%`;

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'We could not calculate your EMI. Please try again.';
  }

  switch (error.response?.status) {
    case 400:
      return 'Please check the loan amount and tenure, then try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to calculate EMI for this application.';
    case 404:
      return 'The current application could not be found.';
    default:
      return error.response && error.response.status >= 500
        ? 'The EMI service is temporarily unavailable. Please try again later.'
        : 'We could not calculate your EMI. Please try again.';
  }
};

const validateForm = (form: EMICalculationRequest): string | null => {
  if (!Number.isFinite(form.loanAmount) || form.loanAmount <= 0) {
    return 'Enter a loan amount greater than zero.';
  }

  if (!Number.isInteger(form.tenureMonths) || form.tenureMonths <= 0) {
    return 'Enter a whole number of months greater than zero.';
  }

  return null;
};

export const EmiSelection: React.FC = () => {
  const navigate = useNavigate();
  const { application, isLoading: isApplicationLoading, refetch } = useApplication();
  const [form, setForm] = useState<EMICalculationRequest>(initialForm);
  const [result, setResult] = useState<EMICalculationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const calculation = await applicationApi.calculateEMI(application.id, form);
      setResult(calculation);
      await refetch();
    } catch (calculationError) {
      setResult(null);
      setError(getErrorMessage(calculationError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplicationLoading) return <Loading />;

  if (result) {
    return (
      <main className="workflow-page">
        <section className="workflow-card emi-result" aria-live="polite">
          <span className="workflow-eyebrow">EMI calculation</span>
          <h1>Your repayment plan</h1>
          <p>These values were returned by the backend calculation service and are the authoritative figures for your application.</p>
          <div className="emi-result-grid">
            <div><span>EMI per month</span><strong>{formatInr(result.monthlyEmi)}</strong></div>
            <div><span>Interest rate</span><strong>{formatRate(result.interestRate)}</strong></div>
            <div><span>Total interest</span><strong>{formatInr(result.totalInterest)}</strong></div>
            <div><span>Total repayment</span><strong>{formatInr(result.totalRepayment)}</strong></div>
            <div><span>Charges</span><strong>{formatInr(result.charges)}</strong></div>
            <div><span>Net disbursement</span><strong>{formatInr(result.netDisbursement)}</strong></div>
          </div>
          <button type="button" className="btn btn-primary workflow-submit" onClick={() => navigate('/application/bank-account')}>
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
          <span className="workflow-eyebrow">EMI selection</span>
          <h1>Choose your loan terms</h1>
          <p>EMI means Equated Monthly Instalment, the amount scheduled for repayment each month.</p>
        </header>

        <section className="workflow-info" aria-labelledby="emi-help-heading">
          <h2 id="emi-help-heading">How to read these terms</h2>
          <p><strong>Loan amount:</strong> The amount you want to borrow.</p>
          <p><strong>Interest:</strong> The cost of borrowing shown by the backend calculation.</p>
          <p><strong>Total repayment:</strong> The total amount returned by the backend for the loan terms you submit.</p>
        </section>

        {error && <ErrorMessage message={error} />}

        <form className="workflow-form" onSubmit={handleSubmit}>
          <label className="workflow-field">
            Loan amount (INR) <span aria-hidden="true">*</span>
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              value={form.loanAmount || ''}
              onChange={(event) => setForm((current) => ({ ...current, loanAmount: Number(event.target.value) }))}
              disabled={isSubmitting}
              inputMode="decimal"
            />
          </label>

          <label className="workflow-field">
            Tenure (months) <span aria-hidden="true">*</span>
            <input
              required
              min="1"
              step="1"
              type="number"
              value={form.tenureMonths || ''}
              onChange={(event) => setForm((current) => ({ ...current, tenureMonths: Number(event.target.value) }))}
              disabled={isSubmitting}
              inputMode="numeric"
            />
          </label>

          <button className="btn btn-primary workflow-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Calculating...' : 'Calculate EMI'}
          </button>
        </form>
      </section>
    </main>
  );
};
