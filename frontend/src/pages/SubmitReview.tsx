import { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { reviewableService } from '@/services/reviewableService';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';
import type { Comment } from '@/types';

interface ReviewRouteState {
  submissionId?: string;
  assignmentTitle?: string;
}

export default function SubmitReview() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const location = useLocation();
  const routeState = (location.state as ReviewRouteState | null) ?? null;
  const [isWorking, setIsWorking] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const reviewableId = useMemo(() => routeState?.submissionId ?? null, [routeState?.submissionId]);

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

  const submitComment = async () => {
    if (!reviewableId) {
      alert('Document details are missing. Open this page from Review Assignments to comment.');
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    try {
      setIsWorking(true);
      const updatedComments = await reviewableService.addComment(reviewableId, text);
      setComments(updatedComments);
      setCommentText('');
    } catch (err) {
      console.error('Unable to submit comment.', err);
      alert('Unable to submit your comment right now.');
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

          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Comments</h2>
              <p className="br-section-subtitle">Leave anonymous feedback for the author.</p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment…"
                rows={4}
                disabled={isWorking}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontFamily: 'inherit',
                }}
              />

              <div>
                <button
                  type="button"
                  className="br-link-button br-btn-sm br-btn-primary"
                  onClick={submitComment}
                  disabled={isWorking || !commentText.trim()}
                >
                  Submit comment
                </button>
              </div>

              {comments.length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {comments
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((c) => (
                      <div
                        key={c.id}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          border: '1px solid rgba(0,0,0,0.08)',
                          background: 'rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="br-empty-state" role="status">
                  No comments yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

