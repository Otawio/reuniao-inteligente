import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listCommitments } from '@/lib/services/commitment';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const meetingId = searchParams.get('meetingId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const commitments = await listCommitments(user.id, { status, meetingId, limit });

    return NextResponse.json({ commitments });
  } catch (error) {
    console.error('List commitments error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    );
  }
}
