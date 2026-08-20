# Análise do Repositório Existente

## Data: 2026-08-20

## Repositórios Analizados

### 1. Patrimar/ (Projeto Local)

**Localização:** `C:\Users\otawio\Documents\Projeto\Patrimar`

**O que é:** Sistema manual de transcrição e resumo de reuniões do projeto Patrimar.

**Componentes:**
- `monitor_transcricao.py` — Folder watcher que detecta novos vídeos/áudios
- Usa Cohere API para transcrição
- Gera resumos em Markdown
- Análise baseada em keywords (não IA real)

**Padrão Arquitetural:**
- Script Python standalone
- Processamento em lote
- Saída em Markdown + JSON
- Sem persistência em banco

**Reutilizável:**
- Padrão de chamada Cohere API
- Padrão de geração de Markdown
- Estrutura de frontmatter Obsidian
- Lógica de detecção de participantes

**Limitações:**
- Sem extração de compromissos via IA
- Sem persistência em banco
- Sem notificações
- Sem autenticação
- Sem dashboard

---

### 2. video-knowledge-vault (Skill OpenCode)

**Localização:** `.config/opencode/skills/video-knowledge-vault`

**O que é:** Skill de transcrição e análise de vídeos para "segundo cérebro".

**Componentes:**
- `transcribe_local_video.py` — Transcrição via Cohere API
- `analyze_content.py` — Análise IA com prompts
- `export_markdown.py` — Exportação para Obsidian
- `export_notion.py` — Exportação para Notion

**Padrão Arquitetural:**
- Scripts Python modulares
- Pipeline: input → transcrição → análise → exportação
- Config via `.env`
- Output estruturado (JSON + Markdown)

**Reutilizável:**
- `transcribe_local_video.py` — base da integração Cohere
- Padrão de prompts estruturados
- Padrão de exportação

---

### 3. meeting-transcribe (Skill Claude)

**Localização:** `.claude/skills/meeting-transcribe`

**O que é:** Transcrição offline com diarização de falantes.

**Componentes:**
- whisper.cpp para transcrição
- pyannote.audio para diarização
- Processamento 100% local

**Reutilizável:**
- Conceito de diarização (futuro)
- Pipeline de processamento

**Limitações:**
- Requer modelos locais grandes
- Sem integração com banco

---

### 4. KV7/ALOP/ (Gestão de Tarefas)

**Localização:** `Projeto/KV7/ALOP/`

**O que é:** Integração com Plane.so para gestão de tarefas do projeto ALOP.

**Componentes:**
- MCP server do Plane
- Scripts de consulta e relatório
- Sincronização de tarefas

**Reutilizável:**
- Padrão de integração MCP
- Conceito de vinculação tarefa-compromisso (futuro)

---

## Conclusões

### O que já existe e pode ser reaproveitado

| Componente | Origem | Impacto |
|---|---|---|
| Transcrição Cohere API | video-knowledge-vault | **ALTO** |
| Padrão de prompts IA | Patrimar + video-knowledge-vault | **ALTO** |
| Geração de Markdown | Patrimar | **MÉDIO** |
| Folder watcher pattern | Patrimar | **BAIXO** |
| Integração MCP | KV7/ALOP | **FUTURO** |

### O que NÃO existe (precisa criar do zero)

- Schema de banco de dados
- Extração de compromissos via IA
- Motor de classificação
- Resolução temporal
- Sistema de notificações
- Human-in-the-loop
- Dashboard
- Autenticação
- API REST

### Riscos Identificados

1. **NTFY não implementado** — precisa criar do zero
2. **Repositório observabilidade inacessível** — timeout no clone
3. **Sem testes existentes** — precisa criar suite completa
4. **Dependência de Cohere API** — custo por transcrição
5. **Timezone Brasil** — complexidade na resolução temporal
