import { ExtractedCommitment } from '@/lib/domain/types';
import { AI_MODELS, MAX_RETRIES } from '@/lib/domain/constants';

const AI_BASE_URL = process.env.AI_BASE_URL || 'http://localhost:20128/v1';
const AI_API_KEY = process.env.AI_API_KEY || 'placeholder';

const EXTRACTION_SYSTEM_PROMPT = `Você é um especialista em análise de reuniões corporativas.
Analise a transcrição e extraia compromissos, tarefas, decisões e pendências.

Retorne APENAS um JSON válido com o seguinte formato:
{
  "commitments": [
    {
      "title": "Título curto do compromisso",
      "description": "Descrição detalhada",
      "owner_name": "Nome do responsável (se mencionado)",
      "status": "pending",
      "priority": "medium|high|low|urgent",
      "commitment_type": "commitment|task|decision|pending|meeting",
      "due_date": "YYYY-MM-DD ou null",
      "due_time": "HH:MM ou null",
      "source_excerpt": "Trecho exato da transcrição que originou este compromisso",
      "confidence": "high|medium|low"
    }
  ],
  "title": "Título da reunião (inferido)",
  "participants": ["Nome 1", "Nome 2"],
  "summary": "Resumo executivo em 2-3 parágrafos"
}

Regras:
1. Extraia TODOS os compromissos mencionados, mesmo implícitos
2. Identifique o responsável quando mencionado pelo nome
3. Extraia datas quando mencionadas (adicione timezone America/Sao_Paulo)
4. Classifique prioridade baseado no contexto (urgente = prazo iminente)
5. confidence = "low" quando a inferência for ambígua
6. NUNCA retorne markdown, apenas JSON puro`;

export async function extractCommitments(
  transcriptText: string
): Promise<{
  commitments: ExtractedCommitment[];
  title: string;
  participants: string[];
  summary: string;
}> {
  for (let attempt = 1; attempt <= MAX_RETRIES.AI_EXTRACTION; attempt++) {
    try {
      const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODELS.EXTRACTION,
          messages: [
            { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
            { role: 'user', content: `Analise esta transcrição de reunião:\n\n${transcriptText}` },
          ],
          temperature: 0.1,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI API ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI não retornou JSON válido');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        commitments: parsed.commitments || [],
        title: parsed.title || 'Reunião sem título',
        participants: parsed.participants || [],
        summary: parsed.summary || '',
      };
    } catch (error) {
      if (attempt === MAX_RETRIES.AI_EXTRACTION) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  throw new Error('Falha na extração de compromissos');
}
