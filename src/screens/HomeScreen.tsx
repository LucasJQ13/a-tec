import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeroFamilyHeader } from '../components/HeroFamilyHeader';
import { HorizontalModuleRail } from '../components/HorizontalModuleRail';
import { MetricsGlassStrip } from '../components/MetricsGlassStrip';
import { QuickActionPill } from '../components/QuickActionPill';
import { homeColors } from '../constants/homeTheme';
import { HOME_COPY, METRICS, MODULES_CONFIG, QUICK_ACTIONS } from '../data/appAreas';
import type { AreaId } from '../types/navigation';

type HomeScreenProps = {
  onOpenArea: (area: AreaId) => void;
};

export function HomeScreen({ onOpenArea }: HomeScreenProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <HeroFamilyHeader
        label={HOME_COPY.heroLabel}
        greeting={HOME_COPY.greeting}
        subtitle={HOME_COPY.subtitle}
        description={HOME_COPY.description}
      />

      <MetricsGlassStrip metrics={METRICS} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Hub</Text>
        <Text style={styles.sectionHint}>Puertas de entrada a cada servicio</Text>
      </View>

      <HorizontalModuleRail modules={MODULES_CONFIG} onOpenArea={onOpenArea} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Accesos rapidos</Text>
        <Text style={styles.sectionHint}>Acciones frecuentes sin entrar a cada modulo</Text>
      </View>

      <View style={styles.actionsWrap}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionPill key={action.id} action={action} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: homeColors.background,
    paddingBottom: 124,
  },
  sectionHeader: {
    marginTop: 26,
    paddingHorizontal: 22,
  },
  sectionTitle: {
    color: homeColors.text,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionHint: {
    color: homeColors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  actionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    paddingHorizontal: 18,
  },
});
