-- Payment ledger: one row per completed Revolut order that belongs to
-- webframe (quote payments, recurring subscription cycles). Written by the
-- Revolut webhook; ninefold's payments on the shared merchant account are
-- filtered out. Run once in the Supabase dashboard → SQL Editor.

create table if not exists public.webframe_payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  revolut_order_id text not null unique,
  quote_id uuid references public.webframe_quotes(id) on delete set null,
  lead_id uuid references public.webframe_leads(id) on delete set null,
  amount_eur numeric(10,2),
  currency text not null default 'EUR',
  description text,
  customer_email text,
  kind text not null default 'other'
    check (kind in ('quote', 'recurring', 'other'))
);

alter table public.webframe_payments enable row level security;

create index if not exists webframe_payments_lead_id_idx
  on public.webframe_payments (lead_id);
