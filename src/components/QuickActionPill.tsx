import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { QuickActionConfig } from '../types/navigation';

type QuickActionPillProps = {
  action: QuickActionConfig;
};

export function QuickActionPill({ action }: QuickActionPillProps) {
  const isPrimary = action.variant === 'primary';

  return (
    <TouchableOpacity activeOpacity={0.84} style={[styles.pill, isPrimary ? styles.primaryPill : styles.secondaryPill]}>
      <Text style={[styles.icon, isPrimary ? styles.primaryText : styles.secondaryText]}>{action.icon}</Text>
      <Text style={[styles.label, isPrimary ? styles.primaryText : styles.secondaryText]}>{action.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderRadius: homeRadii.pill,
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryPill: {
    backgroundColor: homeColors.primary,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  secondaryPill: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.primary,
    borderWidth: 1,
  },
  icon: {
    fontSize: 13,
    fontWeight: '900',
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '900',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: homeColors.primary,
  },
});
