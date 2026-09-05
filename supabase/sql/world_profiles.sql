-- Table de stockage des profils World Room (à exécuter dans le projet ZEMBO).
create table if not exists public.world_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  photos text[] not null default '{}',
  age int check (age is null or (age >= 18 and age <= 99)),
  bio text,
  answer_sunday text,
  answer_red_flag text,
  answer_escape text,
  gender text,
  orientation text,
  show_age boolean not null default true,
  country text,
  city text,
  languages text[] not null default '{}',
  intentions text[] not null default '{}',
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.world_profiles to authenticated;
grant all on public.world_profiles to service_role;

alter table public.world_profiles enable row level security;

create policy "Chacun gère son profil World"
  on public.world_profiles for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Profils World visibles entre membres"
  on public.world_profiles for select
  to authenticated
  using (completed = true);

create or replace function public.world_profiles_touch()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists world_profiles_touch on public.world_profiles;
create trigger world_profiles_touch before update on public.world_profiles
  for each row execute function public.world_profiles_touch();
