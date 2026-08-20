import { Link } from 'react-router-dom';
import '../../styles/CustomerDashboard.css';
import '../../styles/Help.css';

const STEPS = [
  { title: 'KYC', description: 'Share your personal and identity details so Ezfinanz can confirm who you are.' },
  { title: 'Eligibility', description: 'Provide income and loan details. The application service decides eligibility from those values.' },
  { title: 'EMI selection', description: 'Review repayment options returned for your application and choose a plan.' },
  { title: 'Bank account', description: 'Enter the account details needed if funds are later transferred.' },
  { title: 'Declaration', description: 'Confirm that the information you submitted is accurate.' },
  { title: 'Selfie', description: 'Upload a clear selfie to complete identity verification.' },
  { title: 'Admin review', description: 'Your application is reviewed. The decision is shown on your dashboard when it is available.' },
  { title: 'Disbursement', description: 'If approved, funds are prepared for transfer. You do not need to fill another form at this stage.' },
];

const FAQS = [
  {
    question: 'How do I start a loan application?',
    answer: 'Open Dashboard and choose Start New Application. Ezfinanz creates an application only after you take that action. Logging in does not create an application by itself.',
  },
  {
    question: 'Can I have more than one application at the same time?',
    answer: 'You can have several past applications, but only one active application at a time. If you already have an active application, you will need to finish or wait until it is no longer active before starting another.',
  },
  {
    question: 'Where do I continue an application I already started?',
    answer: 'Use Dashboard or Applications. Continue Application takes you to the current step, such as KYC, eligibility, EMI, bank account, declaration, or selfie.',
  },
  {
    question: 'What happens after I submit my selfie?',
    answer: 'The application moves to review. You will not be asked to fill another customer form while it is under review. Check Dashboard for status updates.',
  },
  {
    question: 'Where can I see older applications?',
    answer: 'Open Applications to review current and past applications, including status, current step, and dates. Past applications are shown for reference and cannot be edited.',
  },
  {
    question: 'Why was my application rejected?',
    answer: 'If a rejection reason was provided by the application service, it appears on Dashboard and on the Applications page. Eligibility and approval decisions are made by the backend, not by this screen.',
  },
];

export const Help: React.FC = () => {
  return (
    <div className="customer-dashboard help-page">
      <div className="welcome-card">
        <div className="welcome-content">
          <h1>Help</h1>
          <p>Find out how to start, continue, and track a loan application with Ezfinanz.</p>
        </div>
      </div>

      <section className="application-status-card" aria-labelledby="help-overview-heading">
        <span className="workflow-eyebrow">Getting started</span>
        <h2 id="help-overview-heading">How Ezfinanz applications work</h2>
        <p>
          After you sign in, go to Dashboard. If you do not have an active application, start one from there.
          If you already have an active application, continue from the step shown on Dashboard.
        </p>
        <div className="help-actions">
          <Link className="action-button primary help-link-button" to="/dashboard">
            Go to Dashboard
          </Link>
          <Link className="action-button help-secondary-link" to="/applications">
            View Applications
          </Link>
        </div>
      </section>

      <section className="application-status-card" aria-labelledby="help-steps-heading">
        <span className="workflow-eyebrow">Application flow</span>
        <h2 id="help-steps-heading">What each step is for</h2>
        <ol className="help-steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="application-status-card" aria-labelledby="help-faq-heading">
        <span className="workflow-eyebrow">Common questions</span>
        <h2 id="help-faq-heading">Frequently asked questions</h2>
        <div className="help-faq-list">
          {FAQS.map((item) => (
            <details key={item.question} className="help-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
