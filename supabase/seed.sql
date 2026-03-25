-- Seed data for local development
-- Run after migrations: npx supabase db reset

-- Example FAQ items (ES/EN)
INSERT INTO faq_items (id, question_es, question_en, answer_es, answer_en, category, sort_order)
VALUES
  (gen_random_uuid(), '¿Qué es el microdosing?', 'What is microdosing?', 'El microdosing consiste en...', 'Microdosing consists of...', 'practical', 1),
  (gen_random_uuid(), '¿Es seguro?', 'Is it safe?', 'La seguridad depende de...', 'Safety depends on...', 'safety', 2);
