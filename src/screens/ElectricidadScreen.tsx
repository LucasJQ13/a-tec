import { BackHandler, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { electricityColors } from '../constants/electricityTheme';
import { ContactManager } from '../shared/components/ContactManager';
import { MODULE_FEATURE_CONFIG } from '../shared/config/moduleConfig';
import { usePullRefresh } from '../shared/hooks/usePullRefresh';

type ElectricidadScreenProps = {
  onBack: () => void;
};

type ElectricityTab = 'clients' | 'services' | 'jobs' | 'quotes';

const tabs: Array<{ id: ElectricityTab; label: string }> = [
  { id: 'clients', label: 'Clientes' },
  { id: 'services', label: 'Servicios' },
  { id: 'jobs', label: 'Trabajos' },
  { id: 'quotes', label: 'Presup.' },
];

const actionCards = [
  { id: 'clients', icon: 'CL', title: 'Clientes', detail: 'Contactos y datos' },
  { id: 'services', icon: 'SE', title: 'Servicios electricos', detail: 'Instalaciones y reparaciones' },
  { id: 'materials', icon: 'MT', title: 'Materiales', detail: 'Insumos futuros' },
  { id: 'jobs', icon: 'TR', title: 'Trabajos', detail: 'Pendientes y activos' },
  { id: 'quotes', icon: 'PR', title: 'Presupuestos', detail: 'Borradores y enviados' },
  { id: 'history', icon: 'HI', title: 'Historial', detail: 'Servicios realizados' },
  { id: 'stats', icon: 'ES', title: 'Estadisticas', detail: 'Resumen operativo' },
  { id: 'payments', icon: 'CO', title: 'Cobros', detail: 'Seguimiento simple' },
];

export function ElectricidadScreen({ onBack }: ElectricidadScreenProps) {
  const [activeTab, setActiveTab] = useState<ElectricityTab>('clients');
  const tabHistory = useRef<ElectricityTab[]>(['clients']);
  const { onRefresh, refreshing } = usePullRefresh();
  const insets = useSafeAreaInsets();

  const changeTab = (tab: ElectricityTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    tabHistory.current = [...tabHistory.current, tab].slice(-8);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tabHistory.current.length > 1) {
        tabHistory.current = tabHistory.current.slice(0, -1);
        setActiveTab(tabHistory.current[tabHistory.current.length - 1] ?? 'clients');
        return true;
      }

      onBack();
      return true;
    });

    return () => subscription.remove();
  }, [onBack]);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 104 + insets.bottom }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={electricityColors.secondary}
            colors={[electricityColors.primary]}
            progressBackgroundColor="rgba(255,255,255,0.92)"
          />
        }
      >
        <ElectricityHeader onBack={onBack} />
        <ElectricityTabs activeTab={activeTab} onChangeTab={changeTab} />

        {activeTab === 'clients' ? <ClientsTab /> : null}
        {activeTab === 'services' ? <OverviewTab title="Servicios electricos" focus="Catalogo tecnico" /> : null}
        {activeTab === 'jobs' ? <OverviewTab title="Trabajos" focus="Ordenes activas" /> : null}
        {activeTab === 'quotes' ? <OverviewTab title="Presupuestos" focus="Cotizacion y seguimiento" /> : null}
      </ScrollView>
      <ElectricityBottomNav activeTab={activeTab} onChangeTab={changeTab} />
    </View>
  );
}

function ElectricityHeader({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.modeChip}>
          <Text style={styles.modeChipText}>Servicio tecnico</Text>
        </View>
      </View>

      <View style={styles.heroRow}>
        <View style={styles.heroMark}>
          <Text style={styles.heroMarkText}>EL</Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.welcome} numberOfLines={2}>Bienvenido Lucas</Text>
          <Text style={styles.subtitle} numberOfLines={2}>Gestion de servicios electricos</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <MetricPill value="6" label="trabajos" />
        <MetricPill value="3" label="presup." />
        <MetricPill value="2" label="urgentes" highlight />
      </View>
    </View>
  );
}

function MetricPill({ highlight, label, value }: { highlight?: boolean; label: string; value: string }) {
  return (
    <View style={[styles.metricPill, highlight ? styles.metricPillHot : null]}>
      <Text style={[styles.metricValue, highlight ? styles.metricValueHot : null]}>{value}</Text>
      <Text style={[styles.metricLabel, highlight ? styles.metricLabelHot : null]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function ElectricityTabs({
  activeTab,
  onChangeTab,
}: {
  activeTab: ElectricityTab;
  onChangeTab: (tab: ElectricityTab) => void;
}) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <TouchableOpacity key={tab.id} activeOpacity={0.82} onPress={() => onChangeTab(tab.id)} style={styles.tab}>
            <Text style={[styles.tabText, active ? styles.activeTabText : null]} numberOfLines={1}>
              {tab.label}
            </Text>
            <View style={[styles.tabLine, active ? styles.activeTabLine : null]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ClientsTab() {
  return (
    <View style={styles.tabContent}>
      <ContactManager config={MODULE_FEATURE_CONFIG.electricidad} />
    </View>
  );
}

function OverviewTab({ focus, title }: { focus: string; title: string }) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionCopy}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{focus}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Base</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        {actionCards.map((card) => (
          <TouchableOpacity key={card.id} activeOpacity={0.84} style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>{card.icon}</Text>
            </View>
            <Text style={styles.actionTitle} numberOfLines={2}>{card.title}</Text>
            <Text style={styles.actionDetail} numberOfLines={2}>{card.detail}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ElectricityBottomNav({
  activeTab,
  onChangeTab,
}: {
  activeTab: ElectricityTab;
  onChangeTab: (tab: ElectricityTab) => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <TouchableOpacity key={tab.id} activeOpacity={0.82} onPress={() => onChangeTab(tab.id)} style={styles.navItem}>
            <View style={[styles.navIcon, active ? styles.activeNavIcon : null]}>
              <Text style={[styles.navIconText, active ? styles.activeNavIconText : null]}>
                {tab.label.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.navText, active ? styles.activeNavText : null]} numberOfLines={1}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: electricityColors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 104,
  },
  header: {
    backgroundColor: electricityColors.primary,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  modeChip: {
    backgroundColor: electricityColors.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modeChipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  heroMark: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  heroMarkText: {
    color: electricityColors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  welcome: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  subtitle: {
    color: '#EAF0FF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  metricPill: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metricPillHot: {
    backgroundColor: electricityColors.secondary,
    borderColor: electricityColors.secondary,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  metricValueHot: {
    color: '#ffffff',
  },
  metricLabel: {
    color: '#D9E2FF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  metricLabelHot: {
    color: '#ffffff',
  },
  tabs: {
    backgroundColor: electricityColors.surface,
    borderColor: electricityColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 0,
  },
  tabText: {
    color: electricityColors.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: electricityColors.primary,
  },
  tabLine: {
    backgroundColor: electricityColors.surface,
    borderRadius: 2,
    height: 4,
    marginTop: 7,
    width: 34,
  },
  activeTabLine: {
    backgroundColor: electricityColors.secondary,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionCopy: {
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    color: electricityColors.text,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  sectionSubtitle: {
    color: electricityColors.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: electricityColors.secondary,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: electricityColors.surface,
    borderColor: electricityColors.border,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 130,
    padding: 13,
    width: '48%',
    shadowColor: '#23325F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: electricityColors.softAccent,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionIconText: {
    color: electricityColors.secondary,
    fontSize: 13,
    fontWeight: '900',
  },
  actionTitle: {
    color: electricityColors.text,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: 12,
  },
  actionDetail: {
    color: electricityColors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 5,
  },
  bottomNav: {
    backgroundColor: electricityColors.surface,
    borderColor: electricityColors.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
    shadowColor: '#23325F',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  navIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 42,
  },
  activeNavIcon: {
    backgroundColor: electricityColors.primary,
  },
  navIconText: {
    color: electricityColors.muted,
    fontSize: 10,
    fontWeight: '900',
  },
  activeNavIconText: {
    color: '#ffffff',
  },
  navText: {
    color: electricityColors.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  activeNavText: {
    color: electricityColors.primary,
  },
});
