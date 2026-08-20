import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';
import type { Application, DeclarationData } from '../../../types/application';

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'We could not submit your declaration. Please try again.';
  }

  switch (error.response?.status) {
    case 400:
      return 'The declaration could not be submitted. Please review your confirmation and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to submit a declaration for this application.';
    case 404:
      return 'The current application could not be found.';
    default:
      return error.response && error.response.status >= 500
        ? 'The declaration service is temporarily unavailable. Please try again later.'
        : 'We could not submit your declaration. Please try again.';
  }
};

export const Declaration: React.FC = () => {
  const navigate = useNavigate();
  const { application, isLoading: isApplicationLoading, refetch } = useApplication();
  const [accepted, setAccepted] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accepted) {
      setError('Please confirm that you have reviewed the information in your application.');
      return;
    }

    if (!application) {
      setError('No active application was found. Return to the dashboard and try again.');
      return;
    }

    const declaration: DeclarationData = { accepted: true };

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedApplication = await applicationApi.submitDeclaration(application.id, declaration);
      await refetch();
      setSubmittedApplication(updatedApplication);
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplicationLoading) return <Loading />;

  if (submittedApplication) {
    return (
      <main className="workflow-page">
        <section className="workflow-card workflow-result" aria-live="polite">
          <span className="workflow-eyebrow">Declaration submitted</span>
          <h1>Your confirmation was recorded</h1>
          <p>Your application has moved to the next backend stage.</p>
          <p className="workflow-result-next">Current stage: {submittedApplication.currentStage.replace(/_/g, ' ')}</p>
          <button type="button" className="btn btn-primary workflow-submit" onClick={() => navigate('/application/selfie')}>
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
          <span className="workflow-eyebrow">Declaration</span>
          <h1>Review your application</h1>
          <p>The backend requires an explicit confirmation before your application can continue to the next stage.</p>
        </header>

        <section className="workflow-info" aria-labelledby="declaration-help-heading">
          <h2 id="declaration-help-heading">Why confirmation is required</h2>
          <p>This confirmation tells the application workflow that you have reviewed the information submitted so far.</p>
          <p>No additional legal wording or terms are presented here because none are defined by the current backend contract.</p>
        </section>

        {error && <ErrorMessage message={error} />}

        <form className="declaration-form" onSubmit={handleSubmit}>
          <label className="declaration-confirmation">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
                setError(null);
              }}
              disabled={isSubmitting}
            />
            <span>I confirm that I have reviewed the information in my application.</span>
          </label>
          <button className="btn btn-primary workflow-submit" type="submit" disabled={isSubmitting || !accepted}>
            {isSubmitting ? 'Submitting...' : 'Confirm and continue'}
          </button>
        </form>
      </section>
    </main>
  );
};
