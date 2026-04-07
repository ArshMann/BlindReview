import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/api/axiosInstance';
import { assignmentService } from '../assignmentService';

vi.mock('@/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, { deep: true });

describe('assignmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches assignments from /assignments', async () => {
    const mockItems = [
      {
        id: 'a1',
        submissionId: 's1',
        title: 'Paper 1',
        subject: 'CS',
        assignedDate: '2024-01-01',
        deadline: null,
        status: 'pending' as const,
      },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: { items: mockItems } });

    const result = await assignmentService.getMyAssignments();

    expect(mockedApi.get).toHaveBeenCalledWith('/assignments');
    expect(result).toEqual(mockItems);
  });

  it('returns empty array when no assignments', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { items: [] } });

    const result = await assignmentService.getMyAssignments();

    expect(result).toEqual([]);
  });
});
