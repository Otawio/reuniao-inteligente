# Spec 004 — Date Resolution

## Objetivo
Resolver expressões temporais relativas em datas absolutas.

## Expressões Suportadas

| Expressão | Resolução |
|-----------|-----------|
| "amanhã" | data_atual + 1 |
| "hoje" | data_atual |
| "ontem" | data_atual - 1 |
| "próxima terça" | próxima terça-feira |
| "até sexta" | próxima sexta-feira |
| "próxima semana" | data_atual + 7 dias |
| "no final do mês" | último dia do mês |
| "até o final do dia" | data_atual 23:59 |
| "em 3 dias" | data_atual + 3 |
| "daqui a 2 horas" | agora + 2h |

## Regras

1. Sempre usar timezone configurado (default: America/Sao_Paulo)
2. Se data cair em feriado, usar próximo dia útil
3. Se horário não especificado, usar 18:00 (fim do expediente)
4. Marcar como UNCERTAIN se não conseguir resolver

## Critérios de Aceite

- [ ] "amanhã" resolve corretamente
- [ ] "próxima terça" resolve corretamente
- [ ] Timezone é respeitado
- [ ] Feriados são considerados (opcional)
