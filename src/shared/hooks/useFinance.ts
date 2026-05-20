import { useCallback, useEffect, useState } from 'react';
import {
  createFinancialMovement,
  getMonthlyIncome,
  getMovementsByModule,
  getPendingPayments,
} from '../services/financeService';
import type { FinanceModuleType, FinancialMovement, FinancialMovementInput } from '../types/finance';

export function useFinance(moduleType?: FinanceModuleType) {
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!moduleType) return;
    setLoading(true);
    try {
      const [loadedMovements, income, pending] = await Promise.all([
        getMovementsByModule(moduleType),
        getMonthlyIncome(moduleType),
        getPendingPayments(moduleType),
      ]);
      setMovements(loadedMovements);
      setMonthlyIncome(income);
      setPendingTotal(pending.reduce((total, movement) => total + movement.amount, 0));
      setError(null);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Error al cargar finanzas.');
    } finally {
      setLoading(false);
    }
  }, [moduleType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createMovement = useCallback(
    async (input: FinancialMovementInput) => {
      const movement = await createFinancialMovement(input);
      await refresh();
      return movement;
    },
    [refresh]
  );

  return {
    createMovement,
    error,
    loading,
    monthlyIncome,
    movements,
    pendingTotal,
    refresh,
  };
}
