-- Scheduled call time for a lead (set manually in /admin for outbound leads).
-- Run once in the Supabase dashboard → SQL Editor.

alter table public.webframe_leads
  add column if not exists call_at timestamptz;
