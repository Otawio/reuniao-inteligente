export type MeetingStatus = 'processing' | 'completed' | 'failed';
export type CommitmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type CommitmentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type CommitmentType = 'commitment' | 'task' | 'decision' | 'pending' | 'meeting';
export type ParticipantRole = 'owner' | 'participant' | 'observer';
export type TranscriptSource = 'cohere' | 'whisper' | 'manual';
export type NotificationChannel = 'ntfy' | 'email' | 'whatsapp' | 'slack' | 'push';
export type NotificationType = 'overdue' | 'due_soon' | 'new_commitment' | 'completed' | 'reminder';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read';
export type DocumentType = 'summary' | 'minutes' | 'action_items';
export type CommitmentEventType = 'created' | 'confirmed' | 'updated' | 'completed' | 'cancelled' | 'reminder_sent' | 'overdue_detected';

export interface User {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  ntfy_topic: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  meeting_date: string;
  duration_seconds: number | null;
  source_file: string | null;
  status: MeetingStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  meeting_id: string;
  user_id: string | null;
  name: string;
  role: ParticipantRole;
  created_at: string;
}

export interface Transcript {
  id: string;
  meeting_id: string;
  full_text: string;
  language: string;
  word_count: number | null;
  source: TranscriptSource;
  created_at: string;
}

export interface TranscriptSegment {
  id: string;
  transcript_id: string;
  speaker: string | null;
  text: string;
  start_time: number | null;
  end_time: number | null;
  segment_index: number;
  created_at: string;
}

export interface Commitment {
  id: string;
  meeting_id: string;
  transcript_segment_id: string | null;
  title: string;
  description: string | null;
  owner_name: string | null;
  owner_id: string | null;
  status: CommitmentStatus;
  priority: CommitmentPriority;
  confidence: ConfidenceLevel;
  commitment_type: CommitmentType;
  due_date: string | null;
  due_time: string | null;
  timezone: string;
  source_excerpt: string;
  detected_by: 'ai' | 'manual';
  confirmed_by: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommitmentEvent {
  id: string;
  commitment_id: string;
  event_type: CommitmentEventType;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  performed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface MeetingDocument {
  id: string;
  meeting_id: string;
  doc_type: DocumentType;
  content: string;
  format: string;
  created_at: string;
}

export interface Notification {
  id: string;
  commitment_id: string | null;
  user_id: string;
  channel: NotificationChannel;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
}
