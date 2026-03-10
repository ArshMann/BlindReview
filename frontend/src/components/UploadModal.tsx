interface UploadModalAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface UploadModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    actions: UploadModalAction[];
}

export default function UploadModal({ isOpen, title, message, actions }: UploadModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="br-upload-modal-overlay" role="presentation">
            <div className="br-upload-modal" role="dialog" aria-modal="true" aria-labelledby="br-upload-modal-title">
                <h3 id="br-upload-modal-title" className="br-upload-modal-title">
                    {title}
                </h3>
                <p className="br-upload-modal-text">{message}</p>

                <div className="br-upload-modal-actions">
                    {actions.map((action, index) => (
                        <button
                            key={`${action.label}-${index}`}
                            type="button"
                            onClick={action.onClick}
                            className={`br-upload-modal-btn ${
                                action.variant === 'secondary' ? 'br-btn-secondary' : 'br-btn-primary'
                            }`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
