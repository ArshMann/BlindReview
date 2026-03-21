import api from '@/api/axiosInstance';
import { type ListMyAssignmentsResponse, type ReviewAssignment } from '../types';

export const assignmentService = {
  getMyAssignments: async (): Promise<ReviewAssignment[]> => {
    const response = await api.get<ListMyAssignmentsResponse>('/assignments');
    return response.data.items;
  },
};
