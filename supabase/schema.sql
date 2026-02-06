-- ============================
-- PolyEvent Database Schema
-- ============================

-- Enable extensions
create extension if not exists "pgcrypto";

-- ============================
-- USERS (public profile)
-- ============================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  preferred_locale text default 'en',
  created_at timestamptz default now()
);

-- ============================
-- EVENTS
-- ============================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users(id) on delete cascade,
  original_language text not null,
  title text not null,
  description text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  created_at timestamptz default now()
);

create index if not exists events_creator_id_idx on public.events(creator_id);

-- ============================
-- EVENT TRANSLATIONS
-- ============================
create table if not exists public.event_translations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  locale text not null,
  translated_title text not null,
  translated_description text not null,
  created_at timestamptz default now(),
  unique (event_id, locale)
);

-- ============================
-- COMMENTS
-- ============================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  original_language text not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists comments_event_id_idx on public.comments(event_id);

-- ============================
-- COMMENT TRANSLATIONS
-- ============================
create table if not exists public.comment_translations (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  locale text not null,
  translated_content text not null,
  created_at timestamptz default now(),
  unique (comment_id, locale)
);

-- ============================
-- AUTH → USERS SYNC
-- ============================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ============================
-- ROW LEVEL SECURITY
-- ============================

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.event_translations enable row level security;
alter table public.comments enable row level security;
alter table public.comment_translations enable row level security;

-- USERS
create policy "users are public"
on public.users for select
using (true);

-- EVENTS
create policy "events are public"
on public.events for select
using (true);

create policy "users can create events"
on public.events for insert
with check (auth.uid() = creator_id);

-- EVENT TRANSLATIONS
create policy "event translations are public"
on public.event_translations for select
using (true);

create policy "system can insert event translations"
on public.event_translations
for insert
with check (true);

-- COMMENTS
create policy "comments are public"
on public.comments for select
using (true);

create policy "users can comment"
on public.comments for insert
with check (auth.uid() = author_id);

-- COMMENT TRANSLATIONS
create policy "comment translations are public"
on public.comment_translations for select
using (true);


-- ============================
-- INDEXES
-- ============================
create index if not exists events_creator_id_idx on public.events(creator_id);
create index if not exists events_start_time_idx on public.events(start_time);
create index if not exists event_translations_event_id_locale_idx on public.event_translations(event_id, locale);
create index if not exists comments_event_id_idx on public.comments(event_id);
create index if not exists comments_author_id_idx on public.comments(author_id);
create index if not exists comment_translations_comment_id_locale_idx on public.comment_translations(comment_id, locale);

-- ============================
-- CONSTRAINTS
-- ============================
alter table public.comments
add constraint comments_content_length
check (char_length(content) <= 500);

alter table public.comments
add constraint comments_content_not_empty
check (char_length(content) > 0);

alter table public.comment_translations
add constraint comment_translations_translated_content_length
check (char_length(translated_content) <= 500);

alter table public.comment_translations
add constraint comment_translations_translated_content_not_empty
check (char_length(translated_content) > 0);

alter table public.events
add constraint events_title_length
check (char_length(title) <= 255);

alter table public.events
add constraint events_description_length
check (char_length(description) <= 1000);

alter table public.events
add constraint events_title_not_empty
check (char_length(title) > 0);

alter table public.events
add constraint events_description_not_empty
check (char_length(description) > 0);

alter table public.event_translations
add constraint event_translations_translated_title_length
check (char_length(translated_title) <= 255);

alter table public.event_translations
add constraint event_translations_translated_description_length
check (char_length(translated_description) <= 5000);


-- ============================
-- TRANSLATION FAILURES
-- ============================
create table if not exists public.translation_failures (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'event' | 'comment'
  entity_id uuid not null,
  target_locale text not null,
  error_message text,
  created_at timestamptz default now()
);
