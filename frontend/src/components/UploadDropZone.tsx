import { type DragEvent, type KeyboardEvent } from 'react';
import FileIcon from './ui/FileIcon';

interface UploadDropZoneProps {
    selectedFile: File | null;
    isDragging: boolean;
    isDisabled: boolean;
    onBrowse: () => void;
    onRemove: () => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export default function UploadDropZone({
    selectedFile,
    isDragging,
    isDisabled,
    onBrowse,
    onRemove,
    onDragOver,
    onDragLeave,
    onDrop,
}: UploadDropZoneProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onBrowse();
        }
    };

    return (
        <div className="br-upload-dropzone-wrap">
            <div
                className={`br-upload-dropzone ${isDragging ? 'br-upload-dropzone-active' : ''} ${
                    isDisabled ? 'br-upload-dropzone-disabled' : ''
                }`}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                aria-disabled={isDisabled}
                onClick={isDisabled ? undefined : onBrowse}
                onKeyDown={handleKeyDown}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {isDragging && (
                    <span className="br-upload-dropzone-icon" aria-hidden="true">
                        {'\u{1F4C4}'}
                    </span>
                )}
                <p className="br-upload-dropzone-title">Drag and drop a file here</p>
                <p className="br-upload-dropzone-subtitle">or click to browse</p>
            </div>

            {selectedFile && (
                <div className="br-upload-selected-file" role="status" aria-live="polite">
                    <div className="br-upload-selected-file-left">
                        <span className="br-file-icon-wrap br-upload-selected-icon-wrap" aria-hidden="true">
                            <FileIcon fileName={selectedFile.name} type={selectedFile.type} />
                        </span>
                        <p className="br-upload-selected-name" title={selectedFile.name}>
                            {selectedFile.name}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="br-upload-remove-btn"
                        onClick={onRemove}
                        disabled={isDisabled}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}
