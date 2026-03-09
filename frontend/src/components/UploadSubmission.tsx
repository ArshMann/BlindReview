import { useRef, useState, type ChangeEvent } from 'react';
import { reviewableService } from '@/services/reviewableService';
import './ui/dashboardTheme.css';

interface UploadSubmissionProps {
    onUploadSuccess: () => void;
}

export default function UploadSubmission({ onUploadSuccess }: UploadSubmissionProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
        setError(null);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);
            await reviewableService.uploadReviewable(file);
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            onUploadSuccess();
        } catch (err) {
            setError((err as Error).message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="br-upload-shell">
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="br-hidden-file-input"
                aria-label="Choose file to upload"
            />

            <div className="br-upload-controls">
                <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={isUploading}
                    className="br-btn-secondary"
                >
                    Choose File
                </button>

                <span className="br-upload-filename" aria-live="polite">
                    {file ? file.name : 'No file selected'}
                </span>

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="br-btn-primary br-upload-btn"
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {error && (
                <p className="br-state-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
