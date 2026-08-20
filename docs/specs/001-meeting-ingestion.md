# Spec 001 — Meeting Ingestion

## Objetivo
Permitir que o usuário importe transcrições de reuniões para o sistema.

## Contexto
A reunião já aconteceu. O usuário possui uma transcrição (texto ou arquivo de áudio/vídeo) que precisa ser ingerida pelo sistema.

## Requisitos Funcionais

### RF-001: Upload de Transcrição Texto
- O usuário pode colar o texto da transcrição diretamente
- Suporte a Markdown e texto simples
- Validação de tamanho máximo (100KB)

### RF-002: Upload de Arquivo
- Suporte a .txt, .md para transcrição textual
- Suporte a .mp4, .mkv, .mp3, .wav para áudio/vídeo (transcrição automática)
- Tamanho máximo: 500MB

### RF-003: Metadata da Reunião
- Título (obrigatório)
- Data da reunião (obrigatório)
- Duração (opcional, calculada automaticamente se arquivo)
- Participantes (opcional, detectados automaticamente)

### RF-004: Validação
- Transcrição não pode estar vazia
- Data não pode ser futura (tolerância: 24h)
- Formato de arquivo suportado

## Requisitos Não-Funcionais

### RNF-001: Performance
- Upload de texto: < 1s
- Transcrição de arquivo: < 5min para 1h de áudio

### RNF-002: Segurança
- Arquivos temporários devem ser limpos após processamento
- Sem exposição de dados sensíveis em logs

## Entradas
- Texto da transcrição (string)
- OU arquivo de áudio/vídeo (binary)

## Saídas
- Meeting ID (UUID)
- Status: "processing"
- Transcript ID (quando processado)

## Regras
1. Toda reunião deve ter pelo menos um participante
2. A data da reunião deve ser válida
3. Transcrições duplicadas devem ser detectadas (mesmo texto + mesma data)

## Edge Cases
- Transcrição muito curta (< 10 palavras)
- Transcrição em idioma diferente do configurado
- Arquivo corrompido
- Timeout na transcrição

## Critérios de Aceite

- [ ] Usuário pode colar texto e criar reunião
- [ ] Usuário pode fazer upload de arquivo de áudio
- [ ] Sistema transcreve automaticamente
- [ ] Metadata é preenchida corretamente
- [ ] Erros são tratados com mensagens claras

## Testes
- Unit: validação de input, parsing de metadata
- Integration: upload + persistência no Supabase
- E2E: fluxo completo de criação de reunião

## Dependências
- Supabase (persistência)
- Cohere API (transcrição)
