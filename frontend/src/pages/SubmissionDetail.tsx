import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reviewableService } from '@/services/reviewableService';
import Navbar from '../components/ui/Navbar';
import FileIcon from '../components/ui/FileIcon';
import '../components/ui/dashboardTheme.css';
import type { Comment, Reviewable } from '@/types';

const formatDateTime = (isoDate: string) =>
  new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function SubmissionDetail() {
  const { reviewableId } = useParams<{ reviewableId: string }>();
  const navigate = useNavigate();
  const [reviewable, setReviewable] = useState<Reviewable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const load = useCallback(async () => {
    if (!reviewableId) {
      setError('Missing submission id.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await reviewableService.getReviewable(reviewableId);
      setReviewable(data);
    } catch {
      setError('Could not load this submission. It may have been removed or you may not have access.');
      setReviewable(null);
    } finally {
      setIsLoading(false);
    }
  }, [reviewableId]);

  useEffect(() => {
    void load();
  }, [load]);

  const fileName = reviewable?.name ?? reviewableId ?? '';

  const openDocument = async (shouldDownload: boolean) => {
    if (!fileName) return;
    try {
      setIsWorking(true);
      const blob = await reviewableService.downloadFile(fileName, { download: shouldDownload });
      const blobUrl = window.URL.createObjectURL(blob);
      if (shouldDownload) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = reviewable?.name || fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error(err);
      alert('Unable to open this file right now.');
    } finally {
      setIsWorking(false);
    }
  };

  const comments: Comment[] = reviewable?.comments?.length
    ? [...reviewable.comments].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [];

  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <p className="br-page-subtitle" style={{ marginBottom: 8 }}>
            <button
              type="button"
              className="br-link-button br-btn-sm br-btn-secondary"
              onClick={() => navigate('/my-submissions')}
            >
              ← Back to My Submissions
            </button>
          </p>
          <h1 className="br-page-title">Submission details</h1>
          {reviewable ? (
            <p className="br-page-subtitle">
              Uploaded{' '}
              <time dateTime={reviewable.createdAt}>{formatDateTime(reviewable.createdAt)}</time>
            </p>
          ) : null}
        </header>

        {isLoading ? (
          <p className="br-state-text">Loading…</p>
        ) : error ? (
          <div className="br-state-error" role="alert">
            {error}
            <div style={{ marginTop: 12 }}>
              <Link to="/my-submissions" className="br-link-button br-btn-sm br-btn-primary">
                Return to list
              </Link>
            </div>
          </div>
        ) : reviewable ? (
          <div className="br-dashboard-stack">
            <section className="br-panel">
              <div className="br-section-header">
                <h2 className="br-section-title">File</h2>
                <p className="br-section-subtitle">Open in the browser or download a copy.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="br-file-icon-wrap">
                  <FileIcon fileName={fileName} type={reviewable.type} />
                </span>
                <p className="br-submission-name" style={{ margin: 0, flex: 1, minWidth: 0 }} title={fileName}>
                  {fileName}
                </p>
              </div>
              <div className="br-assignment-actions">
                <button
                  type="button"
                  className="br-link-button br-btn-sm br-btn-primary"
                  onClick={() => void openDocument(false)}
                  disabled={isWorking}
                >
                  View in browser
                </button>
                <button
                  type="button"
                  className="br-link-button br-btn-sm br-btn-secondary"
                  onClick={() => void openDocument(true)}
                  disabled={isWorking}
                >
                  Download
                </button>
                <button
                  type="button"
                  className="br-link-button br-btn-sm br-btn-secondary"
                  onClick={() => void load()}
                  disabled={isWorking || isLoading}
                >
                  Refresh
                </button>
              </div>
            </section>

            <section className="br-panel">
              <div className="br-section-header">
                <h2 className="br-section-title">Reviewer feedback</h2>
                <p className="br-section-subtitle">Comments from assigned reviewers (anonymous).</p>
              </div>
              {comments.length > 0 ? (
                <div className="br-submission-comments" style={{ padding: 0 }}>
                  {comments.map((c) => (
                    <div key={c.id} className="br-submission-comment">
                      <time dateTime={c.createdAt}>{formatDateTime(c.createdAt)}</time>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="br-empty-state" role="status">
                  No feedback yet. Check again after a reviewer submits comments.
                </div>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
