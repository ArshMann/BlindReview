import { useState } from 'react';
import { reviewableService } from '@/services/reviewableService';

interface UploadSubmissionProps {
    onUploadSuccess: () => void;
}

export default function UploadSubmission({ onUploadSuccess }: UploadSubmissionProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);
            await reviewableService.uploadReviewable(file);
            setFile(null);

            onUploadSuccess();
        } catch (err) {
            setError((err as Error).message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: '1.5rem', border: '1px solid #dee2e6', borderRadius: '8px', marginTop: '2rem' }}>
            <h2>Upload New File</h2>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <input type="file" onChange={handleFileChange} disabled={isUploading} />
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    style={{ padding: '0.5rem 1rem', cursor: file && !isUploading ? 'pointer' : 'not-allowed' }}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {error && <p style={{ color: 'red', marginTop: '1rem' }}>✗ {error}</p>}
        </div>
    );
}