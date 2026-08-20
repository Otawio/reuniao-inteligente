import { describe, it, expect } from 'vitest';
import type { Commitment, Meeting, User } from '@/types';

describe('Type Definitions', () => {
  it('should allow creating a valid Meeting', () => {
    const meeting: Meeting = {
      id: 'test-id',
      project_id: null,
      title: 'Daily Patrimar',
      description: null,
      meeting_date: '2026-08-19T10:00:00Z',
      duration_seconds: 1800,
      source_file: null,
      status: 'processing',
      created_by: 'user-id',
      created_at: '2026-08-19T10:00:00Z',
      updated_at: '2026-08-19T10:00:00Z',
    };

    expect(meeting.title).toBe('Daily Patrimar');
    expect(meeting.status).toBe('processing');
  });

  it('should allow creating a valid Commitment', () => {
    const commitment: Commitment = {
      id: 'test-id',
      meeting_id: 'meeting-id',
      transcript_segment_id: null,
      title: 'Enviar documentação revisada',
      description: null,
      owner_name: 'Otávio',
      owner_id: null,
      status: 'pending',
      priority: 'medium',
      confidence: 'high',
      commitment_type: 'commitment',
      due_date: '2026-08-20',
      due_time: '15:00',
      timezone: 'America/Sao_Paulo',
      source_excerpt: 'Otávio, você consegue enviar a documentação revisada amanhã até às 15h?',
      detected_by: 'ai',
      confirmed_by: null,
      confirmed_at: null,
      completed_at: null,
      created_at: '2026-08-19T10:00:00Z',
      updated_at: '2026-08-19T10:00:00Z',
    };

    expect(commitment.title).toBe('Enviar documentação revisada');
    expect(commitment.confidence).toBe('high');
    expect(commitment.source_excerpt).toContain('documentação');
  });
});
