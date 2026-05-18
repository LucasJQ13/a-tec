import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { MainTabId } from '../types/navigation';

type BottomNavProps = {
  activeTab: MainTabId;
  onChangeTab: (tab: MainTabId) => void;
};

const tabs: Array<{ id: MainTabId; label: string; icon: string }> = [
  { id: 'home', label: 'Inicio', icon: 'IN' },
  { id: 'clients', label: 'Clientes', icon: 'CL' },
  { id: 'reports', label: 'Reportes', icon: 'RP' },
  { id: 'settings', label: 'Ajustes', icon: 'AJ' },
];

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            activeOpacity={0.78}
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={[styles.item, isActive ? styles.activeItem : null]}
          >
            <Text style={[styles.icon, isActive ? styles.activeIcon : null]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive ? styles.activeLabel : null]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: homeColors.border,
    borderRadius: homeRadii.card,
    borderWidth: 1,
    bottom: 16,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    left: 18,
    padding: 8,
    position: 'absolute',
    right: 18,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  item: {
    alignItems: 'center',
    borderRadius: homeRadii.control,
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  activeItem: {
    backgroundColor: homeColors.primary,
  },
  icon: {
    color: homeColors.softText,
    fontSize: 11,
    fontWeight: '900',
  },
  label: {
    color: homeColors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  activeIcon: {
    color: '#ffffff',
  },
  activeLabel: {
    color: '#ffffff',
  },
});
