# MCP Setup

## MCPs Configurados

### Plane (Já configurado)
- **Uso:** Gestão de tarefas, vinculação futura de compromissos
- **Status:** Ativo

### Cohere Transcribe (Já configurado)
- **Uso:** Transcrição de áudio/vídeo
- **Status:** Ativo

### Supabase (A configurar)
- **Uso:** Database operations, auth, real-time
- **Ação:** Instalar MCP server do Supabase

```json
{
  "mcp": {
    "supabase": {
      "type": "local",
      "command": ["npx", "-y", "@supabase/mcp-server@latest", "--access-token", "<YOUR_TOKEN>"],
      "enabled": true
    }
  }
}
```

### GitHub (A configurar)
- **Uso:** Repo management, CI/CD
- **Ação:** Configurar `gh auth login`

## Skills Relevantis

| Skill | Uso no Projeto |
|-------|---------------|
| `video-knowledge-vault` | Padrão de transcrição (reutilizar) |
| `meeting-transcribe` | Referência para diarização futura |
| `postgres-patterns` | Patterns para Supabase |
| `api-design` | Design das API routes |
| `tdd-workflow` | Testes |
| `security-review` | Review de segurança |
