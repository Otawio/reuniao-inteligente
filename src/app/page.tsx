import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Reunião Inteligente
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Transforme suas reuniões em compromissos rastreáveis com IA
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-2">🎙️</div>
            <h3 className="font-semibold mb-1">Transcreva</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload de áudio/vídeo com transcrição automática via Cohere
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">Extraia</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              IA identifica compromissos, tarefas e decisões automaticamente
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold mb-1">Acompanhe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dashboard com status, prazos e notificações
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </main>
    </div>
  );
}
