import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

export type KinesiologyTab = 'services' | 'dates' | 'profile';

type ModuleTabsProps = {
  activeTab: KinesiologyTab;
  onChangeTab: (tab: KinesiologyTab) => void;
};

const tabs: Array<{ id: KinesiologyTab; label: string }> = [
  { id: 'services', label: 'Servicios' },
  { id: 'dates', label: 'Fechas' },
  { id: 'profile', label: 'Perfil' },
];

export function ModuleTabs({ activeTab, onChangeTab }: ModuleTabsProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity key={tab.id} activeOpacity={0.8} onPress={() => onChangeTab(tab.id)} style={styles.tab}>
            <Text style={[styles.label, isActive ? styles.activeLabel : null]}>{tab.label}</Text>
            <View style={[styles.indicator, isActive ? styles.activeIndicator : null]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: healthColors.cream,
    borderRadius: 24,
    borderColor: healthColors.olive,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 20,
    marginTop: -18,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  label: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  activeLabel: {
    color: healthColors.night,
  },
  indicator: {
    backgroundColor: healthColors.cream,
    borderRadius: 2,
    height: 4,
    marginTop: 7,
    width: 38,
  },
  activeIndicator: {
    backgroundColor: healthColors.burgundy,
  },
});
