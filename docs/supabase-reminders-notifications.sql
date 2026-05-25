-- A-Tec beta: recordatorios, notificaciones y fotos de perfil.
-- Ejecutar en Supabase SQL Editor. No borra datos existentes.

create table if not exists public.reminders (
  id text primary key,
  author_name text not null,
  target_user text not null check (target_user in ('Lucas', 'Fer', 'Ambos')),
  message text not null,
  priority text not null default 'normal' check (priority in ('normal', 'importante', 'urgente')),
  status text not null default 'pendiente' check (status in ('pendiente', 'leido')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.device_push_tokens (
  id text primary key,
  user_name text not null,
  expo_push_token text not null,
  device_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id text primary key,
  display_name text not null,
  profile_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.professional_profiles
  add column if not exists profile_photo_url text;

alter table public.reminders enable row level security;
alter table public.device_push_tokens enable row level security;
alter table public.user_profiles enable row level security;

drop policy if exists "beta reminders full access" on public.reminders;
create policy "beta reminders full access"
on public.reminders for all
using (true)
with check (true);

drop policy if exists "beta push tokens full access" on public.device_push_tokens;
create policy "beta push tokens full access"
on public.device_push_tokens for all
using (true)
with check (true);

drop policy if exists "beta user profiles full access" on public.user_profiles;
create policy "beta user profiles full access"
on public.user_profiles for all
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "beta profile photos full access" on storage.objects;
create policy "beta profile photos full access"
on storage.objects for all
using (bucket_id = 'profile-photos')
with check (bucket_id = 'profile-photos');
