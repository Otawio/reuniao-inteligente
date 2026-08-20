# Spec 002 — Transcript Processing

## Objetivo
Processar e normalizar transcrições, segmentando por falante e adicionando timestamps.

## Requisitos Funcionais

### RF-001: Normalização
- Converter para UTF-8
- Remover caracteres especiais
- Normalizar espaços em branco

### RF-002: Segmentação
- Identificar mudanças de falante
- Criar segmentos com timestamps
- Associar cada trecho a um falante

### RF-003: Detecção de Participantes
- Extrair nomes dos trechos ("FALANTE_00: ...")
- Criar lista de participantes únicos
- Permitir mapeamento manual (FALANTE_00 → "Otávio")

## Requisitos Não-Funcionais

### RNF-001: Idioma
- Suporte principal: Português (BR)
- Suporte secundário: Inglês, Espanhol

### RNF-002: Performance
- Processamento de 1h de transcrição: < 30s

## Entradas
- Texto bruto da transcrição
- Idioma detectado

## Saídas
- Array de segmentos (speaker, text, start_time, end_time)
- Lista de participantes

## Regras
1. Cada segmento deve ter no mínimo 1 palavra
2. Falantes desconhecidos devem ser marcados como "UNKNOWN"
3. Segmentos adjacentes do mesmo falante podem ser mesclados

## Critérios de Aceite

- [ ] Transcrição é normalizada corretamente
- [ ] Segmentos são criados com timestamps
- [ ] Participantes são detectados
- [ ] Mapeamento manual funciona

## Testes
- Unit: normalização, parsing
- Integration: processamento completo
