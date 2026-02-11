import { useState, useEffect } from 'react';
import { type SubmissionStatus, type Submission, statusStyles } from '../types';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setSubmissions([
          {
            id: '1',
            title: 'Machine Learning in Healthcare',
            subject: 'machine-learning',
            submittedDate: '2026-02-01',
            deadline: '2026-02-15',
            reviewCount: 3,
            status: 'in-review',
          },
        ]);
      } catch (err) {
        setError((err as Error).message || 'Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions =
    filterStatus === 'all'
      ? submissions
      : submissions.filter((sub) => sub.status === filterStatus);

  const getStatusBadge = (status: SubmissionStatus) => {
    const style = statusStyles.submission[status];

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
      <h1>My Submissions</h1>
      <p>View the status of papers you've submitted for review.</p>

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
          <option value="in-review">In Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading your submissions...</p>
      ) : error ? (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' }}>
          ✗ {error}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div style={{ padding: '1rem', backgroundColor: '#e7e7e7' }}>
          <p>No submissions found. <a href="/submit">Submit a paper</a> to get started.</p>
        </div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '0.75rem' }}>Reviews</th>
              <th style={{ textAlign: 'center', padding: '0.75rem' }}>Score</th>
              <th style={{ textAlign: 'center', padding: '0.75rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr
                key={submission.id}
                style={{ borderBottom: '1px solid #dee2e6', cursor: 'pointer' }}
              >
                <td style={{ padding: '0.75rem' }}>{submission.title}</td>
                <td style={{ padding: '0.75rem' }}>{submission.subject}</td>
                <td style={{ padding: '0.75rem' }}>{getStatusBadge(submission.status)}</td>
                <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                  {submission.reviewCount}
                </td>
                <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                  {submission.averageScore ? submission.averageScore.toFixed(2) : '—'}
                </td>
                <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                  <a href={`/submission/${submission.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
