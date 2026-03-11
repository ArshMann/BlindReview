import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

export default function SubmitReview() {
  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">
            <span className="br-title-icon" aria-hidden="true">{'\u{270D}'}</span>
            Submit Review
          </h1>
          <p className="br-page-subtitle">Use this page to complete and submit your anonymous feedback.</p>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Review Form</h2>
              <p className="br-section-subtitle">The structured review submission form appears in this area.</p>
            </div>

            <div className="br-empty-state" role="status">
              No active review form is loaded for this route yet.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

