import { useEffect, useState } from 'react';
import { type AssignmentStatus, type ReviewAssignment } from '../types';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

const statusClassByAssignment: Record<AssignmentStatus, string> = {
  pending: 'br-status-pending',
  'in-progress': 'br-status-progress',
  submitted: 'br-status-submitted',
};

const toDisplayStatus = (status: AssignmentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function ReviewAssignments() {
  const [assignments, setAssignments] = useState<ReviewAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        setAssignments([
          {
            id: 'assign-1',
            submissionId: '1',
            title: 'Deep Learning for NLP',
            subject: 'machine-learning',
            assignedDate: '2026-02-05',
            deadline: '2026-02-20',
            status: 'pending',
          },
          {
            id: 'assign-2',
            submissionId: '2',
            title: 'Blockchain Security Analysis',
            subject: 'computer-science',
            assignedDate: '2026-02-05',
            deadline: '2026-02-20',
            status: 'in-progress',
          },
        ]);
      } catch (err) {
        setError((err as Error).message || 'Failed to load assignments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments =
    filterStatus === 'all'
      ? assignments
      : assignments.filter((assign) => assign.status === filterStatus);

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const inProgressCount = assignments.filter((a) => a.status === 'in-progress').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;

  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">
            <span className="br-title-icon" aria-hidden="true">{'\u{1F50E}'}</span>
            Review Assignments
          </h1>
          <p className="br-page-subtitle">
          </p>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Assignments Overview</h2>
            </div>

            <div className="br-stat-grid" role="list" aria-label="Assignment statistics">
              <article className="br-stat-card" role="listitem">
                <p className="br-stat-label">Total</p>
                <p className="br-stat-value">{assignments.length}</p>
              </article>
              <article className="br-stat-card" role="listitem">
                <p className="br-stat-label">Pending</p>
                <p className="br-stat-value">{pendingCount}</p>
              </article>
              <article className="br-stat-card" role="listitem">
                <p className="br-stat-label">In Progress</p>
                <p className="br-stat-value">{inProgressCount}</p>
              </article>
              <article className="br-stat-card" role="listitem">
                <p className="br-stat-label">Submitted</p>
                <p className="br-stat-value">{submittedCount}</p>
              </article>
            </div>
          </section>

          <section className="br-panel">
            <div className="br-filter-row">
              <label htmlFor="filter-status" className="br-form-label br-filter-label">
                Filter by status
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="br-auth-input br-filter-select"
              >
                <option value="all">All assignments</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          </section>

          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Assigned Reviews</h2>
            </div>

            {isLoading ? (
              <p className="br-state-text">Loading your review assignments...</p>
            ) : error ? (
              <div className="br-state-error" role="alert">
                {error}
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="br-empty-state" role="status">
                No assignments found. Check back later for reviews to complete.
              </div>
            ) : (
              <div className="br-scroll-region br-assignment-scroll" role="region" aria-label="Review assignments" tabIndex={0}>
                {filteredAssignments.map((assignment) => (
                  <article key={assignment.id} className="br-assignment-row">
                    <div className="br-assignment-main">
                      <h3 className="br-assignment-title">
                        <span className="br-inline-icon" aria-hidden="true">{'\u{1F4C4}'}</span>
                        {assignment.title}
                      </h3>
                      <p className="br-assignment-meta">
                        Subject: <strong>{assignment.subject}</strong>
                      </p>
                      <p className="br-assignment-meta">
                        Deadline: <strong>{formatDate(assignment.deadline)}</strong>
                      </p>
                    </div>

                    <div className="br-assignment-actions">
                      <span className={`br-status-pill ${statusClassByAssignment[assignment.status]}`}>
                        {toDisplayStatus(assignment.status)}
                      </span>
                    </div>

                    <a
                      href={`/review/${assignment.id}`}
                      className={`br-link-button br-btn-sm ${
                        assignment.status === 'submitted' ? 'br-btn-secondary' : 'br-btn-primary'
                      }`}
                    >
                      {assignment.status === 'submitted' ? 'View' : 'Review'}
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

