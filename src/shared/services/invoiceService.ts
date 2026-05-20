import { contactsCreatedBy, supabase } from './supabaseClient';
import { createFinancialMovement } from './financeService';
import type { Invoice, InvoiceInput, InvoiceItem } from '../types/finance';

type InvoiceRow = {
  id: string;
  module_type: Invoice['moduleType'];
  person_id: string | null;
  source_type: Invoice['sourceType'] | null;
  source_id: string | null;
  invoice_number: string | null;
  invoice_status: Invoice['invoiceStatus'];
  invoice_type: Invoice['invoiceType'];
  afip_sync_status: Invoice['afipSyncStatus'];
  issue_date: string;
  total: number;
  notes: string | null;
  financial_movement_id: string | null;
  created_at: string;
  updated_at: string;
};

type InvoiceItemRow = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
};

function requireSupabase() {
  if (!supabase) {
    throw new Error('No se pudo conectar con Supabase.');
  }
  return supabase;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function invoiceFromRow(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    moduleType: row.module_type,
    personId: row.person_id ?? undefined,
    sourceType: row.source_type ?? undefined,
    sourceId: row.source_id ?? undefined,
    invoiceNumber: row.invoice_number ?? undefined,
    invoiceStatus: row.invoice_status,
    invoiceType: row.invoice_type,
    afipSyncStatus: row.afip_sync_status,
    issueDate: row.issue_date,
    total: Number(row.total),
    notes: row.notes ?? '',
    financialMovementId: row.financial_movement_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function invoiceItemFromRow(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    total: Number(row.total),
  };
}

export async function createInternalInvoice(input: InvoiceInput) {
  const client = requireSupabase();
  if (input.items.length === 0) throw new Error('La factura interna necesita al menos un item.');

  const invoiceId = createId('invoice');
  const timestamp = nowIso();
  const total = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const { data: invoice, error } = await client
    .from('invoices')
    .insert({
      id: invoiceId,
      module_type: input.moduleType,
      person_id: input.personId ?? null,
      source_type: input.sourceType ?? null,
      source_id: input.sourceId ?? null,
      invoice_status: 'draft',
      invoice_type: input.invoiceType,
      afip_sync_status: 'pending',
      issue_date: input.issueDate,
      total,
      notes: input.notes ?? '',
      created_by: contactsCreatedBy ?? 'A-Tec',
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);

  const invoiceItems = input.items.map((item) => ({
    id: createId('invoice-item'),
    invoice_id: invoiceId,
    description: item.description.trim(),
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.quantity * item.unitPrice,
    created_at: timestamp,
  }));

  const { error: itemsError } = await client.from('invoice_items').insert(invoiceItems);
  if (itemsError) throw new Error(itemsError.message);

  const movement = await createFinancialMovement({
    moduleType: input.moduleType,
    sourceType: 'invoice',
    sourceId: invoiceId,
    personId: input.personId,
    movementType: 'income',
    paymentStatus: 'pending',
    paymentMethod: 'efectivo',
    amount: total,
    description: `Factura interna ${input.invoiceType}`,
    notes: input.notes,
    movementDate: input.issueDate,
  });

  await client.from('invoices').update({ financial_movement_id: movement.id, updated_at: nowIso() }).eq('id', invoiceId);

  return invoiceFromRow({ ...(invoice as InvoiceRow), financial_movement_id: movement.id });
}
