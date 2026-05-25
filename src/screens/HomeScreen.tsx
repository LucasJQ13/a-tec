import { BackHandler, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AcademicHeader } from '../components/AcademicHeader';
import { HorizontalModuleRail } from '../components/HorizontalModuleRail';
import { MetricsGlassStrip } from '../components/MetricsGlassStrip';
import { QuickActionPill } from '../components/QuickActionPill';
import { academicTheme, homeColors } from '../config/theme.config';
import { METRICS, MODULES_CONFIG, QUICK_ACTIONS } from '../config/modules.config';
import { usePullRefresh } from '../shared/hooks/usePullRefresh';
import type { AreaId, UserProfile } from '../types/navigation';

type HomeScreenProps = {
  onOpenArea: (area: AreaId) => void;
  onBackToUsers: () => void;
  selectedUser: UserProfile | null;
};

export function HomeScreen({ onBackToUsers, onOpenArea, selectedUser }: HomeScreenProps) {
  const { onRefresh, refreshing } = usePullRefresh();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBackToUsers();
      return true;
    });

    return () => subscription.remove();
  }, [onBackToUsers]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: 132 + insets.bottom }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={academicTheme.colors.bronzeLight}
          colors={[academicTheme.colors.bronzeLight]}
          progressBackgroundColor="rgba(11, 29, 58, 0.72)"
        />
      }
    >
      <AcademicHeader selectedUser={selectedUser} onBackToUsers={onBackToUsers} />

      <MetricsGlassStrip metrics={METRICS} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Hub</Text>
        <Text style={styles.sectionHint}>Puertas de entrada a cada servicio</Text>
      </View>

      <HorizontalModuleRail modules={MODULES_CONFIG} onOpenArea={onOpenArea} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
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
    paddingBottom: 132,
  },
  sectionHeader: {
    marginTop: 26,
    paddingHorizontal: 22,
  },
  sectionTitle: {
    color: academicTheme.colors.textLight,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionHint: {
    color: '#D2BF99',
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
