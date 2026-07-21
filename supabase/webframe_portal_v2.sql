-- Portal v2: client-typed notes, skippable optional items, a content-complete
-- timestamp that starts the 7-day clock, and a 50 MB per-file cap on the
-- uploads bucket. Run once in the Supabase dashboard → SQL Editor
-- (after webframe_portal.sql).

alter table public.webframe_content_items
  add column if not exists note text,
  add column if not exists optional boolean not null default false,
  add column if not exists skipped boolean not null default false;

-- Existing checklists flagged their optional item in the label only.
update public.webframe_content_items
  set optional = true
  where label ilike '%(optional)%';

alter table public.webframe_projects
  add column if not exists content_completed_at timestamptz;

update storage.buckets
  set file_size_limit = 52428800 -- 50 MB
  where id = 'webframe-uploads';
