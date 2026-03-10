import { useEffect, useState } from 'react';
import { type Reviewable } from '@/types';
import { reviewableService } from '../services/reviewableService';
import ScrollableList from './ui/ScrollableList';
import SubmissionRow from './ui/SubmissionRow';
import './ui/dashboardTheme.css';

interface SubmissionsListProps {
    refreshTrigger: number;
}

export default function SubmissionsList({ refreshTrigger }: SubmissionsListProps) {
    const [reviewables, setReviewables] = useState<Reviewable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviewables = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await reviewableService.getReviewables();
                setReviewables(data);
            } catch (err) {
                setError((err as Error).message || 'Failed to load reviewables');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewables();
    }, [refreshTrigger]);

    const handleViewFile = async (fileName: string) => {
        try {
            const blob = await reviewableService.downloadFile(fileName);
            const url = window.URL.createObjectURL(blob);

            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error('Failed to view file:', err);
            alert('Unable to open the file at this time.');
        }
    };

    if (isLoading) {
        return <p className="br-state-text">Loading your files...</p>;
    }

    if (error) {
        return (
            <div className="br-state-error" role="alert">
                {error}
            </div>
        );
    }

    if (reviewables.length === 0) {
        return <p className="br-state-text">No files found. Upload one below.</p>;
    }

    return (
        <div className="br-submissions-shell">
            <div className="br-submissions-columns" aria-hidden="true">
                <span className="br-submissions-col-file">FILE</span>
                <span className="br-submissions-col-date">UPLOADED</span>
                <span className="br-submissions-col-action">ACTION</span>
            </div>

            <ScrollableList label="Submitted files" height={420}>
                {reviewables.map((item) => (
                    <SubmissionRow
                        key={item.id}
                        fileName={item.name}
                        type={item.type}
                        createdAt={item.createdAt}
                        onView={() => handleViewFile(item.name)}
                    />
                ))}
            </ScrollableList>
        </div>
    );
}
