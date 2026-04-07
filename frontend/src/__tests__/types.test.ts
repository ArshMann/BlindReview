import { describe, it, expect } from 'vitest';
import { statusStyles } from '../types';

describe('statusStyles', () => {
  it('has submission styles for all statuses', () => {
    expect(statusStyles.submission).toHaveProperty('pending');
    expect(statusStyles.submission).toHaveProperty('in-review');
    expect(statusStyles.submission).toHaveProperty('completed');
  });

  it('has assignment styles for all statuses', () => {
    expect(statusStyles.assignment).toHaveProperty('pending');
    expect(statusStyles.assignment).toHaveProperty('in-progress');
    expect(statusStyles.assignment).toHaveProperty('submitted');
  });

  it('has reviewCycle styles for all statuses', () => {
    expect(statusStyles.reviewCycle).toHaveProperty('draft');
    expect(statusStyles.reviewCycle).toHaveProperty('open');
    expect(statusStyles.reviewCycle).toHaveProperty('closed');
    expect(statusStyles.reviewCycle).toHaveProperty('completed');
  });

  it('each style has bg and text properties', () => {
    Object.values(statusStyles.submission).forEach(style => {
      expect(style).toHaveProperty('bg');
      expect(style).toHaveProperty('text');
    });
  });
});
