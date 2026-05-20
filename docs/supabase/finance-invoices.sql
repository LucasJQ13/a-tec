-- A-Tec - Finanzas e invoices internos para futura integración AFIP/Monotributo.
-- Ejecutar después de docs/supabase-kinesiologia.sql si se necesita aplicar solo esta parte.

alter table public.financial_movements drop constraint if exists financial_movements_source_type_check;
alter table public.financial_movements
  add constraint financial_movements_source_type_check
  check (source_type in ('visit', 'electrical_job', 'print_order', 'quote', 'invoice', 'manual', 'expense', 'adjustment'));

create table if not exists public.invoices (
  id text primary key,
  module_type text not null
    check (module_type in ('kinesiologia', 'electricidad', 'imprenta', 'general')),
  person_id text,
  source_type text
    check (source_type in ('visit', 'electrical_job', 'print_order', 'quote', 'invoice', 'manual', 'expense', 'adjustment')),
  source_id text,
  invoice_number text,
  invoice_status text not null default 'draft'
    check (invoice_status in ('draft', 'issued', 'cancelled', 'paid', 'synced', 'sync_error')),
  invoice_type text not null
    check (invoice_type in ('monotributo_c', 'presupuesto', 'recibo_interno')),
  afip_sync_status text not null default 'pending'
    check (afip_sync_status in ('not_required', 'pending', 'synced', 'error')),
  issue_date date not null,
  total numeric(12, 2) not null default 0,
  notes text,
  financial_movement_id text references public.financial_movements(id) on delete set null,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id text primary key,
  invoice_id text not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_invoices_module_date on public.invoices(module_type, issue_date desc);
create index if not exists idx_invoices_person on public.invoices(person_id);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);

alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

drop policy if exists "atec_beta_invoices_all" on public.invoices;
drop policy if exists "atec_beta_invoice_items_all" on public.invoice_items;

create policy "atec_beta_invoices_all" on public.invoices for all to anon, authenticated using (true) with check (true);
create policy "atec_beta_invoice_items_all" on public.invoice_items for all to anon, authenticated using (true) with check (true);
