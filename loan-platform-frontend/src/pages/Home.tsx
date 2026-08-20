import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export const Home: React.FC = () => {
  return (
    <main className="home-page">

      {/* =========================================================
          NAVIGATION
          ========================================================= */}

      <nav className="home-nav">
        <Link to="/" className="home-brand">
          Ezfinanz
        </Link>

        <div className="home-nav-actions">
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>

          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>


      {/* =========================================================
          HERO
          ========================================================= */}

      <section className="home-hero">
        <div className="home-hero-content">

          <span className="home-eyebrow">
            Digital Loan Processing Platform
          </span>

          <h1>
            A structured way to manage
            <span> your complete loan journey.</span>
          </h1>

          <p className="home-hero-description">
            Ezfinanz provides a digital workflow for loan applications,
            from KYC and eligibility evaluation to EMI selection,
            administrative review and final disbursement.
          </p>

          <div className="home-hero-actions">
            <Link to="/register" className="btn btn-primary">
              Start an Application
            </Link>

            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>

          <div className="home-hero-points">
            <span>✓ Role-based access</span>
            <span>✓ Structured application workflow</span>
            <span>✓ Application tracking</span>
          </div>

        </div>
      </section>


      {/* =========================================================
          CAPABILITIES
          ========================================================= */}

      <section className="home-section">

        <div className="home-section-header">
          <span className="home-eyebrow">
            Platform capabilities
          </span>

          <h2>
            Everything required for a structured loan workflow
          </h2>

          <p>
            The platform separates each stage of the application
            process instead of treating loan processing as a single
            form submission.
          </p>
        </div>

        <div className="home-feature-grid">

          <article className="home-feature-card">
            <div className="home-feature-number">01</div>

            <h3>KYC Verification</h3>

            <p>
              Customers submit identity information and supporting
              documents. Administrators can review and verify the
              submitted KYC details.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-number">02</div>

            <h3>Eligibility Evaluation</h3>

            <p>
              Financial information such as income, requested amount,
              CIBIL score and existing debt is evaluated before the
              application proceeds.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-number">03</div>

            <h3>Loan Calculation</h3>

            <p>
              EMI, interest, repayment, charges and disbursement
              calculations are handled as part of the application
              workflow.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-number">04</div>

            <h3>Administrative Review</h3>

            <p>
              Authorized administrators can inspect applications,
              approve or reject them, and move approved applications
              toward disbursement.
            </p>
          </article>

        </div>
      </section>


      {/* =========================================================
          WORKFLOW
          ========================================================= */}

      <section className="home-section home-workflow">

        <div className="home-section-header">
          <span className="home-eyebrow">
            Application workflow
          </span>

          <h2>
            From application to disbursement
          </h2>

          <p>
            Each stage has a defined purpose and application state,
            making the workflow easier to track and control.
          </p>
        </div>

        <div className="home-workflow-grid">

          <div className="home-workflow-step">
            <span>1</span>
            <div>
              <h3>Create Application</h3>
              <p>Start and save a loan application.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>2</span>
            <div>
              <h3>Complete KYC</h3>
              <p>Submit identity information and documents.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>3</span>
            <div>
              <h3>Check Eligibility</h3>
              <p>Evaluate financial eligibility.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>4</span>
            <div>
              <h3>Select EMI</h3>
              <p>Review repayment and loan calculations.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>5</span>
            <div>
              <h3>Bank Account</h3>
              <p>Provide the destination account details.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>6</span>
            <div>
              <h3>Declaration & Selfie</h3>
              <p>Complete the final customer verification steps.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>7</span>
            <div>
              <h3>Admin Review</h3>
              <p>Authorized staff review the application.</p>
            </div>
          </div>

          <div className="home-workflow-step">
            <span>8</span>
            <div>
              <h3>Disbursement</h3>
              <p>Approved applications proceed to disbursement.</p>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          SECURITY / ARCHITECTURE
          ========================================================= */}

      <section className="home-section">

        <div className="home-section-header">
          <span className="home-eyebrow">
            Built around controlled access
          </span>

          <h2>
            Security and application control
          </h2>

          <p>
            Different users interact with the platform according to
            their assigned responsibilities.
          </p>
        </div>

        <div className="home-feature-grid home-security-grid">

          <article className="home-feature-card">
            <h3>JWT Authentication</h3>

            <p>
              Protected API endpoints use token-based authentication
              for authenticated requests.
            </p>
          </article>

          <article className="home-feature-card">
            <h3>Role-Based Access</h3>

            <p>
              Customer, administrator and super administrator roles
              have separate responsibilities and protected routes.
            </p>
          </article>

          <article className="home-feature-card">
            <h3>Application State Control</h3>

            <p>
              Applications move through defined stages rather than
              allowing arbitrary workflow transitions.
            </p>
          </article>

          <article className="home-feature-card">
            <h3>Administrative Verification</h3>

            <p>
              KYC documents and customer information can be reviewed
              before administrative approval.
            </p>
          </article>

        </div>
      </section>


      {/* =========================================================
          PERFORMANCE
          ========================================================= */}

      <section className="home-section home-performance">

        <div className="home-section-header">
          <span className="home-eyebrow">
            Performance testing
          </span>

          <h2>
            Tested under a 1,000-VU load
          </h2>

          <p>
            The backend was locally load-tested using k6 with a
            staged workload reaching 1,000 virtual users.
          </p>
        </div>

        <div className="home-metrics-grid">

          <div className="home-metric-card">
            <strong>1,000</strong>
            <span>Maximum VUs</span>
          </div>

          <div className="home-metric-card">
            <strong>62K+</strong>
            <span>HTTP requests</span>
          </div>

          <div className="home-metric-card">
            <strong>298</strong>
            <span>Requests / second</span>
          </div>

          <div className="home-metric-card">
            <strong>0%</strong>
            <span>HTTP failures</span>
          </div>

          <div className="home-metric-card">
            <strong>4.12s</strong>
            <span>p95 latency</span>
          </div>

        </div>

        <p className="home-performance-note">
          Local load-test result using the current development
          configuration. Performance can vary depending on hardware,
          deployment environment and workload.
        </p>

      </section>


      {/* =========================================================
          ROLES
          ========================================================= */}

      <section className="home-section home-roles">

        <div className="home-section-header">
          <span className="home-eyebrow">
            Role-based platform
          </span>

          <h2>
            Different responsibilities, one system
          </h2>
        </div>

        <div className="home-role-grid">

          <article className="home-role-card">
            <span className="home-role-label">
              CUSTOMER
            </span>

            <h3>Customers</h3>

            <p>
              Create applications, complete KYC and verification
              steps, review loan calculations and track application
              progress.
            </p>
          </article>

          <article className="home-role-card">
            <span className="home-role-label">
              ADMIN
            </span>

            <h3>Administrators</h3>

            <p>
              Review customer applications, verify KYC information,
              approve or reject applications and process
              disbursements.
            </p>
          </article>

          <article className="home-role-card">
            <span className="home-role-label">
              SUPER ADMIN
            </span>

            <h3>Super Administrators</h3>

            <p>
              Manage the administrative layer and control access to
              administrative capabilities.
            </p>
          </article>

        </div>
      </section>
      <section className="home-section home-performance">
        <div className="home-section-header">
          <span className="home-eyebrow">
            Performance & reliability
          </span>

          <h2>
            Tested under real load
          </h2>

          <p>
            EZFinanz was load tested with up to 1,000 concurrent
            virtual users using k6 to evaluate API reliability and
            response performance.
          </p>
        </div>

        <div className="home-performance-grid">

          <article className="home-metric-card">
            <strong>1,000</strong>
            <span>Max concurrent users</span>
          </article>

          <article className="home-metric-card">
            <strong>114K+</strong>
            <span>Requests processed</span>
          </article>

          <article className="home-metric-card">
            <strong>543</strong>
            <span>Requests / second</span>
          </article>

          <article className="home-metric-card">
            <strong>0%</strong>
            <span>HTTP request failures</span>
          </article>

          <article className="home-metric-card">
            <strong>2.04s</strong>
            <span>P95 latency</span>
          </article>

          <article className="home-metric-card">
            <strong>3.17s</strong>
            <span>Maximum latency</span>
          </article>

        </div>

        <div className="home-performance-note">
          <strong>Load test result</strong>

          <p>
            The platform maintained a 0% HTTP failure rate while
            processing approximately 543 requests per second.
            The measured P95 latency was 2.04 seconds, indicating
            that further response-time optimization is an area for
            continued improvement.
          </p>

          <span>
            Tested with k6 · 1,000 virtual users · 3m 30s
          </span>
        </div>
      </section>


      {/* =========================================================
          FINAL CTA
          ========================================================= */}

      <section className="home-cta">

        <div>
          <span className="home-eyebrow">
            Get started
          </span>

          <h2>
            Start your loan application.
          </h2>

          <p>
            Create an account and move through the application
            workflow step by step.
          </p>
        </div>

        <div className="home-hero-actions">
          <Link to="/register" className="btn btn-primary">
            Create an Account
          </Link>

          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>

      </section>


      {/* =========================================================
          FOOTER
          ========================================================= */}

      <footer className="home-footer">
        <div>
          <strong>Ezfinanz</strong>
          <span>Digital Loan Processing Platform</span>
        </div>

        <div className="home-footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>

    </main>
  );
};