-- Dados de teste para desenvolvimento

-- Usuário de teste
INSERT INTO users (id, email, name, timezone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'otavio@kv7.com.br', 'Otávio', 'America/Sao_Paulo'),
  ('00000000-0000-0000-0000-000000000002', 'jessica@alopmais.com', 'Jéssica', 'America/Sao_Paulo'),
  ('00000000-0000-0000-0000-000000000003', 'fabio@alopmais.com', 'Fábio', 'America/Sao_Paulo');

-- Tags
INSERT INTO tags (name, color) VALUES
  ('urgente', '#EF4444'),
  ('follow-up', '#F59E0B'),
  ('decisão', '#3B82F6'),
  ('entrega', '#10B981'),
  ('revisão', '#8B5CF6');
