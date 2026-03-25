-- Run this SQL in your Supabase project:
-- Dashboard -> SQL Editor -> New Query -> paste and run

create table if not exists conversations (
  id          uuid primary key default gen_random_uuid(),
  sender_id   text        not null,
  platform    text        not null default 'instagram',
  message     text        not null,
  ai_response text        not null,
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by sender
create index if not exists conversations_sender_id_idx on conversations (sender_id);

-- Index for time-ordered queries
create index if not exists conversations_created_at_idx on conversations (created_at desc);

-- Enable Row Level Security
alter table conversations enable row level security;

-- Allow the service role full access (used by your webhook)
create policy "Service role full access"
  on conversations
  for all
  using (true)
  with check (true);

-- Multi-user SaaS tables
create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  email       text        not null unique,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists accounts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid        not null references users(id) on delete cascade,
  provider            text        not null default 'facebook',
  provider_account_id text,
  instagram_id        text        not null unique,
  facebook_token      text        not null,
  custom_ai_prompt    text,
  token_expires_at    timestamptz,
  is_active           boolean     not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint accounts_instagram_id_not_empty check (length(trim(instagram_id)) > 0),
  constraint accounts_facebook_token_not_empty check (length(trim(facebook_token)) > 0)
);

create unique index if not exists accounts_provider_identity_idx
  on accounts(provider, provider_account_id)
  where provider_account_id is not null;

create index if not exists accounts_user_id_idx on accounts (user_id);
create index if not exists accounts_instagram_id_idx on accounts (instagram_id);

-- updated_at trigger helper
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

drop trigger if exists accounts_updated_at on accounts;
create trigger accounts_updated_at
  before update on accounts
  for each row execute function update_updated_at();

alter table users enable row level security;
alter table accounts enable row level security;

drop policy if exists "Service role full access users" on users;
create policy "Service role full access users"
  on users
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role full access accounts" on accounts;
create policy "Service role full access accounts"
  on accounts
  for all
  to service_role
  using (true)
  with check (true);
