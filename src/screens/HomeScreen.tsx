import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AreaCard } from '../components/AreaCard';
import { SummaryCard } from '../components/SummaryCard';
import { homeColors, homeRadii } from '../constants/homeTheme';
import { appAreas, quickActions, summaryItems } from '../data/appAreas';
import type { AreaId } from '../types/navigation';

type HomeScreenProps = {
  onOpenArea: (area: AreaId) => void;
};

export function HomeScreen({ onOpenArea }: HomeScreenProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerHalo} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brand}>A-Tec</Text>
            <Text style={styles.greeting}>Bienvenido Lucas</Text>
            <Text style={styles.subtitle}>Ecosistema de gestion familiar</Text>
          </View>
          <TouchableOpacity activeOpacity={0.82} style={styles.avatarButton}>
            <Text style={styles.avatarText}>LF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.familyPanel}>
          <View>
            <Text style={styles.panelKicker}>Lucas + Fernanda</Text>
            <Text style={styles.panelTitle}>Servicios organizados con una mirada cercana.</Text>
          </View>
          <View style={styles.panelMark}>
            <Text style={styles.panelMarkText}>AT</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vista general</Text>
        <Text style={styles.sectionHint}>Indicadores simples para tomar decisiones rapido</Text>
      </View>

      <View style={styles.summaryGrid}>
        {summaryItems.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Modulos principales</Text>
        <Text style={styles.sectionHint}>Tres servicios, una misma experiencia A-Tec</Text>
      </View>

      <View style={styles.areaList}>
        {appAreas.map((area) => (
          <AreaCard key={area.id} area={area} onPress={() => onOpenArea(area.id)} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Accesos rapidos</Text>
        <Text style={styles.sectionHint}>Acciones preparadas para los proximos bloques</Text>
      </View>

      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity activeOpacity={0.82} key={action.id} style={styles.quickAction}>
            <View style={styles.quickIcon}>
              <Text style={styles.quickIconText}>{action.icon}</Text>
            </View>
            <View style={styles.quickCopy}>
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickCaption}>{action.caption}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: homeColors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    marginBottom: 18,
    minHeight: 244,
    overflow: 'hidden',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
  },
  headerHalo: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 110,
    height: 210,
    position: 'absolute',
    right: -78,
    top: -82,
    width: 210,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12,
  },
  subtitle: {
    color: '#d7fbf7',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    height: 50,
    justifyContent: 'center',
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    width: 50,
  },
  avatarText: {
    color: homeColors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  familyPanel: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: homeRadii.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    padding: 16,
  },
  panelKicker: {
    color: '#d7fbf7',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 28,
    marginTop: 10,
    maxWidth: 240,
  },
  panelMark: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 17,
    height: 48,
    justifyContent: 'center',
    width: 58,
  },
  panelMarkText: {
    color: homeColors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  sectionHeader: {
    marginTop: 22,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: homeColors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  sectionHint: {
    color: homeColors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 20,
  },
  areaList: {
    gap: 16,
    marginTop: 14,
    paddingHorizontal: 20,
  },
  quickGrid: {
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: homeRadii.control,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 70,
    paddingHorizontal: 14,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: homeColors.primarySoft,
    borderRadius: 15,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  quickIconText: {
    color: homeColors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  quickCopy: {
    flex: 1,
    marginLeft: 12,
  },
  quickLabel: {
    color: homeColors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  quickCaption: {
    color: homeColors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
});
