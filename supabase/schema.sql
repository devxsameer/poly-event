-- ============================
-- PolyEvent Final Schema (v1)
-- ============================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================
-- ENUM-LIKE CONSTRAINTS
-- ============================

-- Supported locales (keep in sync with app)
create domain locale_code text
check (value in (
  'en','es','fr','de','pt','hi','ar','ja','zh-Hans','ko','ru','id'
));

create domain translation_status text
check (value in ('pending', 'completed', 'failed'));

-- ============================
-- USERS (public profile)
-- ============================

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  preferred_locale locale_code default 'en',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users are public"
on public.users for select
using (true);

-- ============================
-- EVENTS
-- ============================

create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users(id) on delete cascade,

  original_language locale_code not null,
  title text not null,
  description text not null,

  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  
  idempotency_key uuid unique,

  created_at timestamptz not null default now(),

  -- Validations
  constraint events_title_length check (char_length(title) between 1 and 255),
  constraint events_description_length check (char_length(description) between 1 and 1000),
  constraint events_time_valid check (end_time is null or end_time > start_time)
);

alter table public.events enable row level security;

create policy "events are public"
on public.events for select
using (true);

create policy "users can create events"
on public.events for insert
with check (auth.uid() = creator_id);

-- Indexes
create index events_creator_id_idx on public.events(creator_id);
create index events_start_time_idx on public.events(start_time);

-- ============================
-- EVENT TRANSLATIONS
-- ============================

create table public.event_translations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  locale locale_code not null,

  translated_title text,
  translated_description text,

  status translation_status not null default 'pending',
  last_error text,

  created_at timestamptz not null default now(),

  unique (event_id, locale),

  constraint event_translations_title_length
    check (translated_title is null or char_length(translated_title) <= 255),

  constraint event_translations_description_length
    check (translated_description is null or char_length(translated_description) <= 5000)
);

alter table public.event_translations enable row level security;

-- Public read
create policy "event translations are public"
on public.event_translations for select
using (true);

-- System-only writes (service role)
create policy "system manages event translations"
on public.event_translations
for insert with check (auth.role() = 'service_role');

create policy "system updates event translations"
on public.event_translations
for update using (auth.role() = 'service_role');

-- Indexes
create index event_translations_event_locale_idx
on public.event_translations(event_id, locale);

create index event_translations_status_idx
on public.event_translations(status);

-- ============================
-- COMMENTS
-- ============================

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,

  original_language locale_code not null,
  content text not null,

  created_at timestamptz not null default now(),

  constraint comments_content_length check (char_length(content) between 1 and 500)
);

alter table public.comments enable row level security;

create policy "comments are public"
on public.comments for select
using (true);

create policy "users can comment"
on public.comments for insert
with check (auth.uid() = author_id);

-- Indexes
create index comments_event_id_idx on public.comments(event_id);
create index comments_author_id_idx on public.comments(author_id);

-- ============================
-- COMMENT TRANSLATIONS
-- ============================

create table public.comment_translations (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,

  locale locale_code not null,
  translated_content text,

  status translation_status not null default 'pending',
  last_error text,

  created_at timestamptz not null default now(),

  unique (comment_id, locale),

  constraint comment_translations_content_length
    check (translated_content is null or char_length(translated_content) <= 500)
);

alter table public.comment_translations enable row level security;

create policy "comment translations are public"
on public.comment_translations for select
using (true);

create policy "system manages comment translations"
on public.comment_translations
for insert with check (auth.role() = 'service_role');

create policy "system updates comment translations"
on public.comment_translations
for update using (auth.role() = 'service_role');

create index comment_translations_comment_locale_idx
on public.comment_translations(comment_id, locale);

-- ============================
-- AUTH → USERS SYNC
-- ============================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
