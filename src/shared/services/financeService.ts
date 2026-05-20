import { contactsCreatedBy, supabase } from './supabaseClient';
import type {
  FinanceModuleType,
  FinancialMovement,
  FinancialMovementInput,
  PaymentMethod,
} from '../types/finance';

type FinancialMovementRow = {
  id: string;
  module_type: FinanceModuleType;
  source_type: FinancialMovement['sourceType'];
  source_id: string;
  person_id: string | null;
  movement_type: FinancialMovement['movementType'];
  payment_status: FinancialMovement['paymentStatus'];
  payment_method: PaymentMethod;
  amount: number;
  description: string;
  notes: string | null;
  movement_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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

function movementFromRow(row: FinancialMovementRow): FinancialMovement {
  return {
    id: row.id,
    moduleType: row.module_type,
    sourceType: row.source_type,
    sourceId: row.source_id,
    personId: row.person_id ?? undefined,
    movementType: row.movement_type,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    amount: Number(row.amount),
    description: row.description,
    notes: row.notes ?? '',
    movementDate: row.movement_date,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createFinancialMovement(input: FinancialMovementInput) {
  const client = requireSupabase();
  const timestamp = nowIso();
  const payload = {
    id: createId('movement'),
    module_type: input.moduleType,
    source_type: input.sourceType,
    source_id: input.sourceId ?? createId(input.sourceType),
    person_id: input.personId ?? null,
    patient_id: input.personId ?? null,
    movement_type: input.movementType,
    payment_status: input.paymentStatus ?? 'paid',
    payment_method: input.paymentMethod ?? 'efectivo',
    amount: input.amount,
    description: input.description,
    notes: input.notes ?? '',
    movement_date: input.movementDate,
    payment_date: input.movementDate,
    created_by: input.createdBy ?? contactsCreatedBy ?? 'A-Tec',
    created_at: timestamp,
    updated_at: timestamp,
  };

  const { data, error } = await client.from('financial_movements').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return movementFromRow(data as FinancialMovementRow);
}

export async function getMovementsByModule(moduleType: FinanceModuleType) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('financial_movements')
    .select('*')
    .eq('module_type', moduleType)
    .order('movement_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => movementFromRow(row as FinancialMovementRow));
}

export async function listFinancialMovements(moduleType?: FinanceModuleType) {
  const client = requireSupabase();
  let query = client
    .from('financial_movements')
    .select('*')
    .order('movement_date', { ascending: false })
    .limit(40);
  if (moduleType) query = query.eq('module_type', moduleType);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => movementFromRow(row as FinancialMovementRow));
}

export async function getMovementsByPerson(personId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('financial_movements')
    .select('*')
    .eq('person_id', personId)
    .order('movement_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => movementFromRow(row as FinancialMovementRow));
}

export async function getMonthlyIncome(moduleType?: FinanceModuleType, date = new Date()) {
  const client = requireSupabase();
  const from = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0, 10);
  let query = client
    .from('financial_movements')
    .select('amount')
    .eq('movement_type', 'income')
    .eq('payment_status', 'paid')
    .gte('movement_date', from)
    .lte('movement_date', to);
  if (moduleType) query = query.eq('module_type', moduleType);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).reduce((total, row) => total + Number(row.amount ?? 0), 0);
}

export async function getPendingPayments(moduleType?: FinanceModuleType) {
  const client = requireSupabase();
  let query = client
    .from('financial_movements')
    .select('*')
    .in('payment_status', ['pending', 'partial'])
    .order('movement_date', { ascending: false });
  if (moduleType) query = query.eq('module_type', moduleType);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => movementFromRow(row as FinancialMovementRow));
}

export function createManualIncome(input: Omit<FinancialMovementInput, 'movementType' | 'sourceType'>) {
  return createFinancialMovement({ ...input, movementType: 'income', sourceType: 'manual' });
}

export function createManualExpense(input: Omit<FinancialMovementInput, 'movementType' | 'sourceType'>) {
  return createFinancialMovement({ ...input, movementType: 'expense', sourceType: 'expense' });
}
