-- Reunião Inteligente — Schema Inicial
-- Migration: 001_initial_schema
-- Date: 2026-08-20

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Usuários (espelha Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  ntfy_topic TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projetos (agrupamento opcional)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reuniões
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER,
  source_file TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'participant' CHECK (role IN ('owner', 'participant', 'observer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meeting_id, name)
);

-- Transcrições
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  full_text TEXT NOT NULL,
  language TEXT DEFAULT 'pt',
  word_count INTEGER,
  source TEXT DEFAULT 'cohere' CHECK (source IN ('cohere', 'whisper', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Segmentos da transcrição
CREATE TABLE transcript_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE,
  speaker TEXT,
  text TEXT NOT NULL,
  start_time DOUBLE PRECISION,
  end_time DOUBLE PRECISION,
  segment_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compromissos
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  transcript_segment_id UUID REFERENCES transcript_segments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_name TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  confidence TEXT DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),
  commitment_type TEXT DEFAULT 'commitment' CHECK (commitment_type IN ('commitment', 'task', 'decision', 'pending', 'meeting')),
  due_date DATE,
  due_time TIME,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  source_excerpt TEXT NOT NULL,
  detected_by TEXT DEFAULT 'ai' CHECK (detected_by IN ('ai', 'manual')),
  confirmed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos de compromisso (audit trail)
CREATE TABLE commitment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id UUID REFERENCES commitments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'confirmed', 'updated', 'completed', 'cancelled', 'reminder_sent', 'overdue_detected')),
  old_value JSONB,
  new_value JSONB,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentação gerada
CREATE TABLE meeting_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('summary', 'minutes', 'action_items')),
  content TEXT NOT NULL,
  format TEXT DEFAULT 'markdown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id UUID REFERENCES commitments(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('ntfy', 'email', 'whatsapp', 'slack', 'push')),
  type TEXT NOT NULL CHECK (type IN ('overdue', 'due_soon', 'new_commitment', 'completed', 'reminder')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT
);

-- Junction: meetings <-> tags
CREATE TABLE meeting_tags (
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (meeting_id, tag_id)
);

-- Junction: commitments <-> tags
CREATE TABLE commitment_tags (
  commitment_id UUID REFERENCES commitments(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (commitment_id, tag_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_commitments_meeting ON commitments(meeting_id);
CREATE INDEX idx_commitments_owner ON commitments(owner_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_due_date ON commitments(due_date);
CREATE INDEX idx_commitments_confidence ON commitments(confidence);
CREATE INDEX idx_commitment_events_commitment ON commitment_events(commitment_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_transcript_segments_transcript ON transcript_segments(transcript_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Users: veem apenas seu próprio perfil
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Projects: veem projetos que criaram ou participam
CREATE POLICY "projects_select_member" ON projects
  FOR SELECT USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.project_id = projects.id
      AND meetings.created_by = auth.uid()
    )
  );

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Meetings: veem reuniões que criaram ou são participantes
CREATE POLICY "meetings_select_access" ON meetings
  FOR SELECT USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM participants
      WHERE participants.meeting_id = meetings.id
      AND participants.user_id = auth.uid()
    )
  );

CREATE POLICY "meetings_insert_own" ON meetings
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "meetings_update_access" ON meetings
  FOR UPDATE USING (
    created_by = auth.uid()
  );

-- Participants: veem participantes de reuniões acessíveis
CREATE POLICY "participants_select_access" ON participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = participants.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants p2
          WHERE p2.meeting_id = meetings.id
          AND p2.user_id = auth.uid()
        )
      )
    )
  );

-- Transcripts: veem transcrições de reuniões acessíveis
CREATE POLICY "transcripts_select_access" ON transcripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = transcripts.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants
          WHERE participants.meeting_id = meetings.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

-- Transcript Segments: herdam política de transcripts
CREATE POLICY "transcript_segments_select_access" ON transcript_segments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transcripts
      WHERE transcripts.id = transcript_segments.transcript_id
      AND EXISTS (
        SELECT 1 FROM meetings
        WHERE meetings.id = transcripts.meeting_id
        AND (
          meetings.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM participants
            WHERE participants.meeting_id = meetings.id
            AND participants.user_id = auth.uid()
          )
        )
      )
    )
  );

-- Commitments: veem compromissos de reuniões acessíveis
CREATE POLICY "commitments_select_access" ON commitments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = commitments.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants
          WHERE participants.meeting_id = meetings.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "commitments_insert_access" ON commitments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = commitments.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants
          WHERE participants.meeting_id = meetings.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "commitments_update_access" ON commitments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = commitments.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants
          WHERE participants.meeting_id = meetings.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

-- Commitment Events: herdam política de commitments
CREATE POLICY "commitment_events_select_access" ON commitment_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM commitments
      WHERE commitments.id = commitment_events.commitment_id
      AND EXISTS (
        SELECT 1 FROM meetings
        WHERE meetings.id = commitments.meeting_id
        AND (
          meetings.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM participants
            WHERE participants.meeting_id = meetings.id
            AND participants.user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "commitment_events_insert_access" ON commitment_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM commitments
      WHERE commitments.id = commitment_events.commitment_id
      AND EXISTS (
        SELECT 1 FROM meetings
        WHERE meetings.id = commitments.meeting_id
        AND (
          meetings.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM participants
            WHERE participants.meeting_id = meetings.id
            AND participants.user_id = auth.uid()
          )
        )
      )
    )
  );

-- Meeting Documents: veem docs de reuniões acessíveis
CREATE POLICY "meeting_documents_select_access" ON meeting_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = meeting_documents.meeting_id
      AND (
        meetings.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM participants
          WHERE participants.meeting_id = meetings.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

-- Notifications: veem apenas suas notificações
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Tags: todos autenticados veem
CREATE POLICY "tags_select_authenticated" ON tags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "tags_insert_authenticated" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at
  BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
