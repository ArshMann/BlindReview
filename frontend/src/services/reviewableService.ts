import api from '@/api/axiosInstance';
import { type Reviewable, type ListReviewablesResponse } from '../types';

export const reviewableService = {
    getReviewables: async (): Promise<Reviewable[]> => {
        const response = await api.get<ListReviewablesResponse>('/reviewable');
        return response.data.items;
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
    downloadFile: async (fileName: string): Promise<Blob> => {
        const response = await api.get<Blob>(`/file/${fileName}`, {
            responseType: 'blob',
        });
        return response.data;
    },
};