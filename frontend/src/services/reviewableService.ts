import api from '@/api/axiosInstance';
import { type Reviewable, type ListReviewablesResponse, type Comment } from '../types';

export const reviewableService = {
    getReviewables: async (): Promise<Reviewable[]> => {
        const response = await api.get<ListReviewablesResponse>('/reviewable');
        return response.data.items;
    },

    addComment: async (reviewableId: string, text: string): Promise<Comment[]> => {
        const response = await api.post<Reviewable>(
            `/reviewable/${encodeURIComponent(reviewableId)}/comment`,
            { text }
        );
        return response.data.comments ?? [];
    },

    uploadReviewable: async (file: File): Promise<Reviewable> => {
        const response = await api.post<Reviewable>('/file', file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
            'X-File-Name': file.name,
        },
        });
        return response.data;
    },
    downloadFile: async (fileName: string, options?: { download?: boolean }): Promise<Blob> => {
        const response = await api.get<Blob>(`/file/${encodeURIComponent(fileName)}`, {
            responseType: 'blob',
            params: options?.download ? { download: '1' } : undefined,
        });
        return response.data;
    },
};