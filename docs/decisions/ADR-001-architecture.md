# ADR-001: Arquitetura do Sistema

## Status
Aceito

## Contexto
Precisamos de uma plataforma de meeting intelligence que:
- Transforme transcrições em compromissos rastreáveis
- Envie notificações
- Permita human-in-the-loop
- Escale para múltiplos usuários

## Decisão

### Stack
- **Frontend:** Next.js 15 (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** OpenAI via 9Router (já configurado)
- **Transcription:** Cohere API (já funcional)
- **Notifications:** NTFY (futuro)
- **Deployment:** Vercel

### Arquitetura
- Clean Architecture com separação domínio/infraestrutura
- API Routes no Next.js (serverless)
- Supabase para persistência e auth
- Serviços desacoplados (transcrição, IA, notificações)

### Padrões
- Repository Pattern para acesso a dados
- Service Pattern para lógica de negócio
- Provider Pattern para notificações (NTFY, email, etc.)

## Consequências

### Positivas
- Serverless = escala automática
- Supabase = auth + RLS grátis
- Clean Architecture = testável
- Providers desacoplados = fácil trocar NTFY por email

### Negativos
- Dependência de serviços externos (Supabase, Cohere)
- Custo de IA por transcrição
- Complexidade de timezone em produção
