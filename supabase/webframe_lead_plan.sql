-- Records which plan the visitor arrived from (or chose in the modal).
-- Run once in the Supabase dashboard → SQL Editor.

alter table public.webframe_leads
  add column if not exists plan text;
