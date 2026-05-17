import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MainTabId } from '../types/navigation';

type BottomNavProps = {
  activeTab: MainTabId;
  onChangeTab: (tab: MainTabId) => void;
};

const tabs: Array<{ id: MainTabId; label: string; icon: string }> = [
  { id: 'home', label: 'Inicio', icon: '⌂' },
  { id: 'clients', label: 'Clientes', icon: '◎' },
  { id: 'reports', label: 'Reportes', icon: '▥' },
  { id: 'settings', label: 'Ajustes', icon: '⚙' },
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
            <Text style={[styles.icon, isActive ? styles.activeText : null]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive ? styles.activeText : null]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    bottom: 16,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    left: 18,
    padding: 8,
    position: 'absolute',
    right: 18,
    shadowColor: '#55486f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  item: {
    alignItems: 'center',
    borderRadius: 22,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
  },
  activeItem: {
    backgroundColor: '#1e2232',
  },
  icon: {
    color: '#8a90a0',
    fontSize: 17,
    fontWeight: '900',
  },
  label: {
    color: '#8a90a0',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  activeText: {
    color: '#ffffff',
  },
});
