import type { ModuleKey } from './business';

export type FinanceModuleType = ModuleKey | 'general';
export type FinanceSourceType =
  | 'visit'
  | 'electrical_job'
  | 'print_order'
  | 'quote'
  | 'invoice'
  | 'manual'
  | 'expense'
  | 'adjustment';
export type FinanceMovementType = 'income' | 'expense';
export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'cancelled';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercado_pago' | 'tarjeta' | 'otro';

export type FinancialMovement = {
  id: string;
  moduleType: FinanceModuleType;
  sourceType: FinanceSourceType;
  sourceId: string;
  personId?: string;
  movementType: FinanceMovementType;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  description: string;
  notes?: string;
  movementDate: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type FinancialMovementInput = {
  moduleType: FinanceModuleType;
  sourceType: FinanceSourceType;
  sourceId?: string;
  personId?: string;
  movementType: FinanceMovementType;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amount: number;
  description: string;
  notes?: string;
  movementDate: string;
  createdBy?: string;
};

export type InvoiceStatus = 'draft' | 'issued' | 'cancelled' | 'paid' | 'synced' | 'sync_error';
export type InvoiceType = 'monotributo_c' | 'presupuesto' | 'recibo_interno';
export type AfipSyncStatus = 'not_required' | 'pending' | 'synced' | 'error';

export type Invoice = {
  id: string;
  moduleType: FinanceModuleType;
  personId?: string;
  sourceType?: FinanceSourceType;
  sourceId?: string;
  invoiceNumber?: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceType;
  afipSyncStatus: AfipSyncStatus;
  issueDate: string;
  total: number;
  notes?: string;
  financialMovementId?: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceInput = {
  moduleType: FinanceModuleType;
  personId?: string;
  sourceType?: FinanceSourceType;
  sourceId?: string;
  invoiceType: InvoiceType;
  issueDate: string;
  notes?: string;
  items: Array<Omit<InvoiceItem, 'id' | 'invoiceId' | 'total'>>;
};
