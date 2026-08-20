# Spec 010 — Observability

## Objetivo
Observabilidade completa do sistema.

## Componentes

### Logging
- Structured logging (JSON)
- Níveis: ERROR, WARN, INFO, DEBUG
- Sem PII em logs

### Métricas
- Compromissos criados por dia
- Taxa de confirmação
- Tempo médio de processamento
- Erros por tipo

### Alertas
- Falha na transcrição
- Erro na chamada IA
- Falha no envio de notificação

## Critérios de Aceite

- [ ] Logs estruturados funcionam
- [ ] Métricas são coletadas
- [ ] Alertas são configurados
