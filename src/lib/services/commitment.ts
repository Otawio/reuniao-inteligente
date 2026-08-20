import { createClient } from '@/lib/supabase/server';
import { COMMITMENT_STATUS } from '@/lib/domain/constants';

export async function listCommitments(userId: string, filters?: {
  status?: string;
  meetingId?: string;
  limit?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('commitments')
    .select(`
      *,
      meetings (id, title, meeting_date)
    `)
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(filters?.limit || 50);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.meetingId) {
    query = query.eq('meeting_id', filters.meetingId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateCommitmentStatus(
  commitmentId: string,
  status: string,
  userId: string
) {
  const supabase = await createClient();

  const updates: Record<string, unknown> = { status };

  if (status === COMMITMENT_STATUS.COMPLETED) {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('commitments')
    .update(updates)
    .eq('id', commitmentId)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('commitment_events').insert({
    commitment_id: commitmentId,
    event_type: status === 'completed' ? 'completed' : 'updated',
    new_value: { status },
    performed_by: userId,
  });

  return data;
}

export async function confirmCommitment(commitmentId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('commitments')
    .update({
      status: COMMITMENT_STATUS.CONFIRMED,
      confirmed_by: userId,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', commitmentId)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('commitment_events').insert({
    commitment_id: commitmentId,
    event_type: 'confirmed',
    new_value: { status: 'confirmed' },
    performed_by: userId,
  });

  return data;
}

export async function getOverdueCommitments() {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('commitments')
    .select(`
      *,
      meetings (id, title)
    `)
    .lt('due_date', today)
    .not('status', 'in', `(${COMMITMENT_STATUS.COMPLETED}, ${COMMITMENT_STATUS.CANCELLED})`)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data;
}
