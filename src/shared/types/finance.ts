import type { ModuleKey } from './business';

export type FinanceModuleType = ModuleKey | 'general';
export type FinanceSourceType = 'visit' | 'electrical_job' | 'print_order' | 'quote' | 'manual' | 'expense' | 'adjustment';
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
