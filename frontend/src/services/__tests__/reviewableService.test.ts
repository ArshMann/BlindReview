import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/api/axiosInstance';
import { reviewableService } from '../reviewableService';

vi.mock('@/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, { deep: true });

describe('reviewableService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getReviewables', () => {
    it('fetches and returns items from /reviewable', async () => {
      const mockItems = [
        { id: 'r1', name: 'Doc 1', blobUrl: '', type: 'pdf', createdAt: '', cost: 1 },
        { id: 'r2', name: 'Doc 2', blobUrl: '', type: 'pdf', createdAt: '', cost: 1 },
      ];
      mockedApi.get.mockResolvedValueOnce({
        data: { items: mockItems, continuationToken: null, hasMore: false },
      });

      const result = await reviewableService.getReviewables();

      expect(mockedApi.get).toHaveBeenCalledWith('/reviewable');
      expect(result).toEqual(mockItems);
    });
  });

  describe('getReviewable', () => {
    it('fetches a single reviewable by id', async () => {
      const mockItem = { id: 'r1', name: 'Doc 1', blobUrl: '', type: 'pdf', createdAt: '', cost: 1 };
      mockedApi.get.mockResolvedValueOnce({ data: mockItem });

      const result = await reviewableService.getReviewable('r1');

      expect(mockedApi.get).toHaveBeenCalledWith('/reviewable/r1');
      expect(result).toEqual(mockItem);
    });

    it('encodes special characters in id', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: {} });

      await reviewableService.getReviewable('file name.pdf');

      expect(mockedApi.get).toHaveBeenCalledWith('/reviewable/file%20name.pdf');
    });
  });

  describe('addComment', () => {
    it('posts a comment and returns comments array', async () => {
      const mockComments = [{ id: 'c1', text: 'Good work', createdAt: '' }];
      mockedApi.post.mockResolvedValueOnce({
        data: { comments: mockComments },
      });

      const result = await reviewableService.addComment('r1', 'Good work');

      expect(mockedApi.post).toHaveBeenCalledWith('/reviewable/r1/comment', { text: 'Good work' });
      expect(result).toEqual(mockComments);
    });

    it('returns empty array when comments is undefined', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: {} });

      const result = await reviewableService.addComment('r1', 'Test');

      expect(result).toEqual([]);
    });
  });

  describe('uploadReviewable', () => {
    it('posts file with correct headers', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      mockedApi.post.mockResolvedValueOnce({ data: { id: 'new-r1' } });

      await reviewableService.uploadReviewable(file);

      expect(mockedApi.post).toHaveBeenCalledWith('/file', file, {
        headers: {
          'Content-Type': 'application/pdf',
          'X-File-Name': 'test.pdf',
        },
      });
    });
  });

  describe('downloadFile', () => {
    it('downloads file as blob', async () => {
      const mockBlob = new Blob(['data']);
      mockedApi.get.mockResolvedValueOnce({ data: mockBlob });

      const result = await reviewableService.downloadFile('file.pdf');

      expect(mockedApi.get).toHaveBeenCalledWith('/file/file.pdf', {
        responseType: 'blob',
        params: undefined,
      });
      expect(result).toBe(mockBlob);
    });

    it('passes download=1 param when download option is true', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: new Blob() });

      await reviewableService.downloadFile('file.pdf', { download: true });

      expect(mockedApi.get).toHaveBeenCalledWith('/file/file.pdf', {
        responseType: 'blob',
        params: { download: '1' },
      });
    });
  });
});
