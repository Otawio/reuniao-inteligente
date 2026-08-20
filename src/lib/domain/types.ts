export interface ExtractedCommitment {
  type: 'commitment' | 'task' | 'decision' | 'pending' | 'meeting';
  title: string;
  description?: string;
  owner?: string;
  due_date?: string;
  due_time?: string;
  confidence: 'high' | 'medium' | 'low';
  source_excerpt: string;
}

export interface ExtractionResult {
  commitments: ExtractedCommitment[];
  summary: string;
  decisions: string[];
  participants: string[];
}

export interface DateResolution {
  original: string;
  resolved_date: string | null;
  resolved_time: string | null;
  timezone: string;
  confidence: 'high' | 'medium' | 'low';
  is_holiday: boolean;
}
