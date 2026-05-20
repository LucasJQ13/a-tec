import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { healthColors } from '../../constants/healthTheme';

const navItems = [
  { id: 'home', label: 'Inicio', icon: 'I' },
  { id: 'agenda', label: 'Agenda', icon: 'A' },
  { id: 'new', label: 'Nuevo', icon: '+' },
  { id: 'alerts', label: 'Avisos', icon: 'N' },
  { id: 'messages', label: 'Mensajes', icon: 'M' },
];

export function HealthBottomNav() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {navItems.map((item) => {
        const active = item.id === 'agenda';

        return (
          <TouchableOpacity key={item.id} activeOpacity={0.8} style={styles.item}>
            <View style={[styles.iconBubble, active ? styles.activeIconBubble : null]}>
              <Text style={[styles.icon, active ? styles.activeIcon : null]}>{item.icon}</Text>
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 12,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconBubble: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  activeIconBubble: {
    backgroundColor: healthColors.cream,
  },
  icon: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '900',
  },
  activeIcon: {
    color: healthColors.night,
  },
  label: {
    color: healthColors.cream,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
});
