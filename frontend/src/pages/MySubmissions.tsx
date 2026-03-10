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
          <p className="br-page-subtitle">
            Review your uploaded files and submit new files for anonymous peer feedback.
          </p>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Submissions</h2>
              <p className="br-section-subtitle">Use the scrollable list to browse all uploaded files.</p>
            </div>
            <SubmissionsList refreshTrigger={refreshTrigger} />
          </section>

          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Upload</h2>
              <p className="br-section-subtitle">Drag and drop a file or click to browse, then upload it to refresh the list above.</p>
            </div>
            <UploadSubmission onUploadSuccess={handleUploadSuccess} />
          </section>
        </div>
      </main>
    </div>
  );
}

