-- Yoga Write Code — initial schema (safe to re-run)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  website_url text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create table if not exists public.website_analyses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  company_summary text not null,
  product_category text not null,
  target_audience text not null,
  positioning text not null,
  raw_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_opportunities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text not null,
  opportunity_score integer not null,
  difficulty text not null,
  business_relevance text not null,
  search_intent text not null,
  funnel_stage text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.topic_clusters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  pillar_topic text not null,
  supporting_topics jsonb not null default '[]'::jsonb,
  search_intent text not null,
  priority text not null,
  internal_linking_suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  primary_keyword text not null,
  search_intent text not null,
  target_audience text not null,
  suggested_headings jsonb not null default '[]'::jsonb,
  questions_to_answer jsonb not null default '[]'::jsonb,
  entities_to_mention jsonb not null default '[]'::jsonb,
  competitor_insights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.article_outlines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  h1 text not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists website_analyses_project_id_idx on public.website_analyses (project_id);
create index if not exists content_opportunities_project_id_idx on public.content_opportunities (project_id);
create index if not exists topic_clusters_project_id_idx on public.topic_clusters (project_id);
create index if not exists seo_briefs_project_id_idx on public.seo_briefs (project_id);
create index if not exists article_outlines_project_id_idx on public.article_outlines (project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.website_analyses enable row level security;
alter table public.content_opportunities enable row level security;
alter table public.topic_clusters enable row level security;
alter table public.seo_briefs enable row level security;
alter table public.article_outlines enable row level security;

create or replace function public.is_owner_of_project(p_project_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and user_id = auth.uid()
  );
$$;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

drop policy if exists projects_select_own on public.projects;
create policy projects_select_own on public.projects for select using (auth.uid() = user_id);
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own on public.projects for insert with check (auth.uid() = user_id);
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own on public.projects for update using (auth.uid() = user_id);
drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own on public.projects for delete using (auth.uid() = user_id);

drop policy if exists website_analyses_select on public.website_analyses;
create policy website_analyses_select on public.website_analyses for select using (public.is_owner_of_project(project_id));
drop policy if exists website_analyses_insert on public.website_analyses;
create policy website_analyses_insert on public.website_analyses for insert with check (public.is_owner_of_project(project_id));
drop policy if exists website_analyses_update on public.website_analyses;
create policy website_analyses_update on public.website_analyses for update using (public.is_owner_of_project(project_id));
drop policy if exists website_analyses_delete on public.website_analyses;
create policy website_analyses_delete on public.website_analyses for delete using (public.is_owner_of_project(project_id));

drop policy if exists content_opportunities_select on public.content_opportunities;
create policy content_opportunities_select on public.content_opportunities for select using (public.is_owner_of_project(project_id));
drop policy if exists content_opportunities_insert on public.content_opportunities;
create policy content_opportunities_insert on public.content_opportunities for insert with check (public.is_owner_of_project(project_id));
drop policy if exists content_opportunities_update on public.content_opportunities;
create policy content_opportunities_update on public.content_opportunities for update using (public.is_owner_of_project(project_id));
drop policy if exists content_opportunities_delete on public.content_opportunities;
create policy content_opportunities_delete on public.content_opportunities for delete using (public.is_owner_of_project(project_id));

drop policy if exists topic_clusters_select on public.topic_clusters;
create policy topic_clusters_select on public.topic_clusters for select using (public.is_owner_of_project(project_id));
drop policy if exists topic_clusters_insert on public.topic_clusters;
create policy topic_clusters_insert on public.topic_clusters for insert with check (public.is_owner_of_project(project_id));
drop policy if exists topic_clusters_update on public.topic_clusters;
create policy topic_clusters_update on public.topic_clusters for update using (public.is_owner_of_project(project_id));
drop policy if exists topic_clusters_delete on public.topic_clusters;
create policy topic_clusters_delete on public.topic_clusters for delete using (public.is_owner_of_project(project_id));

drop policy if exists seo_briefs_select on public.seo_briefs;
create policy seo_briefs_select on public.seo_briefs for select using (public.is_owner_of_project(project_id));
drop policy if exists seo_briefs_insert on public.seo_briefs;
create policy seo_briefs_insert on public.seo_briefs for insert with check (public.is_owner_of_project(project_id));
drop policy if exists seo_briefs_update on public.seo_briefs;
create policy seo_briefs_update on public.seo_briefs for update using (public.is_owner_of_project(project_id));
drop policy if exists seo_briefs_delete on public.seo_briefs;
create policy seo_briefs_delete on public.seo_briefs for delete using (public.is_owner_of_project(project_id));

drop policy if exists article_outlines_select on public.article_outlines;
create policy article_outlines_select on public.article_outlines for select using (public.is_owner_of_project(project_id));
drop policy if exists article_outlines_insert on public.article_outlines;
create policy article_outlines_insert on public.article_outlines for insert with check (public.is_owner_of_project(project_id));
drop policy if exists article_outlines_update on public.article_outlines;
create policy article_outlines_update on public.article_outlines for update using (public.is_owner_of_project(project_id));
drop policy if exists article_outlines_delete on public.article_outlines;
create policy article_outlines_delete on public.article_outlines for delete using (public.is_owner_of_project(project_id));