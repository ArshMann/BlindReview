import { useState } from 'react';
import SubmissionsList from '../components/SubmissionsList';
import UploadSubmission from '../components/UploadSubmission';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

export default function MySubmissions() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">My Submissions</h1>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Submissions</h2>
            </div>
            <SubmissionsList refreshTrigger={refreshTrigger} />
          </section>

          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Upload</h2>
            </div>
            <UploadSubmission onUploadSuccess={handleUploadSuccess} />
          </section>
        </div>
      </main>
    </div>
  );
}

