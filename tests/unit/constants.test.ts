import { describe, it, expect } from 'vitest';
import { MEETING_STATUS, COMMITMENT_STATUS, COMMITMENT_TYPE, CONFIDENCE, DEFAULT_TIMEZONE } from '@/lib/domain/constants';

describe('Domain Constants', () => {
  it('should have correct meeting statuses', () => {
    expect(MEETING_STATUS.PROCESSING).toBe('processing');
    expect(MEETING_STATUS.COMPLETED).toBe('completed');
    expect(MEETING_STATUS.FAILED).toBe('failed');
  });

  it('should have correct commitment statuses', () => {
    expect(COMMITMENT_STATUS.PENDING).toBe('pending');
    expect(COMMITMENT_STATUS.CONFIRMED).toBe('confirmed');
    expect(COMMITMENT_STATUS.IN_PROGRESS).toBe('in_progress');
    expect(COMMITMENT_STATUS.COMPLETED).toBe('completed');
    expect(COMMITMENT_STATUS.CANCELLED).toBe('cancelled');
    expect(COMMITMENT_STATUS.OVERDUE).toBe('overdue');
  });

  it('should have correct commitment types', () => {
    expect(COMMITMENT_TYPE.COMMITMENT).toBe('commitment');
    expect(COMMITMENT_TYPE.TASK).toBe('task');
    expect(COMMITMENT_TYPE.DECISION).toBe('decision');
    expect(COMMITMENT_TYPE.PENDING).toBe('pending');
    expect(COMMITMENT_TYPE.MEETING).toBe('meeting');
  });

  it('should have correct confidence levels', () => {
    expect(CONFIDENCE.HIGH).toBe('high');
    expect(CONFIDENCE.MEDIUM).toBe('medium');
    expect(CONFIDENCE.LOW).toBe('low');
  });

  it('should default to São Paulo timezone', () => {
    expect(DEFAULT_TIMEZONE).toBe('America/Sao_Paulo');
  });
});
