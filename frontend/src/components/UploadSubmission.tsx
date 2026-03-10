import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { reviewableService } from '@/services/reviewableService';
import UploadDropZone from './UploadDropZone';
import UploadModal from './UploadModal';
import './ui/dashboardTheme.css';

interface UploadSubmissionProps {
    onUploadSuccess: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const ERROR_MESSAGE = 'There was a problem uploading your file. Please try again.';

export default function UploadSubmission({ onUploadSuccess }: UploadSubmissionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const clearInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const selectSingleFile = (file: File | null) => {
        setSelectedFile(file);
        setUploadStatus('idle');
        setShowErrorModal(false);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        selectSingleFile(file);
    };

    const openFilePicker = () => {
        if (uploadStatus !== 'uploading') {
            fileInputRef.current?.click();
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (uploadStatus !== 'uploading') {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (uploadStatus === 'uploading') {
            return;
        }

        const file = event.dataTransfer.files?.[0] ?? null;
        selectSingleFile(file);
        clearInput();
    };

    const handleRemoveFile = () => {
        selectSingleFile(null);
        clearInput();
    };

    const uploadFile = async (file: File) => {
        setUploadStatus('uploading');
        setShowSuccessModal(false);
        setShowErrorModal(false);

        try {
            await reviewableService.uploadReviewable(file);
            setUploadStatus('success');
            setSelectedFile(null);
            clearInput();
            onUploadSuccess();
            setShowSuccessModal(true);
        } catch {
            setUploadStatus('error');
            setShowErrorModal(true);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || uploadStatus === 'uploading') {
            return;
        }

        await uploadFile(selectedFile);
    };

    const handleRetry = async () => {
        if (!selectedFile || uploadStatus === 'uploading') {
            setShowErrorModal(false);
            setUploadStatus('idle');
            return;
        }

        setShowErrorModal(false);
        await uploadFile(selectedFile);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setUploadStatus('idle');
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setUploadStatus('idle');
    };

    return (
        <>
            <div className="br-upload-shell">
                {uploadStatus === 'uploading' && (
                    <div className="br-upload-progress" aria-hidden="true">
                        <span className="br-upload-progress-bar" />
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={false}
                    onChange={handleFileChange}
                    disabled={uploadStatus === 'uploading'}
                    className="br-hidden-file-input"
                    aria-label="Choose file to upload"
                />

                <UploadDropZone
                    selectedFile={selectedFile}
                    isDragging={isDragging}
                    isDisabled={uploadStatus === 'uploading'}
                    onBrowse={openFilePicker}
                    onRemove={handleRemoveFile}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                />

                <div className="br-upload-actions">
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadStatus === 'uploading'}
                        className="br-btn-primary br-upload-btn"
                    >
                        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>

            <UploadModal
                isOpen={showSuccessModal}
                title="Submission Successful"
                message="Thank you for your submission. Your file has been added for anonymous review."
                actions={[
                    {
                        label: 'Close',
                        variant: 'primary',
                        onClick: closeSuccessModal,
                    },
                ]}
            />

            <UploadModal
                isOpen={showErrorModal}
                title="Upload Failed"
                message={ERROR_MESSAGE}
                actions={[
                    {
                        label: 'Retry',
                        variant: 'primary',
                        onClick: handleRetry,
                    },
                    {
                        label: 'Cancel',
                        variant: 'secondary',
                        onClick: closeErrorModal,
                    },
                ]}
            />
        </>
    );
}
