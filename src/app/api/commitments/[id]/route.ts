import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateCommitmentStatus, confirmCommitment } from '@/lib/services/commitment';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.action === 'confirm') {
      const commitment = await confirmCommitment(id, user.id);
      return NextResponse.json({ commitment });
    }

    if (body.status) {
      const commitment = await updateCommitmentStatus(id, body.status, user.id);
      return NextResponse.json({ commitment });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Update commitment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    );
  }
}
