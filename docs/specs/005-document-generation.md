# Spec 005 — Document Generation

## Objetivo
Gerar documentação estruturada a partir de transcrições e compromissos.

## Tipos de Documento

### 1. Resumo Executivo
- Título da reunião
- Data e duração
- Participantes
- Resumo em 3-5 parágrafos
- Decisões principais

### 2. Lista de Compromissos
- Tabela com todos os compromissos
- Status, responsável, prazo
- Links para detalhes

### 3. ATA de Reunião
- Formato completo com timestamps
- Falas por participante
- Decisões e ações

### 4. Próximos Passos
- Compromissos pendentes
- Prazos próximos
- Riscos identificados

## Formato de Saída

### Markdown (padrão)
```markdown
# ATA — [Título] — [Data]

## Participantes
- Participante 1
- Participante 2

## Resumo
[Resumo executivo]

## Decisões
1. [Decisão 1]

## Compromissos
| # | Compromisso | Responsável | Prazo | Status |
|---|-------------|-------------|-------|--------|

## Próximos Passos
1. [Próximo passo]
```

## Critérios de Aceite

- [ ] Resumo é gerado automaticamente
- [ ] Compromissos aparecem na documentação
- [ ] Formato é legível e profissional
- [ ] Documento pode ser exportado (Markdown, PDF futuro)
