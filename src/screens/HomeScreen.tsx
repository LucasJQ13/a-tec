import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AreaCard } from '../components/AreaCard';
import { SummaryCard } from '../components/SummaryCard';
import { appAreas, summaryItems } from '../data/appAreas';
import type { AreaId } from '../types/navigation';

type HomeScreenProps = {
  onOpenArea: (area: AreaId) => void;
};

export function HomeScreen({ onOpenArea }: HomeScreenProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>A-Tec</Text>
          <Text style={styles.greeting}>Bienvenido, Lucas</Text>
          <Text style={styles.subtitle}>Gestion integral de servicios</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.profileButton}>
          <Text style={styles.profileIcon}>L</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featurePanel}>
        <View style={styles.featureCopy}>
          <Text style={styles.panelKicker}>Resumen general</Text>
          <Text style={styles.panelTitle}>Tu operacion del dia en una sola vista.</Text>
        </View>
        <View style={styles.panelBadge}>
          <Text style={styles.panelBadgeText}>MVP</Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            caption={item.caption}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Areas principales</Text>
        <Text style={styles.sectionHint}>Elegi un modulo</Text>
      </View>

      <View style={styles.areaList}>
        {appAreas.map((area) => (
          <AreaCard key={area.id} area={area} onPress={() => onOpenArea(area.id)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 114,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#202334',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greeting: {
    color: '#34394a',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: '#8a90a0',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    width: 48,
  },
  profileIcon: {
    color: '#8f5cf7',
    fontSize: 18,
    fontWeight: '900',
  },
  featurePanel: {
    backgroundColor: '#242234',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    minHeight: 136,
    overflow: 'hidden',
    padding: 22,
  },
  featureCopy: {
    flex: 1,
    paddingRight: 14,
  },
  panelKicker: {
    color: '#d9ccff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 29,
    marginTop: 10,
  },
  panelBadge: {
    alignItems: 'center',
    backgroundColor: '#8f5cf7',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 58,
  },
  panelBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 18,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  sectionTitle: {
    color: '#202334',
    fontSize: 21,
    fontWeight: '900',
  },
  sectionHint: {
    color: '#9a90b9',
    fontSize: 13,
    fontWeight: '800',
  },
  areaList: {
    gap: 16,
    marginTop: 14,
  },
});
