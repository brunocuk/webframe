-- Portal v3: email + 6-digit-code login, support tickets, and build-deadline
-- tracking. Run once in the Supabase dashboard → SQL Editor
-- (after webframe_portal_v2.sql).

-- One-time login codes for the client portal (/portal). Codes are stored
-- hashed and expire after 10 minutes; rows are disposable.
create table if not exists public.webframe_login_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  consumed_at timestamptz
);

create index if not exists webframe_login_codes_email_idx
  on public.webframe_login_codes (email, created_at desc);

-- Simple support tickets, scoped to a project.
create table if not exists public.webframe_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references public.webframe_projects(id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  updated_at timestamptz not null default now()
);

create table if not exists public.webframe_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ticket_id uuid not null references public.webframe_tickets(id) on delete cascade,
  sender text not null check (sender in ('client', 'admin')),
  body text not null
);

create index if not exists webframe_tickets_project_id_idx
  on public.webframe_tickets (project_id);
create index if not exists webframe_ticket_messages_ticket_id_idx
  on public.webframe_ticket_messages (ticket_id, created_at);

alter table public.webframe_login_codes enable row level security;
alter table public.webframe_tickets enable row level security;
alter table public.webframe_ticket_messages enable row level security;

-- Deadline tracking: live_at is stamped when a project goes live (starts the
-- 30-day support window); deadline_warned_at dedupes the <24h WhatsApp alert.
alter table public.webframe_projects
  add column if not exists live_at timestamptz,
  add column if not exists deadline_warned_at timestamptz;
