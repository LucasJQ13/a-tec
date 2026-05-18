import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { MainTabId } from '../types/navigation';

type FloatingDockNavProps = {
  activeTab: MainTabId;
  onChangeTab: (tab: MainTabId) => void;
};

const DOCK_ITEMS: Array<{ id: MainTabId; label: string; icon: string }> = [
  { id: 'home', label: 'Inicio', icon: 'I' },
  { id: 'clients', label: 'Clientes', icon: 'C' },
  { id: 'reports', label: 'Reportes', icon: 'R' },
  { id: 'settings', label: 'Ajustes', icon: 'A' },
];

export function FloatingDockNav({ activeTab, onChangeTab }: FloatingDockNavProps) {
  return (
    <View style={styles.dock}>
      {DOCK_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <TouchableOpacity
            activeOpacity={0.78}
            key={item.id}
            onPress={() => onChangeTab(item.id)}
            style={[styles.item, isActive ? styles.activeItem : null]}
          >
            <Text style={[styles.icon, isActive ? styles.activeText : null]}>{item.icon}</Text>
            <Text style={[styles.label, isActive ? styles.activeText : null]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    alignItems: 'center',
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: homeRadii.dock,
    borderWidth: 1,
    bottom: 16,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-between',
    left: 18,
    padding: 8,
    position: 'absolute',
    right: 18,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  item: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    height: 54,
    justifyContent: 'center',
  },
  activeItem: {
    backgroundColor: homeColors.primary,
  },
  icon: {
    color: homeColors.dark,
    fontSize: 13,
    fontWeight: '900',
  },
  label: {
    color: homeColors.dark,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  activeText: {
    color: '#ffffff',
  },
});
