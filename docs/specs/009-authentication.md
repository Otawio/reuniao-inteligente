# Spec 009 — Authentication

## Objetivo
Autenticar usuários via Supabase Auth.

## Fluxo

1. Usuário faz login com email/senha
2. Supabase Auth valida credenciais
3. Token JWT é retornado
4. Frontend armazena token
5. API routes validam token

## Critérios de Aceite

- [ ] Login com email/senha funciona
- [ ] RLS filtra dados por usuário
- [ ] Token é renovado automaticamente
- [ ] Logout limpa sessão
