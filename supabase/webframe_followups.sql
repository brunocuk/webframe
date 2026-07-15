-- Follow-up tracking for the daily cron: each reminder fires at most once.
-- Run once in the Supabase dashboard → SQL Editor.

alter table public.webframe_quotes
  add column if not exists reminder_sent_at timestamptz;

alter table public.webframe_projects
  add column if not exists content_reminder_sent_at timestamptz;
