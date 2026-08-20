# Spec 003 — Commitment Extraction

## Objetivo
Usar IA para extrair compromissos, decisões e ações de uma transcrição.

## Requisitos Funcionais

### RF-001: Extração de Compromissos
- Identificar frases que indicam obrigação
- Classificar tipo: CONFIRMED, SUGGESTED, TASK, DECISION, PENDING
- Extrair: título, responsável, prazo, evidência

### RF-002: Classificação de Confiança
- HIGH: evidência explícita ("Vou fazer", "Consigo")
- MEDIUM: implícito mas provável ("Precisamos entregar")
- LOW: ambíguo ("Talvez", "Se possível")

### RF-003: Extração de Responsável
- Detectar nome na frase
- Associar a participante conocido
- Marcar UNKNOWN se não identificado

### RF-004: Extração de Prazo
- Detectar expressões temporais
- Converter para data absoluta
- Marcar UNCERTAIN se ambíguo

### RF-005: Evidência
- Cada compromisso deve ter trecho original
- Links para segmento da transcrição
- Metadados de detecção

## Regras de Classificação

### COMPROMISSO CONFIRMADO
- Frase declarativa de ação: "Eu vou...", "Vou fazer..."
- Resposta afirmativa a pergunta: "Você consegue?" → "Consigo"
- Compromisso explícito com prazo

### COMPROMISSO SUGERIDO
- "Talvez eu consiga..."
- "Se der tempo, eu faço..."
- "Podia ser..."

### TAREFA MENCIONADA
- "Precisamos verificar..."
- "Alguém tem que olhar..."
- "Falta fazer..."

### DECISÃO
- "Ficou decidido que..."
- "Vamos fazer assim..."
- "A decisão é..."

### PENDÊNCIA
- "Depois precisamos..."
- "Em breve..."
- "Na próxima vez..."

## Prompt de Extração

```
Você é um analista de reuniões corporativas. Analise a transcrição e extraia todos os compromissos, decisões e ações.

Para cada item encontrado, retorne:
- type: COMPROMISSO_CONFIRMADO | COMPROMISSO_SUGERIDO | TAREFA | DECISAO | PENDENCIA
- title: descrição curta
- owner: nome do responsável (se identificado)
- due_date: data no formato YYYY-MM-DD (se mencionada)
- due_time: horário no formato HH:MM (se mencionado)
- confidence: HIGH | MEDIUM | LOW
- source_excerpt: trecho exato da transcrição

Retorne APENAS o JSON, sem markdown.
```

## Entradas
- Segmentos da transcrição
- Lista de participantes

## Saídas
- Array de compromissos extraídos
- Cada item com: type, title, owner, due_date, due_time, confidence, source_excerpt

## Edge Cases
- Múltiplos responsáveis para o mesmo compromisso
- Prazo vago ("próxima semana", "em breve")
- Compromisso condicional ("se o cliente aprovar...")
- Homônimos entre participantes

## Critérios de Aceite

- [ ] IA extrai compromissos com confiança >= 80%
- [ ] Falsos positivos < 20%
- [ ] Cada compromisso tem evidência
- [ ] Responsáveis são identificados quando presentes
- [ ] Prazos são extraídos quando mencionados

## Testes
- Unit: classificação, parsing de datas
- Integration: chamada IA + persistência
- E2E: transcrição → compromissos extraídos
