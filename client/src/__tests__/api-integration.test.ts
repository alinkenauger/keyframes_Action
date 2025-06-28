/**
 * Integration tests for AI API functionality
 */

import { adaptFrameContent, generateFrameContent } from '../lib/ai-service';
import { apiClient } from '../lib/api-client';

// Mock the API client
jest.mock('../lib/api-client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AI Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('adaptFrameContent', () => {
    const mockContent = 'Test content for adaptation';
    const mockTone = 'professional';
    const mockFilter = 'engaging';
    const mockFrameType = 'hook';
    const mockUnitType = 'intro';

    it('should successfully adapt content via API', async () => {
      // Mock successful API response
      mockedApiClient.post.mockResolvedValueOnce({
        data: { adaptedContent: 'Adapted test content' },
        status: 200,
      });

      const result = await adaptFrameContent(
        mockContent,
        mockTone,
        mockFilter,
        mockFrameType,
        mockUnitType
      );

      expect(result).toBe('Adapted test content');
      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai/adapt-content', {
        content: mockContent,
        tone: mockTone,
        filter: mockFilter,
        frameType: mockFrameType,
        unitType: mockUnitType,
      });
    });

    it('should handle empty content error', async () => {
      await expect(
        adaptFrameContent('', mockTone, mockFilter, mockFrameType, mockUnitType)
      ).rejects.toThrow('No content provided to adapt');

      expect(mockedApiClient.post).not.toHaveBeenCalled();
    });

    it('should truncate content that exceeds unit limits', async () => {
      const longContent = 'A'.repeat(200); // Exceeds intro limit of 150
      
      mockedApiClient.post.mockResolvedValueOnce({
        data: { adaptedContent: longContent },
        status: 200,
      });

      const result = await adaptFrameContent(
        'Test',
        mockTone,
        mockFilter,
        mockFrameType,
        'Hook' // Hook has 150 char limit
      );

      expect(result.length).toBeLessThanOrEqual(150);
    });

    it('should return original content on API failure', async () => {
      // Mock API failure
      mockedApiClient.post.mockResolvedValueOnce({
        error: 'API Error',
        status: 500,
      });

      const result = await adaptFrameContent(
        mockContent,
        mockTone,
        mockFilter,
        mockFrameType,
        mockUnitType
      );

      // Should return original content
      expect(result).toBe(mockContent);
    });

    it('should handle rate limit errors gracefully', async () => {
      mockedApiClient.post.mockResolvedValueOnce({
        error: 'rate limit exceeded',
        status: 429,
      });

      await expect(
        adaptFrameContent(
          mockContent,
          mockTone,
          mockFilter,
          mockFrameType,
          mockUnitType
        )
      ).rejects.toThrow('AI service is busy');
    });
  });

  describe('API Client Retry Logic', () => {
    it('should retry on 500 errors', async () => {
      // First two calls fail, third succeeds
      mockedApiClient.post
        .mockResolvedValueOnce({ error: 'Server Error', status: 500 })
        .mockResolvedValueOnce({ error: 'Server Error', status: 500 })
        .mockResolvedValueOnce({
          data: { adaptedContent: 'Success after retry' },
          status: 200,
        });

      const result = await adaptFrameContent(
        'Test',
        'tone',
        'filter',
        'type',
        'unit'
      );

      expect(result).toBe('Success after retry');
      expect(mockedApiClient.post).toHaveBeenCalledTimes(3);
    });

    it('should respect retry limit', async () => {
      // All retries fail
      mockedApiClient.post.mockResolvedValue({
        error: 'Server Error',
        status: 500,
      });

      const result = await adaptFrameContent(
        'Test content',
        'tone',
        'filter',
        'type',
        'unit'
      );

      // Should return original content after all retries fail
      expect(result).toBe('Test content');
      // Initial call + 3 retries = 4 calls
      expect(mockedApiClient.post).toHaveBeenCalledTimes(4);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      mockedApiClient.post.mockResolvedValue({
        data: { adaptedContent: 'Concurrent result' },
        status: 200,
      });

      // Make 10 concurrent requests
      const promises = Array(10).fill(null).map((_, i) => 
        adaptFrameContent(
          `Content ${i}`,
          'tone',
          'filter',
          'type',
          'unit'
        )
      );

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(10);
      expect(results.every(r => r === 'Concurrent result')).toBe(true);
    });

    it('should complete within reasonable time', async () => {
      mockedApiClient.post.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => 
            resolve({
              data: { adaptedContent: 'Timed result' },
              status: 200,
            }), 
            100
          )
        )
      );

      const start = Date.now();
      const result = await adaptFrameContent(
        'Test',
        'tone',
        'filter',
        'type',
        'unit'
      );
      const duration = Date.now() - start;

      expect(result).toBe('Timed result');
      expect(duration).toBeLessThan(200); // Should complete quickly
    });
  });
});