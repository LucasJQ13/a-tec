-- A-Tec - Kinesiología/Fisioterapia
-- Ejecutar en Supabase SQL Editor antes de usar el flujo clinico real.
-- No contiene claves ni secretos.

create table if not exists public.patients (
  id text primary key,
  nombre_apellido text not null,
  domicilio text not null,
  motivo_consulta text not null,
  afeccion_patologia text not null,
  tratamiento_propuesto text not null,
  fecha_nacimiento date,
  edad_estimada integer,
  usa_edad_estimada boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint patients_birth_or_estimated_age
    check (fecha_nacimiento is not null or edad_estimada is not null)
);

create table if not exists public.professional_profiles (
  id text primary key,
  nombre_completo text not null,
  titulo text not null default 'Lic.',
  matricula_profesional text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clinical_history_entries (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  fecha_tratamiento date not null,
  contenido text not null,
  author_signature_snapshot text not null,
  backup_status text not null default 'pending'
    check (backup_status in ('pending', 'synced', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'programada'
    check (status in ('programada', 'realizada', 'cancelada', 'reprogramada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visits (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  visit_date date not null,
  hora_inicio time not null,
  hora_fin time not null,
  duracion_minutos integer not null,
  observaciones text,
  pago_realizado boolean not null default false,
  monto_pagado numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reminders (
  id text primary key,
  appointment_id text not null references public.appointments(id) on delete cascade,
  patient_id text not null references public.patients(id) on delete cascade,
  scheduled_for timestamptz not null,
  notification_title text not null,
  notification_body text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_movements (
  id text primary key,
  module_type text not null
    check (module_type in ('kinesiologia', 'electricidad', 'imprenta', 'general')),
  source_type text not null
    check (source_type in ('visit', 'electrical_job', 'print_order', 'quote', 'manual', 'expense', 'adjustment')),
  source_id text not null,
  person_id text,
  patient_id text,
  movement_type text not null
    check (movement_type in ('income', 'expense')),
  payment_status text not null default 'paid'
    check (payment_status in ('paid', 'pending', 'partial', 'cancelled')),
  payment_method text not null default 'efectivo'
    check (payment_method in ('efectivo', 'transferencia', 'mercado_pago', 'tarjeta', 'otro')),
  amount numeric(12, 2) not null,
  description text not null,
  notes text,
  movement_date date not null,
  payment_date date,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibilidad segura si la tabla financial_movements ya existía con la versión anterior.
alter table public.financial_movements add column if not exists person_id text;
alter table public.financial_movements add column if not exists patient_id text;
alter table public.financial_movements add column if not exists payment_status text not null default 'paid';
alter table public.financial_movements add column if not exists payment_method text not null default 'efectivo';
alter table public.financial_movements add column if not exists notes text;
alter table public.financial_movements add column if not exists movement_date date;
alter table public.financial_movements add column if not exists payment_date date;
alter table public.financial_movements add column if not exists created_by text;
alter table public.financial_movements add column if not exists updated_at timestamptz not null default now();
update public.financial_movements
set movement_date = coalesce(movement_date, payment_date, created_at::date)
where movement_date is null;
update public.financial_movements
set payment_date = coalesce(payment_date, movement_date, created_at::date)
where payment_date is null;

create index if not exists idx_patients_name on public.patients(nombre_apellido);
create index if not exists idx_history_patient_date on public.clinical_history_entries(patient_id, fecha_tratamiento desc);
create index if not exists idx_appointments_patient_date on public.appointments(patient_id, appointment_date, appointment_time);
create index if not exists idx_visits_patient_created on public.visits(patient_id, created_at desc);
create index if not exists idx_financial_source on public.financial_movements(source_type, source_id);
create index if not exists idx_financial_module_date on public.financial_movements(module_type, movement_date desc);
create index if not exists idx_financial_person on public.financial_movements(person_id);

-- Tablas futuras previstas para finanzas avanzadas. No se implementan todavía:
-- financial_categories, financial_accounts, financial_summaries,
-- cash_sessions, installments, payment_receipts.

insert into public.professional_profiles (
  id,
  nombre_completo,
  titulo,
  matricula_profesional
) values (
  'fernanda-main',
  'Fernanda Canavidez',
  'Lic.',
  ''
) on conflict (id) do nothing;
