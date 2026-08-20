import { createClient } from '@/lib/supabase/server';
import { transcribeAudio } from '@/lib/ai/transcription';
import { extractCommitments } from '@/lib/ai/extraction';
import { COMMITMENT_STATUS, COMMITMENT_PRIORITY } from '@/lib/domain/constants';

export async function processMeetingUpload(
  fileBuffer: Buffer,
  fileName: string,
  meetingDate: string,
  userId: string
) {
  const supabase = await createClient();

  const meetingData = {
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
    meeting_date: meetingDate,
    source_file: fileName,
    status: 'processing',
    created_by: userId,
  };

  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert(meetingData)
    .select()
    .single();

  if (meetingError) throw meetingError;

  try {
    const arrayBuffer = new ArrayBuffer(fileBuffer.length);
    new Uint8Array(arrayBuffer).set(fileBuffer);
    const transcript = await transcribeAudio(arrayBuffer, fileName);

    const transcriptData = {
      meeting_id: meeting.id,
      full_text: transcript.text,
      language: transcript.language,
      word_count: transcript.wordCount,
      source: transcript.source,
    };

    const { error: transcriptError } = await supabase
      .from('transcripts')
      .insert(transcriptData);

    if (transcriptError) throw transcriptError;

    const extraction = await extractCommitments(transcript.text);

    await supabase
      .from('meetings')
      .update({
        title: extraction.title,
        status: 'completed',
      })
      .eq('id', meeting.id);

    if (extraction.commitments.length > 0) {
      const commitments = extraction.commitments.map((c) => ({
        meeting_id: meeting.id,
        title: c.title,
        description: c.description || null,
        owner_name: c.owner_name || c.owner || null,
        status: c.status || COMMITMENT_STATUS.PENDING,
        priority: c.priority || COMMITMENT_PRIORITY.MEDIUM,
        confidence: c.confidence || 'medium',
        commitment_type: c.commitment_type || c.type || 'commitment',
        due_date: c.due_date || null,
        due_time: c.due_time || null,
        timezone: 'America/Sao_Paulo',
        source_excerpt: c.source_excerpt,
        detected_by: 'ai',
        transcript_segment_id: null,
        owner_id: null,
        confirmed_by: null,
        confirmed_at: null,
        completed_at: null,
      }));

      const { error: commitmentsError } = await supabase
        .from('commitments')
        .insert(commitments);

      if (commitmentsError) throw commitmentsError;
    }

    return {
      meeting,
      transcript: extraction.title,
      commitmentsCount: extraction.commitments.length,
      summary: extraction.summary,
    };
  } catch (error) {
    await supabase
      .from('meetings')
      .update({ status: 'failed' })
      .eq('id', meeting.id);
    throw error;
  }
}

export async function getMeetingWithCommitments(meetingId: string) {
  const supabase = await createClient();

  const { data: meeting, error } = await supabase
    .from('meetings')
    .select(`
      *,
      transcripts (*),
      commitments (*),
      participants (*)
    `)
    .eq('id', meetingId)
    .single();

  if (error) throw error;
  return meeting;
}

export async function listMeetings(userId: string, limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('meetings')
    .select(`
      id,
      title,
      meeting_date,
      status,
      created_at,
      commitments (id, status)
    `)
    .eq('created_by', userId)
    .order('meeting_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
