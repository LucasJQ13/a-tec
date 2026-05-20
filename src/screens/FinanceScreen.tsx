import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors } from '../config/theme.config';
import { listFinancialMovements } from '../shared/services/financeService';
import type { FinanceModuleType, FinancialMovement } from '../shared/types/finance';
import { formatCurrencyARS, formatDateAR } from '../shared/utils/formatters';

type FinanceFilter = 'all' | Exclude<FinanceModuleType, 'general'>;

const filters: Array<{ id: FinanceFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'kinesiologia', label: 'Kinesiología' },
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'imprenta', label: 'Imprenta' },
];

export function FinanceScreen() {
  const [activeFilter, setActiveFilter] = useState<FinanceFilter>('all');
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMovements = useCallback(async () => {
    setLoading(true);
    try {
      const moduleType = activeFilter === 'all' ? undefined : activeFilter;
      const loaded = await listFinancialMovements(moduleType);
      setMovements(loaded);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const summary = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const monthMovements = movements.filter((movement) => movement.movementDate.startsWith(month));
    const income = monthMovements
      .filter((movement) => movement.movementType === 'income' && movement.paymentStatus === 'paid')
      .reduce((total, movement) => total + movement.amount, 0);
    const pending = movements
      .filter((movement) => movement.paymentStatus === 'pending' || movement.paymentStatus === 'partial')
      .reduce((total, movement) => total + movement.amount, 0);
    const expenses = monthMovements
      .filter((movement) => movement.movementType === 'expense')
      .reduce((total, movement) => total + movement.amount, 0);

    return {
      balance: income - expenses,
      income,
      pending,
      movements: movements.length,
    };
  }, [movements]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>A-Tec Finanzas</Text>
          <Text style={styles.title}>Resumen financiero</Text>
          <Text style={styles.subtitle}>Ingresos, pendientes y movimientos por módulo.</Text>
        </View>

        <View style={styles.summaryGrid}>
          <MetricCard label="Ingresos del mes" value={formatCurrencyARS(summary.income)} />
          <MetricCard label="Pendientes" value={formatCurrencyARS(summary.pending)} />
          <MetricCard label="Balance estimado" value={formatCurrencyARS(summary.balance)} />
          <MetricCard label="Movimientos" value={String(summary.movements)} />
        </View>

        <View style={styles.filters}>
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.82}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterPill, active ? styles.activeFilter : null]}
              >
                <Text style={[styles.filterText, active ? styles.activeFilterText : null]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Movimientos recientes</Text>
            <Text style={styles.panelMeta}>{loading ? 'Cargando' : 'Supabase'}</Text>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {!error && movements.length === 0 ? (
            <Text style={styles.emptyText}>Todavía no hay movimientos para este filtro.</Text>
          ) : null}
          {movements.slice(0, 10).map((movement) => (
            <View key={movement.id} style={styles.movementRow}>
              <View style={styles.movementCopy}>
                <Text style={styles.movementTitle}>{movement.description}</Text>
                <Text style={styles.movementMeta}>
                  {formatDateAR(movement.movementDate)} | {movement.moduleType} | {movement.paymentStatus}
                </Text>
              </View>
              <Text style={[styles.amount, movement.movementType === 'expense' ? styles.expense : null]}>
                {movement.movementType === 'expense' ? '-' : '+'}{formatCurrencyARS(movement.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: homeColors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 118,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  hero: {
    backgroundColor: homeColors.dark,
    borderRadius: 28,
    padding: 22,
  },
  kicker: {
    color: homeColors.surface,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: homeColors.surface,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 10,
  },
  subtitle: {
    color: homeColors.surface,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  metricCard: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    width: '48%',
  },
  metricLabel: {
    color: homeColors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  metricValue: {
    color: homeColors.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 8,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  filterPill: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  activeFilter: {
    backgroundColor: homeColors.dark,
    borderColor: homeColors.dark,
  },
  filterText: {
    color: homeColors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  activeFilterText: {
    color: homeColors.surface,
  },
  panel: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: homeColors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  panelMeta: {
    color: homeColors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  errorText: {
    color: '#56070C',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 12,
  },
  emptyText: {
    color: homeColors.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 12,
  },
  movementRow: {
    alignItems: 'center',
    borderTopColor: homeColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
  },
  movementCopy: {
    flex: 1,
  },
  movementTitle: {
    color: homeColors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  movementMeta: {
    color: homeColors.muted,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 4,
  },
  amount: {
    color: '#54582F',
    fontSize: 13,
    fontWeight: '900',
  },
  expense: {
    color: '#56070C',
  },
});
