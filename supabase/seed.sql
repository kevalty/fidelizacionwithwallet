-- Seed data for local development only.
-- Creates a demo tenant usable in previews.

insert into tenants (id, slug, name, plan_id, status) values
  ('00000000-0000-0000-0000-000000000001', 'demo-cafe', 'Café Demo', 'pro', 'active')
on conflict (slug) do nothing;

insert into locations (tenant_id, name, address) values
  ('00000000-0000-0000-0000-000000000001', 'Local Principal', 'Av. Daniel León Borja, Riobamba')
on conflict do nothing;

insert into programs (tenant_id, name, stamps_required, reward_text) values
  ('00000000-0000-0000-0000-000000000001', 'Tarjeta de Sellos', 5, 'El 5.º café gratis')
on conflict do nothing;
