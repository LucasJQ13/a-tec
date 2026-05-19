create table if not exists public.contacts (
  id text primary key,
  module_type text not null check (module_type in ('kinesiologia', 'electricidad', 'imprenta')),
  display_label text not null check (display_label in ('paciente', 'cliente')),
  full_name text not null,
  phone text default '',
  email text default '',
  dni text default '',
  birth_date text default '',
  notes text default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_module_type on public.contacts(module_type);
create index if not exists idx_contacts_full_name on public.contacts(full_name);

alter table public.contacts enable row level security;

drop policy if exists "contacts_select_family_public" on public.contacts;
drop policy if exists "contacts_insert_family_public" on public.contacts;
drop policy if exists "contacts_update_family_public" on public.contacts;

create policy "contacts_select_family_public"
on public.contacts
for select
to anon
using (true);

create policy "contacts_insert_family_public"
on public.contacts
for insert
to anon
with check (true);

create policy "contacts_update_family_public"
on public.contacts
for update
to anon
using (true)
with check (true);
