# Spec 007 — NTFY Notifications

## Objetivo
Enviar notificações push via NTFY para compromissos.

## Tipos de Notificação

| Tipo | Cor | Trigger |
|------|-----|---------|
| 🔴 ATRASADO | Vermelho | Compromisso passou do prazo |
| 🟠 PRÓXIMO DO PRAZO | Laranja | Falta < 24h |
| 🟡 PENDÊNCIA | Amarelo | Compromissos pendentes |
| 🟢 CONCLUÍDO | Verde | Compromisso marcado como concluído |
| 🔵 NOVO | Azul | Novo compromisso identificado |

## Formato da Mensagem

```
🔴 ATRASADO

Compromisso: Enviar documentação revisada
Responsável: Otávio
Prazo: 20/08/2026 15:00
Reunião: Daily 19/08/2026
```

## Configuração

```env
NTFY_BASE_URL=https://ntfy.sh
NTFY_TOPIC=meu-topic-secreto
NTFY_TOKEN=  # opcional para auth
```

## Critérios de Aceite

- [ ] Notificação é enviada quando compromisso é criado
- [ ] Notificação de atraso é enviada diariamente
- [ ] Notificação de conclusão é enviada
- [ ] Formato é legível no celular
