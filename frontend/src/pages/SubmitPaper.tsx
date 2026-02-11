import { useState } from 'react';
import { type SubmissionForm } from '../types';

export default function SubmitPaper() {
  const [formData, setFormData] = useState<SubmissionForm>({
    title: '',
    subject: '',
    deadline: '',
    description: '',
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Submit Paper for Review</h1>
      <p>
        Submit your paper anonymously for peer review. Your identity will be hidden from reviewers.
      </p>

      {success ? (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb' }}>
          ✓ Paper submitted successfully! You will receive reviews once the review deadline passes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title">
              Title: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem' }}
              placeholder="Enter paper title"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="subject">
              Subject/Topic: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">Select a subject</option>
              <option value="computer-science">Computer Science</option>
              <option value="data-science">Data Science</option>
              <option value="machine-learning">Machine Learning</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="deadline">
              Review Deadline: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', minHeight: '120px' }}
              placeholder="Brief description or abstract of your paper (optional)"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="file">
              Upload File: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="file"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc"
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
            <small>Accepted formats: PDF, DOCX (max 2 MB)</small>
          </div>

          {error && (
            <div style={{ padding: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', marginBottom: '1rem' }}>
              ✗ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Paper'}
          </button>
        </form>
      )}
    </div>
  );
}
