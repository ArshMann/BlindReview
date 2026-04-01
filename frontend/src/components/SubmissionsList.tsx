import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Reviewable } from '@/types';
import { reviewableService } from '../services/reviewableService';
import ScrollableList from './ui/ScrollableList';
import SubmissionRow from './ui/SubmissionRow';
import './ui/dashboardTheme.css';

interface SubmissionsListProps {
    refreshTrigger: number;
}

export default function SubmissionsList({ refreshTrigger }: SubmissionsListProps) {
    const navigate = useNavigate();
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
                        onView={() => navigate(`/my-submissions/${encodeURIComponent(item.id)}`)}
                    />
                ))}
            </ScrollableList>
        </div>
    );
}
