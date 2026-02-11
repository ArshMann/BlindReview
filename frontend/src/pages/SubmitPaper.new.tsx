import { useState } from 'react';

export default function SubmitPaper() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    deadline: '',
    description: '',
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e:any) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      setSuccess(true);
    } catch (err:any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Submit Paper for Review</h1>
      <p>Submit your paper anonymously for peer review. Your identity will be hidden from reviewers.</p>

      {success ? (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb' }}>
          Paper submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem' }}
              placeholder="Enter paper title"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="subject">Subject/Topic:</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
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
            <label htmlFor="deadline">Review Deadline:</label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
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
              placeholder="Brief description (optional)"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="file">Upload File:</label>
            <input
              id="file"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          {error && (
            <div style={{ padding: '1rem', backgroundColor: '#f8d7da', marginBottom: '1rem' }}>
              Error: {error}
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
