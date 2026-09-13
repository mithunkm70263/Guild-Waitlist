-- ==============================================================================
-- 1. VIBE CODER APPLICATIONS TABLE
-- ==============================================================================
create table if not exists public.vibe_coder_applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  country text not null,
  timezone text not null,
  handle text,
  current_project text not null,
  coding_style text not null,
  main_goal text not null,
  experience_level text not null,
  tools_used text[] not null default '{}',
  weekly_hours text not null,
  live_session_windows text not null,
  pod_energy text not null,
  pod_expectations text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.vibe_coder_applications enable row level security;

revoke all on table public.vibe_coder_applications from anon, authenticated;

grant insert on table public.vibe_coder_applications to anon, authenticated;
grant usage on sequence public.vibe_coder_applications_id_seq to anon, authenticated;

grant select, insert, update, delete on table public.vibe_coder_applications to service_role;
grant usage, select on sequence public.vibe_coder_applications_id_seq to service_role;

drop policy if exists "Anyone can submit a Vibe Coder application"
  on public.vibe_coder_applications;

create policy "Anyone can submit a Vibe Coder application"
  on public.vibe_coder_applications
  for insert
  to anon, authenticated
  with check (true);

create index if not exists vibe_coder_applications_submitted_at_idx
  on public.vibe_coder_applications (submitted_at desc);

create index if not exists vibe_coder_applications_email_idx
  on public.vibe_coder_applications (lower(email));


-- ==============================================================================
-- 2. AI SAAS FOUNDER APPLICATIONS TABLE
-- ==============================================================================
create table if not exists public.ai_saas_applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  country text not null,
  timezone text not null,
  product_description text not null,
  stage text not null,
  goals text[] not null default '{}',
  weekly_hours text not null,
  live_session_windows text not null,
  ai_build_approach text not null,
  experience_level text not null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.ai_saas_applications enable row level security;

revoke all on table public.ai_saas_applications from anon, authenticated;

grant insert on table public.ai_saas_applications to anon, authenticated;
grant usage on sequence public.ai_saas_applications_id_seq to anon, authenticated;

grant select, insert, update, delete on table public.ai_saas_applications to service_role;
grant usage, select on sequence public.ai_saas_applications_id_seq to service_role;

drop policy if exists "Anyone can submit an AI SaaS application"
  on public.ai_saas_applications;

create policy "Anyone can submit an AI SaaS application"
  on public.ai_saas_applications
  for insert
  to anon, authenticated
  with check (true);

create index if not exists ai_saas_applications_submitted_at_idx
  on public.ai_saas_applications (submitted_at desc);

create index if not exists ai_saas_applications_email_idx
  on public.ai_saas_applications (lower(email));

create index if not exists ai_saas_applications_stage_idx
  on public.ai_saas_applications (stage);


-- ==============================================================================
-- 3. AI APP APPLICATIONS TABLE
-- ==============================================================================
create table if not exists public.ai_app_applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  country text not null,
  timezone text not null,
  app_description text not null,
  app_status text not null,
  why_stopped text,
  launch_experience text not null,
  three_month_ready text not null,
  motivation_and_sacrifice text not null,
  weekly_hours text not null,
  live_session_windows text not null,
  expected_traits text[] not null default '{}',
  pod_expectations text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.ai_app_applications enable row level security;

revoke all on table public.ai_app_applications from anon, authenticated;

grant insert on table public.ai_app_applications to anon, authenticated;
grant usage on sequence public.ai_app_applications_id_seq to anon, authenticated;

grant select, insert, update, delete on table public.ai_app_applications to service_role;
grant usage, select on sequence public.ai_app_applications_id_seq to service_role;

drop policy if exists "Anyone can submit an AI App application"
  on public.ai_app_applications;

create policy "Anyone can submit an AI App application"
  on public.ai_app_applications
  for insert
  to anon, authenticated
  with check (true);

create index if not exists ai_app_applications_submitted_at_idx
  on public.ai_app_applications (submitted_at desc);

create index if not exists ai_app_applications_email_idx
  on public.ai_app_applications (lower(email));

create index if not exists ai_app_applications_app_status_idx
  on public.ai_app_applications (app_status);
