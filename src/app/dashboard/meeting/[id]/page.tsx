'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Commitment {
  id: string;
  title: string;
  description: string;
  owner_name: string;
  status: string;
  priority: string;
  confidence: string;
  commitment_type: string;
  due_date: string;
  source_excerpt: string;
}

interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  status: string;
  transcripts: { full_text: string }[];
  commitments: Commitment[];
}

export default function MeetingDetail() {
  const params = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMeeting(params.id as string);
    }
  }, [params.id]);

  async function fetchMeeting(id: string) {
    try {
      const res = await fetch(`/api/meetings/${id}`);
      const data = await res.json();
      setMeeting(data.meeting);
    } catch (err) {
      console.error('Error fetching meeting:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(commitmentId: string, status: string) {
    try {
      await fetch(`/api/commitments/${commitmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (meeting) {
        setMeeting({
          ...meeting,
          commitments: meeting.commitments.map(c =>
            c.id === commitmentId ? { ...c, status } : c
          ),
        });
      }
    } catch (err) {
      console.error('Error updating:', err);
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!meeting) return <div className="p-8 text-center">Reunião não encontrada</div>;

  const pending = meeting.commitments.filter(c => c.status === 'pending');
  const confirmed = meeting.commitments.filter(c => c.status === 'confirmed');
  const completed = meeting.commitments.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Voltar ao Dashboard
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            <p className="text-gray-500">
              {new Date(meeting.meeting_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm ${
            meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
            meeting.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {meeting.status === 'completed' ? 'Concluída' :
             meeting.status === 'processing' ? 'Processando...' : 'Falhou'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Compromissos ({meeting.commitments.length})</h2>

            {meeting.commitments.length === 0 ? (
              <p className="text-gray-500">Nenhum compromisso extraído</p>
            ) : (
              <div className="space-y-4">
                {meeting.commitments.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{c.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        c.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        c.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        c.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {c.priority}
                      </span>
                    </div>

                    {c.description && (
                      <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                    )}

                    <div className="flex gap-2 text-xs text-gray-500 mb-3">
                      {c.owner_name && <span>👤 {c.owner_name}</span>}
                      {c.due_date && <span>📅 {c.due_date}</span>}
                      <span>🎯 {c.confidence}</span>
                    </div>

                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3">
                      &ldquo;{c.source_excerpt}&rdquo;
                    </div>

                    <div className="flex gap-2">
                      {c.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(c.id, 'confirmed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Confirmar
                        </button>
                      )}
                      {(c.status === 'pending' || c.status === 'confirmed') && (
                        <button
                          onClick={() => updateStatus(c.id, 'completed')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Concluir
                        </button>
                      )}
                      <span className={`px-3 py-1 rounded text-sm ${
                        c.status === 'completed' ? 'bg-green-100 text-green-800' :
                        c.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status === 'completed' ? 'Concluído' :
                         c.status === 'confirmed' ? 'Confirmado' :
                         c.status === 'pending' ? 'Pendente' : c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Resumo</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold text-center">{meeting.commitments.length}</div>
                <div className="text-sm text-gray-500 text-center">Total</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-600">{pending.length}</div>
                  <div className="text-xs text-gray-500">Pendentes</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{confirmed.length}</div>
                  <div className="text-xs text-gray-500">Confirmados</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{completed.length}</div>
                  <div className="text-xs text-gray-500">Concluídos</div>
                </div>
              </div>
            </div>

            {meeting.transcripts?.[0] && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Transcrição</h2>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto text-sm">
                  {meeting.transcripts[0].full_text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
