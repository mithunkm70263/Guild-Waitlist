create table if not exists public.youtube_creator_applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  country text not null,
  timezone text not null,
  niche text not null,
  channel_url text,
  subscribers text not null,
  monthly_views text not null,
  videos_posted text not null,
  timeline text not null,
  upload_cadence text,
  motivation_and_sacrifice text not null,
  weekly_hours text not null,
  live_session_windows text not null,
  expected_traits text[] not null default '{}',
  pod_expectations text not null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.youtube_creator_applications enable row level security;

revoke all on table public.youtube_creator_applications from anon, authenticated;

grant insert on table public.youtube_creator_applications to anon, authenticated;
grant usage on sequence public.youtube_creator_applications_id_seq to anon, authenticated;

grant select, insert, update, delete on table public.youtube_creator_applications to service_role;
grant usage, select on sequence public.youtube_creator_applications_id_seq to service_role;

drop policy if exists "Anyone can submit a YouTube creator application"
  on public.youtube_creator_applications;

create policy "Anyone can submit a YouTube creator application"
  on public.youtube_creator_applications
  for insert
  to anon, authenticated
  with check (true);

create index if not exists youtube_creator_applications_submitted_at_idx
  on public.youtube_creator_applications (submitted_at desc);

create index if not exists youtube_creator_applications_email_idx
  on public.youtube_creator_applications (lower(email));

create index if not exists youtube_creator_applications_niche_idx
  on public.youtube_creator_applications (niche);
