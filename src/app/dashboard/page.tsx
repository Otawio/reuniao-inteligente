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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <span className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
              {uploading ? 'Processando...' : '+ Nova Reunião'}
            </span>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma reunião ainda</h3>
            <p className="text-gray-500 mb-4">Faça upload de um arquivo de áudio ou vídeo para começar</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {meetings.map((meeting) => {
              const pending = meeting.commitments?.filter(c => c.status === 'pending').length || 0;
              const completed = meeting.commitments?.filter(c => c.status === 'completed').length || 0;
              const total = meeting.commitments?.length || 0;

              return (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meeting/${meeting.id}`}
                  className="block p-6 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{meeting.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(meeting.meeting_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {meeting.status === 'completed' ? 'Concluída' :
                       meeting.status === 'processing' ? 'Processando...' : 'Falhou'}
                    </span>
                  </div>
                  {total > 0 && (
                    <div className="mt-3 flex gap-4 text-sm text-gray-600">
                      <span>{total} compromissos</span>
                      <span>{pending} pendentes</span>
                      <span>{completed} concluídos</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
