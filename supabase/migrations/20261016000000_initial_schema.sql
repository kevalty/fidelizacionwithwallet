-- Multi-tenant loyalty platform initial schema
-- All tenant data tables carry tenant_id and are protected by RLS.

create extension if not exists "pgcrypto";

-- ─── PLANS & TENANTS ────────────────────────────────────────────────────────

create table plans (
  id           text primary key,             -- 'basic', 'pro', 'chain'
  name         text not null,
  price_usd    numeric(8,2) not null,
  max_locations int not null default 1,
  features     jsonb not null default '{}'
);

insert into plans (id, name, price_usd, max_locations) values
  ('basic', 'Básico',  17.00, 1),
  ('pro',   'Pro',     35.00, 3),
  ('chain', 'Cadena',  79.00, 20);

create table tenants (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  plan_id      text references plans(id) default 'basic',
  status       text not null default 'trial'   check (status in ('trial','active','suspended','cancelled')),
  branding     jsonb not null default '{}',    -- logo_url, primary_color, secondary_color
  created_at   timestamptz not null default now()
);

-- ─── LOCATIONS ──────────────────────────────────────────────────────────────

create table locations (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  name         text not null,
  address      text,
  lat          numeric(9,6),
  lng          numeric(9,6),
  timezone     text not null default 'America/Guayaquil',
  created_at   timestamptz not null default now()
);

-- ─── TENANT MEMBERS ─────────────────────────────────────────────────────────

create table tenant_members (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('owner','manager','staff')),
  location_ids uuid[] not null default '{}',   -- empty = all locations
  created_at   timestamptz not null default now(),
  unique (tenant_id, user_id)
);

-- ─── PROGRAMS ───────────────────────────────────────────────────────────────

create table programs (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  name            text not null,
  stamps_required int  not null default 10,
  reward_text     text not null,
  stamp_mode      text not null default 'staff_scan' check (stamp_mode in ('staff_scan','customer_tap')),
  active          bool not null default true,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ─── CUSTOMERS ──────────────────────────────────────────────────────────────

create table customers (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  phone        text,
  email        text,
  name         text,
  created_at   timestamptz not null default now(),
  unique (tenant_id, phone),
  unique (tenant_id, email),
  check (phone is not null or email is not null)
);

-- ─── CONSENTS ───────────────────────────────────────────────────────────────

create table consents (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references customers(id) on delete cascade,
  tenant_id       uuid not null references tenants(id) on delete cascade,
  type            text not null check (type in ('data_storage','marketing')),
  version         text not null,
  granted         bool not null,
  channel         text not null,   -- 'qr', 'nfc', 'staff'
  consented_at    timestamptz not null default now()
);

-- ─── CARDS ──────────────────────────────────────────────────────────────────

create table cards (
  id              uuid primary key default gen_random_uuid(),
  public_token    text unique not null default encode(gen_random_bytes(24), 'base64url'),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  program_id      uuid not null references programs(id),
  customer_id     uuid not null references customers(id),
  stamp_count     int not null default 0,
  status          text not null default 'active' check (status in ('active','redeemed','expired','cancelled')),
  created_at      timestamptz not null default now(),
  unique (program_id, customer_id)
);

-- ─── WALLET PASSES ──────────────────────────────────────────────────────────

create table wallet_passes (
  id              uuid primary key default gen_random_uuid(),
  card_id         uuid not null references cards(id) on delete cascade,
  tenant_id       uuid not null references tenants(id) on delete cascade,
  platform        text not null check (platform in ('apple','google')),
  serial          text,
  push_token      text,
  auth_token      text,
  last_updated_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (card_id, platform)
);

-- ─── NFC TAGS ───────────────────────────────────────────────────────────────

create table nfc_tags (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  location_id     uuid references locations(id),
  status          text not null default 'active' check (status in ('active','inactive')),
  last_read_at    timestamptz,
  created_at      timestamptz not null default now()
);

-- ─── STAMP EVENTS ───────────────────────────────────────────────────────────

create table stamp_events (
  id               uuid primary key default gen_random_uuid(),
  idempotency_key  text unique not null,
  card_id          uuid not null references cards(id),
  tenant_id        uuid not null references tenants(id),
  location_id      uuid references locations(id),
  staff_id         uuid references auth.users(id),
  method           text not null check (method in ('staff_scan','customer_tap')),
  stamped_at       timestamptz not null default now()
);

-- trigger: keep cards.stamp_count in sync
create or replace function increment_stamp_count()
returns trigger language plpgsql security definer as $$
begin
  update cards set stamp_count = stamp_count + 1 where id = new.card_id;
  return new;
end;
$$;

create trigger trg_stamp_count
after insert on stamp_events
for each row execute function increment_stamp_count();

-- ─── REDEMPTIONS ────────────────────────────────────────────────────────────

create table redemptions (
  id           uuid primary key default gen_random_uuid(),
  card_id      uuid not null references cards(id),
  tenant_id    uuid not null references tenants(id),
  staff_id     uuid references auth.users(id),
  redeemed_at  timestamptz not null default now()
);

-- ─── AUDIT LOG ──────────────────────────────────────────────────────────────

create table audit_log (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid references tenants(id),
  actor_id     uuid references auth.users(id),
  action       text not null,
  target_type  text,
  target_id    uuid,
  meta         jsonb,
  created_at   timestamptz not null default now()
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────

create index on locations        (tenant_id);
create index on tenant_members   (tenant_id);
create index on tenant_members   (user_id);
create index on programs         (tenant_id);
create index on customers        (tenant_id);
create index on consents         (tenant_id, customer_id);
create index on cards            (tenant_id);
create index on cards            (public_token);
create index on wallet_passes    (tenant_id);
create index on nfc_tags         (tenant_id);
create index on stamp_events     (tenant_id, card_id);
create index on stamp_events     (idempotency_key);
create index on redemptions      (tenant_id, card_id);
create index on audit_log        (tenant_id, created_at);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
-- Pattern: service role bypasses RLS; authenticated users see only their tenant.
-- Superadmin (Keval) uses service role on the server — never expose the key.

alter table tenants         enable row level security;
alter table locations       enable row level security;
alter table tenant_members  enable row level security;
alter table programs        enable row level security;
alter table customers       enable row level security;
alter table consents        enable row level security;
alter table cards           enable row level security;
alter table wallet_passes   enable row level security;
alter table nfc_tags        enable row level security;
alter table stamp_events    enable row level security;
alter table redemptions     enable row level security;
alter table audit_log       enable row level security;

-- Helpers in public schema (auth schema is restricted in SQL editor).
create or replace function public.current_tenant_id()
returns uuid language sql stable security definer as $$
  select tenant_id from tenant_members where user_id = auth.uid() limit 1;
$$;

create or replace function public.current_tenant_role()
returns text language sql stable security definer as $$
  select role from tenant_members where user_id = auth.uid() limit 1;
$$;

-- tenants: members can read their own tenant; owners/managers can update.
create policy "members read own tenant"
  on tenants for select
  using (id = public.current_tenant_id());

create policy "owner update tenant"
  on tenants for update
  using (id = public.current_tenant_id() and public.current_tenant_role() in ('owner','manager'));

-- Generic pattern for tenant-scoped tables:
-- read: any member of the tenant
-- write: owner or manager (staff is read + stamp only)

do $policies$ declare
  tbl text;
begin
  foreach tbl in array array[
    'locations','programs','customers','consents',
    'cards','wallet_passes','nfc_tags','stamp_events','redemptions','audit_log'
  ] loop
    execute format(
      'create policy "tenant members read %1$s" on %1$s for select using (tenant_id = public.current_tenant_id())', tbl);
    execute format(
      'create policy "owner manager write %1$s" on %1$s for all using (tenant_id = public.current_tenant_id() and public.current_tenant_role() in (''owner'',''manager''))', tbl);
  end loop;
end $policies$;

-- stamp_events: staff can also insert (to stamp a card)
create policy "staff insert stamp_events"
  on stamp_events for insert
  with check (tenant_id = public.current_tenant_id());

-- tenant_members: own row visible
create policy "members read own row"
  on tenant_members for select
  using (user_id = auth.uid());
