-- Client portal: projects with magic-link tokens, content checklist items,
-- and a private storage bucket for client uploads. Run once in the Supabase
-- dashboard → SQL Editor (after webframe_leads.sql and webframe_quotes.sql).

create table if not exists public.webframe_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.webframe_leads(id) on delete cascade,
  quote_id uuid references public.webframe_quotes(id) on delete set null,
  name text not null,
  stage text not null default 'content'
    check (stage in ('content', 'build', 'review', 'live')),
  portal_token text not null unique
);

create table if not exists public.webframe_content_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references public.webframe_projects(id) on delete cascade,
  label text not null,
  files jsonb not null default '[]',
  updated_at timestamptz
);

alter table public.webframe_projects enable row level security;
alter table public.webframe_content_items enable row level security;

create index if not exists webframe_projects_lead_id_idx
  on public.webframe_projects (lead_id);
create index if not exists webframe_content_items_project_id_idx
  on public.webframe_content_items (project_id);

-- Private bucket for client uploads; all access goes through the server
-- (signed URLs), so no storage policies are needed.
insert into storage.buckets (id, name, public)
values ('webframe-uploads', 'webframe-uploads', false)
on conflict (id) do nothing;
