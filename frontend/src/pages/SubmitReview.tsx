import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { reviewableService } from '@/services/reviewableService';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

interface ReviewRouteState {
  submissionId?: string;
  assignmentTitle?: string;
}

export default function SubmitReview() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const location = useLocation();
  const routeState = (location.state as ReviewRouteState | null) ?? null;
  const [isWorking, setIsWorking] = useState(false);

  const openSubmissionDocument = async (shouldDownload = false) => {
    if (!routeState?.submissionId) {
      alert('Document details are missing. Open this page from Review Assignments to view the file.');
      return;
    }

    try {
      setIsWorking(true);
      const blob = await reviewableService.downloadFile(routeState.submissionId, {
        download: shouldDownload,
      });
      const blobUrl = window.URL.createObjectURL(blob);

      if (shouldDownload) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = routeState.assignmentTitle || routeState.submissionId;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Unable to open assignment document.', err);
      alert('Unable to open this assignment document right now.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">
            <span className="br-title-icon" aria-hidden="true">{'\u{270D}'}</span>
            Submit Review
          </h1>
          <p className="br-page-subtitle">
            Use this page to complete and submit your anonymous feedback.
            {assignmentId ? (
              <span className="br-assignment-meta"> Assignment ID: {assignmentId}</span>
            ) : null}
          </p>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Assignment Document</h2>
              <p className="br-section-subtitle">
                Open the assigned file in a new tab, or download a local copy while writing your review.
              </p>
            </div>

            <div className="br-assignment-actions">
              <button
                type="button"
                className="br-link-button br-btn-sm br-btn-primary"
                onClick={() => openSubmissionDocument()}
                disabled={isWorking}
              >
                View document
              </button>
              <button
                type="button"
                className="br-link-button br-btn-sm br-btn-secondary"
                onClick={() => openSubmissionDocument(true)}
                disabled={isWorking}
              >
                Download
              </button>
            </div>
          </section>

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

