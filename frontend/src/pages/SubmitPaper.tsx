import { useState, type ChangeEvent, type FormEvent } from 'react';
import { type SubmissionForm } from '../types';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">
            <span className="br-title-icon" aria-hidden="true">{'\u{1F4E4}'}</span>
            Submit Paper for Review
          </h1>
          <p className="br-page-subtitle">
            Submit your paper anonymously for peer review. Your identity will be hidden from reviewers.
          </p>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            {success ? (
              <div className="br-state-success" role="status">
                Paper submitted successfully. You will receive reviews after the review deadline passes.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="br-form-grid" noValidate>
                <div className="br-form-field">
                  <label htmlFor="title" className="br-form-label">
                    Title
                    <span className="br-form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="br-auth-input"
                    placeholder="Enter paper title"
                  />
                </div>

                <div className="br-form-field">
                  <label htmlFor="subject" className="br-form-label">
                    Subject/Topic
                    <span className="br-form-required" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="br-auth-input"
                  >
                    <option value="">Select a subject</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="data-science">Data Science</option>
                    <option value="machine-learning">Machine Learning</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="br-form-field">
                  <label htmlFor="deadline" className="br-form-label">
                    Review Deadline
                    <span className="br-form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="br-auth-input"
                  />
                </div>

                <div className="br-form-field">
                  <label htmlFor="description" className="br-form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="br-auth-input br-form-textarea"
                    placeholder="Brief description or abstract of your paper (optional)"
                  />
                </div>

                <div className="br-form-field">
                  <label htmlFor="file" className="br-form-label">
                    Upload File
                    <span className="br-form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="file"
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc"
                    required
                    className="br-file-input"
                  />
                  <small className="br-input-help">Accepted formats: PDF, DOCX (max 2 MB)</small>
                </div>

                {error && (
                  <div className="br-state-error" role="alert">
                    {error}
                  </div>
                )}

                <div className="br-cta-row">
                  <button type="submit" disabled={isLoading} className="br-btn-primary">
                    {isLoading ? 'Submitting...' : 'Submit Paper'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

