import { useState, useEffect } from 'react';
import { type AssignmentStatus, type ReviewAssignment, statusStyles } from '../types';

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
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;

  const getStatusBadge = (status: AssignmentStatus) => {
    const style = statusStyles.assignment[status];

    return (
      <span
        style={{
          padding: '0.25rem 0.75rem',
          backgroundColor: style.bg,
          color: style.text,
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: 'bold',
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Review Assignments</h1>
      <p>Complete your assigned peer reviews. Your identity remains anonymous to authors.</p>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <div>
          <strong>Total Assignments:</strong> {assignments.length}
        </div>
        <div>
          <strong>Pending:</strong> {pendingCount}
        </div>
        <div>
          <strong>Submitted:</strong> {submittedCount}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="filter-status">Filter by status: </label>
        <select
          id="filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="submitted">Submitted</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading your review assignments...</p>
      ) : error ? (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' }}>
          ✗ {error}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div style={{ padding: '1rem', backgroundColor: '#e7e7e7' }}>
          <p>No assignments found. Check back later for reviews to complete.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              style={{
                padding: '1rem',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{assignment.title}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    Subject: <strong>{assignment.subject}</strong>
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    Deadline: <strong>{new Date(assignment.deadline).toLocaleDateString()}</strong>
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>{getStatusBadge(assignment.status)}</div>
                <a
                  href={`/review/${assignment.id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {assignment.status === 'submitted' ? 'View' : 'Review'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

