export const MEETING_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const COMMITMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
} as const;

export const COMMITMENT_TYPE = {
  COMMITMENT: 'commitment',
  TASK: 'task',
  DECISION: 'decision',
  PENDING: 'pending',
  MEETING: 'meeting',
} as const;

export const COMMITMENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const CONFIDENCE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const AI_MODELS = {
  EXTRACTION: process.env.AI_MODEL || 'cc/claude-sonnet-4.5',
} as const;

export const MAX_RETRIES = {
  AI_EXTRACTION: 3,
  TRANSCRIPTION: 2,
} as const;

export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

export const SUPPORTED_AUDIO_FORMATS = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'];
export const SUPPORTED_VIDEO_FORMATS = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv'];
export const SUPPORTED_TEXT_FORMATS = ['.txt', '.md'];

export const MAX_FILE_SIZE_MB = 500;
export const MAX_TEXT_SIZE_KB = 100;
