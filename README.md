# Reunião Inteligente

Plataforma de **Meeting Intelligence** que transforma transcrições de reuniões em compromissos rastreáveis com notificações, monitoramento e human-in-the-loop.

## Visão Geral

```
REUNIÃO
  → TRANSCRIÇÃO
  → ANÁLISE POR IA
  → DOCUMENTAÇÃO
  → IDENTIFICAÇÃO DE COMPROMISSOS
  → VALIDAÇÃO DOS COMPROMISSOS
  → RESPONSÁVEIS
  → DATAS / HORÁRIOS
  → STATUS
  → NOTIFICAÇÕES
  → ACOMPANHAMENTO ATÉ CONCLUSÃO
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI via 9Router |
| Transcription | Cohere API |
| Notifications | NTFY (futuro) |
| Deployment | Vercel |
| Repository | GitHub |

## Estrutura

```
reuniao-inteligente/
├── supabase/          # Schema, migrations, seed
├── src/
│   ├── app/           # Next.js App Router
│   ├── lib/           # Core libraries
│   │   ├── ai/        # AI provider + prompts
│   │   ├── commitment-engine/  # Classificação + deadlines
│   │   ├── domain/    # Tipos e constantes
│   │   ├── notifications/  # Notification service
│   │   ├── supabase/  # Client + server config
│   │   └── transcription/  # Cohere API integration
│   └── types/         # TypeScript types
├── docs/
│   ├── specs/         # Specification-Driven Development
│   ├── decisions/     # Architecture Decision Records
│   └── runbooks/      # Operational runbooks
└── tests/             # Unit + integration tests
```

## Getting Started

```bash
# 1. Clone
git clone https://github.com/otawio/reuniao-inteligente.git
cd reuniao-inteligente

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Setup Supabase
npx supabase db push

# 5. Run
npm run dev
```

## Environment Variables

Ver `.env.example` para todas as variáveis necessárias.

## Desenvolvimento

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Lint
npm run test         # Tests
```

## Arquitetura

Ver `ARCHITECTURE.md` para o mapa arquitetural completo.

## Decisões

Ver `docs/decisions/` para Architecture Decision Records.

## Licença

Projeto interno KV7.
