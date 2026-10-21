-- Fix: encode() in Postgres 15 does not support 'base64url'.
-- Change the default to hex, which is always available.

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'cards' AND schemaname = 'public'
  ) THEN
    ALTER TABLE cards
      ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(32), 'hex');
  ELSE
    -- Cards table never got created (initial migration failed on base64url).
    CREATE TABLE cards (
      id            uuid primary key default gen_random_uuid(),
      public_token  text unique not null default encode(gen_random_bytes(32), 'hex'),
      tenant_id     uuid not null references tenants(id) on delete cascade,
      program_id    uuid not null references programs(id),
      customer_id   uuid not null references customers(id),
      stamp_count   int not null default 0,
      status        text not null default 'active'
                      check (status in ('active','redeemed','expired','cancelled')),
      created_at    timestamptz not null default now(),
      unique (program_id, customer_id)
    );
    create index on cards (tenant_id);
    create index on cards (public_token);
    alter table cards enable row level security;
    create policy "tenant members read cards"
      on cards for select using (tenant_id = public.current_tenant_id());
    create policy "owner manager write cards"
      on cards for all using (
        tenant_id = public.current_tenant_id()
        and public.current_tenant_role() in ('owner','manager')
      );
  END IF;
END $$;
