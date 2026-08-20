# Spec 008 — Commitment Monitoring

## Objetivo
Monitorar compromissos e gerenciar seu ciclo de vida.

## Status Possíveis

```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
    ↓           ↓            ↓
CANCELLED   CANCELLED    CANCELLED
    ↓
OVERDUE (automático quando prazo expira)
```

## Regras de Status

- **PENDING**: Criado pela IA, aguardando confirmação
- **CONFIRMADO**: Usuário confirmou
- **IN_PROGRESS**: Em andamento
- **COMPLETED**: Concluído
- **CANCELLED**: Cancelado
- **OVERDUE**: Prazo expirado (automático)

## Callbacks

### Ao confirmar compromisso
1. Atualizar status para CONFIRMED
2. Registrar evento
3. Enviar notificação azul

### Ao completar compromisso
1. Atualizar status para COMPLETED
2. Registrar evento
3. Enviar notificação verde

### Ao expirar prazo
1. Atualizar status para OVERDUE
2. Registrar evento
3. Enviar notificação vermelha

## Critérios de Aceite

- [ ] Status é atualizado corretamente
- [ ] Eventos são registrados
- [ ] Notificações são enviadas nos triggers certos
- [ ] Histórico está completo
