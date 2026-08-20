'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  status: string;
  created_at: string;
  commitments: { id: string; status: string }[];
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      const res = await fetch('/api/meetings');
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingDate', new Date().toISOString());

    try {
      const res = await fetch('/api/meetings/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        fetchMeetings();
      } else {
        alert(data.error || 'Erro no upload');
      }
    } catch (err) {
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }

  // Calculate stats
  const totalMeetings = meetings.length;
  const totalCommitments = meetings.reduce((acc, m) => acc + (m.commitments?.length || 0), 0);
  const pendingCommitments = meetings.reduce(
    (acc, m) => acc + (m.commitments?.filter(c => c.status === 'pending').length || 0), 0
  );
  const completedCommitments = meetings.reduce(
    (acc, m) => acc + (m.commitments?.filter(c => c.status === 'completed').length || 0), 0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas reuniões e compromissos</p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            disabled={uploading}
          />
          <span className="btn-glow text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Reunião
              </>
            )}
          </span>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Reuniões</span>
          </div>
          <div className="text-3xl font-bold">{totalMeetings}</div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Compromissos</span>
          </div>
          <div className="text-3xl font-bold">{totalCommitments}</div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Pendentes</span>
          </div>
          <div className="text-3xl font-bold">{pendingCommitments}</div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Concluídos</span>
          </div>
          <div className="text-3xl font-bold">{completedCommitments}</div>
        </div>
      </div>

      {/* Upload Zone */}
      {meetings.length === 0 && !loading && (
        <div
          className={`card-elevated p-12 mb-8 text-center transition-all ${
            dragActive ? 'border-primary-500 bg-primary-50' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Arraste um arquivo aqui</h3>
          <p className="text-muted-foreground mb-6">
            Suporta MP3, WAV, MP4, WebM e outros formatos de áudio/vídeo
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Selecionar Arquivo
            <input
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      )}

      {/* Meetings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mt-4">Carregando reuniões...</p>
        </div>
      ) : meetings.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Reuniões Recentes</h2>
          <div className="space-y-3">
            {meetings.map((meeting, index) => {
              const pending = meeting.commitments?.filter(c => c.status === 'pending').length || 0;
              const completed = meeting.commitments?.filter(c => c.status === 'completed').length || 0;
              const total = meeting.commitments?.length || 0;

              return (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meeting/${meeting.id}`}
                  className="card-elevated block p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(meeting.meeting_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
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
                  {total > 0 && (
                    <div className="mt-4 flex gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                        {total} compromissos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-warning" />
                        {pending} pendentes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        {completed} concluídos
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
