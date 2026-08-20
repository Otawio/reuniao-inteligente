# Arquitetura — Reunião Inteligente

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                       │
│                    Next.js Frontend                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/API
┌──────────────────────────▼──────────────────────────────────┐
│                    API LAYER (Vercel)                       │
│                  Next.js API Routes                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Meetings    │  │ Commitments  │  │  Notifications  │   │
│  │  API        │  │  API         │  │  API            │   │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘   │
│         │                │                    │             │
│  ┌──────▼──────────────▼────────────────────▼────────┐    │
│  │              DOMAIN SERVICES                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │    │
│  │  │Transcript│ │Commitment│ │  Notification    │  │    │
│  │  │Processor │ │ Engine   │ │  Service         │  │    │
│  │  └────┬─────┘ └────┬─────┘ └────────┬─────────┘  │    │
│  │       │            │                │             │    │
│  │  ┌────▼─────┐ ┌────▼─────┐ ┌───────▼────────┐  │    │
│  │  │Cohere    │ │AI        │ │  NTFY          │  │    │
│  │  │Transcribe│ │Provider  │ │  Provider      │  │    │
│  │  └──────────┘ └──────────┘ └────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    DATA LAYER                               │
│                  Supabase (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────────┐ ┌─────────────────┐        │
│  │ meetings │ │ commitments  │ │ notifications   │        │
│  │ users    │ │ participants │ │ transcripts     │        │
│  │ projects │ │ tags         │ │ events          │        │
│  └──────────┘ └──────────────┘ └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Módulos

### 1. Meeting Ingestion
- Upload de arquivo de áudio/vídeo
- Importação de transcrição existente
- Validação e normalização

### 2. Transcript Processing
- Transcrição via Cohere API
- Segmentação por falante
- Timestamps e normalização

### 3. AI Analysis
- Extração de compromissos
- Classificação de confiança
- Identificação de responsáveis
- Extração de datas

### 4. Commitment Engine
- Classificação (CONFIRMED, PENDING, etc.)
- Resolução temporal ("amanhã" → data)
- Cálculo de deadlines
- Status tracking

### 5. Notification Service
- Abstração multi-canal
- NTFY (implementação inicial)
- Email, WhatsApp, Slack (futuro)

### 6. Document Generation
- Resumo executivo
- ATA de reunião
- Lista de ações

## Fluxo Principal

```
1. Usuário faz upload de arquivo ou cola transcrição
2. Sistema transcreve (se áudio/vídeo) ou usa texto fornecido
3. IA analisa e extrai compromissos
4. Compromissos são salvos com status PENDING
5. Usuário confirma/edita/rejeita compromissos
6. Sistema gera documentação
7. Deadline engine monitora prazos
8. Notificações são enviadas conforme proximidade
```

## Princípios Arquiteturais

- **Clean Architecture** — separação entre domínio e infraestrutura
- **SOLID** — responsabilidades claras
- **DRY** — reutilização de componentes existentes
- **KISS** — simplicidade primeiro
- **YAGNI** — implementar apenas o necessário
