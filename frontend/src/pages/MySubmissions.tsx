import { useState } from 'react';
import SubmissionsList from '../components/SubmissionsList';
import UploadSubmission from '../components/UploadSubmission';

export default function MySubmissions() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>My Submissions</h1>
      <p>View your uploaded files and submit new ones.</p>

      {/* The List Component */}
      <SubmissionsList refreshTrigger={refreshTrigger} />

      {/* The Upload Component */}
      <UploadSubmission onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}