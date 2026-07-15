-- Quotes sent from the /admin CRM, one row per quote. Run once in the
-- Supabase dashboard → SQL Editor (after webframe_leads.sql).

create table if not exists public.webframe_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.webframe_leads(id) on delete cascade,
  plan text not null,
  amount_eur numeric(10,2) not null,
  payment_mode text not null default 'upfront',
  revolut_order_id text unique,
  payment_link text,
  status text not null default 'sent'
    check (status in ('sent', 'paid', 'cancelled')),
  paid_at timestamptz
);

alter table public.webframe_quotes enable row level security;

create index if not exists webframe_quotes_lead_id_idx
  on public.webframe_quotes (lead_id);
