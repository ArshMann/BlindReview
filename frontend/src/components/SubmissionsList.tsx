import { useState, useEffect } from 'react';
import { type Reviewable } from '@/types';
import { reviewableService } from '../services/reviewableService';

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

            // Clean up the URL from memory after a short delay
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error('Failed to view file:', err);
            alert('Unable to open the file at this time.');
        }
    };

    if (isLoading) return <p>Loading your files...</p>;
    if (error) return <div style={{ color: 'red', padding: '1rem' }}>✗ {error}</div>;
    if (reviewables.length === 0) return <p>No files found. Upload one below.</p>;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Uploaded Date</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem' }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {reviewables.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '0.75rem' }}>{item.name}</td>
                        <td style={{ padding: '0.75rem' }}>{item.type}</td>
                        <td style={{ padding: '0.75rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'center', padding: '0.75rem' }}>

                            <button
                                onClick={() => handleViewFile(item.name)}
                                style={{
                                    color: '#007bff',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '1rem'
                                }}
                            >
                                View File
                            </button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}