export interface ExtractedCommitment {
  type: 'commitment' | 'task' | 'decision' | 'pending' | 'meeting';
  commitment_type: 'commitment' | 'task' | 'decision' | 'pending' | 'meeting';
  title: string;
  description?: string;
  owner?: string;
  owner_name?: string;
  status?: string;
  priority?: string;
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

export interface TranscriptResult {
  text: string;
  language: string;
  source: 'cohere' | 'whisper' | 'manual';
  wordCount: number;
}

export interface DateResolution {
  original: string;
  resolved_date: string | null;
  resolved_time: string | null;
  timezone: string;
  confidence: 'high' | 'medium' | 'low';
  is_holiday: boolean;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          timezone: string;
          ntfy_topic: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
      };
      meetings: {
        Row: {
          id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          meeting_date: string;
          duration_seconds: number | null;
          source_file: string | null;
          status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['meetings']['Row'], 'id' | 'created_at' | 'updated_at'>;
      };
      transcripts: {
        Row: {
          id: string;
          meeting_id: string;
          full_text: string;
          language: string;
          word_count: number | null;
          source: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transcripts']['Row'], 'id' | 'created_at'>;
      };
      commitments: {
        Row: {
          id: string;
          meeting_id: string;
          transcript_segment_id: string | null;
          title: string;
          description: string | null;
          owner_name: string | null;
          owner_id: string | null;
          status: string;
          priority: string;
          confidence: string;
          commitment_type: string;
          due_date: string | null;
          due_time: string | null;
          timezone: string;
          source_excerpt: string;
          detected_by: string;
          confirmed_by: string | null;
          confirmed_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['commitments']['Row'], 'id' | 'created_at' | 'updated_at'>;
      };
    };
  };
};

export type CreateTable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type CreateTranscript<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type CreateCommitment<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
