# Spec 006 — Supabase Persistence

## Objetivo
Persistir dados no Supabase com RLS e boas práticas.

## Entidades

- users
- meetings
- participants
- transcripts
- transcript_segments
- commitments
- commitment_events
- meeting_documents
- notifications
- projects
- tags

## Operações

### Meetings
- CREATE: criar reunião
- READ: listar, buscar por ID, filtrar por data
- UPDATE: atualizar status, título
- DELETE: soft delete

### Commitments
- CREATE: criar compromisso (IA ou manual)
- READ: listar por reunião, por responsável, por status
- UPDATE: confirmar, editar, completar, cancelar
- DELETE: soft delete

### Events
- CREATE: registrar evento (confirmação, edição, etc.)
- READ: histórico de um compromisso

## RLS Policies

```sql
-- Usuários veem apenas seus dados
CREATE POLICY "users_own_data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Reuniões: participantes podem ver
CREATE POLICY "meetings_participants" ON meetings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE meeting_id = meetings.id
      AND user_id = auth.uid()
    )
  );

-- Compromissos: herdam política da reunião
CREATE POLICY "commitments_meeting_access" ON commitments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE meetings.id = commitments.meeting_id
      AND can_access_meeting(meetings.id, auth.uid())
    )
  );
```

## Critérios de Aceite

- [ ] Schema criado corretamente
- [ ] RLS funciona (usuários veem apenas seus dados)
- [ ] CRUD completo funciona
- [ ] Migrations são versionadas
