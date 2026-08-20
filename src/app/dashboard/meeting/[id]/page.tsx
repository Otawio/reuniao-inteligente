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
  const [showTranscript, setShowTranscript] = useState(false);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mt-4">Carregando reunião...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Reunião não encontrada</h3>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pending = meeting.commitments.filter(c => c.status === 'pending');
  const confirmed = meeting.commitments.filter(c => c.status === 'confirmed');
  const completed = meeting.commitments.filter(c => c.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Dashboard
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{meeting.title}</h1>
            <p className="text-muted-foreground">
              {new Date(meeting.meeting_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <span className={`badge ${
            meeting.status === 'completed' ? 'badge-success' :
            meeting.status === 'processing' ? 'badge-warning' :
            'badge-danger'
          }`}>
            {meeting.status === 'completed' ? 'Concluída' :
             meeting.status === 'processing' ? 'Processando...' : 'Falhou'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Commitments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Compromissos ({meeting.commitments.length})</h2>
          </div>

          {meeting.commitments.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-muted-foreground">Nenhum compromisso extraído</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meeting.commitments.map((c, index) => (
                <div
                  key={c.id}
                  className="card-elevated p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{c.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        c.priority === 'urgent' ? 'badge-danger' :
                        c.priority === 'high' ? 'badge-warning' :
                        c.priority === 'medium' ? 'badge-info' :
                        'badge-neutral'
                      }`}>
                        {c.priority === 'urgent' ? 'Urgente' :
                         c.priority === 'high' ? 'Alta' :
                         c.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                      <span className={`badge ${
                        c.status === 'completed' ? 'badge-success' :
                        c.status === 'confirmed' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {c.status === 'completed' ? 'Concluído' :
                         c.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  {c.description && (
                    <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    {c.owner_name && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {c.owner_name}
                      </span>
                    )}
                    {c.due_date && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {c.due_date}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {c.confidence === 'high' ? 'Alta confiança' :
                       c.confidence === 'medium' ? 'Média confiança' : 'Baixa confiança'}
                    </span>
                  </div>

                  {c.source_excerpt && (
                    <div className="bg-muted/50 p-3 rounded-xl text-sm text-muted-foreground italic mb-4">
                      &ldquo;{c.source_excerpt}&rdquo;
                    </div>
                  )}

                  <div className="flex gap-2">
                    {c.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(c.id, 'confirmed')}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                    {(c.status === 'pending' || c.status === 'confirmed') && (
                      <button
                        onClick={() => updateStatus(c.id, 'completed')}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Resumo</h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold gradient-text">{meeting.commitments.length}</div>
              <div className="text-sm text-muted-foreground">Total de compromissos</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-warning/10">
                <div className="text-xl font-bold text-warning">{pending.length}</div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-info/10">
                <div className="text-xl font-bold text-info">{confirmed.length}</div>
                <div className="text-xs text-muted-foreground">Confirmados</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-success/10">
                <div className="text-xl font-bold text-success">{completed.length}</div>
                <div className="text-xs text-muted-foreground">Concluídos</div>
              </div>
            </div>
          </div>

          {/* Transcript Accordion */}
          {meeting.transcripts?.[0] && (
            <div className="card-elevated overflow-hidden">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold">Transcrição</span>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform ${showTranscript ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTranscript && (
                <div className="px-4 pb-4 border-t">
                  <div className="max-h-96 overflow-y-auto text-sm text-muted-foreground mt-4 whitespace-pre-wrap">
                    {meeting.transcripts[0].full_text}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
