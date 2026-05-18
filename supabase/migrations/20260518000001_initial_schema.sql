-- profiles: mirrors auth.users, auto-created on signup
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  display_name text not null default '',
  photo_url   text not null default '',
  created_at  timestamptz not null default now()
);

-- collections: owned by a user
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  description text not null default '',
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- snippets: optionally belong to a collection
create table public.snippets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users (id) on delete set null,
  collection_id   uuid references public.collections (id) on delete set null,
  title           text not null,
  description     text not null default '',
  code            text not null default '',
  language        text not null default 'plaintext',
  tags            text[] not null default '{}',
  is_public       boolean not null default false,
  favorites_count integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- favorites: join table (user ↔ snippet)
create table public.favorites (
  user_id    uuid not null references auth.users (id) on delete cascade,
  snippet_id uuid not null references public.snippets (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, snippet_id)
);

-- auto-update updated_at on snippets and collections
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger snippets_updated_at
  before update on public.snippets
  for each row execute function public.set_updated_at();

create trigger collections_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- keep favorites_count in sync via triggers
create or replace function public.increment_favorites_count()
returns trigger language plpgsql as $$
begin
  update public.snippets set favorites_count = favorites_count + 1 where id = new.snippet_id;
  return new;
end;
$$;

create or replace function public.decrement_favorites_count()
returns trigger language plpgsql as $$
begin
  update public.snippets set favorites_count = greatest(favorites_count - 1, 0) where id = old.snippet_id;
  return old;
end;
$$;

create trigger favorites_insert
  after insert on public.favorites
  for each row execute function public.increment_favorites_count();

create trigger favorites_delete
  after delete on public.favorites
  for each row execute function public.decrement_favorites_count();

-- indexes for common query patterns
create index on public.snippets (user_id);
create index on public.snippets (collection_id);
create index on public.snippets (is_public) where is_public = true;
create index on public.collections (user_id);
create index on public.favorites (user_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.collections enable row level security;
alter table public.snippets    enable row level security;
alter table public.favorites   enable row level security;

-- profiles
create policy "profiles: owner can read/write"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- collections
create policy "collections: public readable"
  on public.collections for select
  using (is_public = true);

create policy "collections: owner full access"
  on public.collections for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- snippets
create policy "snippets: public readable"
  on public.snippets for select
  using (is_public = true);

create policy "snippets: owner full access"
  on public.snippets for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- favorites
create policy "favorites: owner full access"
  on public.favorites for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, photo_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
