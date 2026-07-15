-- Webframe's own CRM table in the shared ninefold Supabase project.
-- Namespaced with the webframe_ prefix; nothing here touches ninefold tables.
-- Run this once in the Supabase dashboard → SQL Editor.

create table if not exists public.webframe_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  project_type text,
  project_size text,
  business text,
  message text,
  source text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost'))
);

-- RLS on with no policies: only the service-role key (used by webframe's
-- server code) can read or write. Ninefold's anon/client keys see nothing.
alter table public.webframe_leads enable row level security;

create index if not exists webframe_leads_created_at_idx
  on public.webframe_leads (created_at desc);
