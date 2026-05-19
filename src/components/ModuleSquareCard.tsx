import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { ModuleConfig } from '../types/navigation';

type ModuleSquareCardProps = {
  module: ModuleConfig;
  onPress: () => void;
};

export function ModuleSquareCard({ module, onPress }: ModuleSquareCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      <View style={[styles.softOrb, { backgroundColor: module.accentSoft }]} />
      <View style={[styles.iconCircle, { backgroundColor: module.accent }]}>
        <Text style={styles.iconText}>{module.icon}</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>
          {module.title}
        </Text>
        <Text style={styles.greeting} numberOfLines={2}>
          {module.greeting}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.chip, { color: module.accentDark }]}>{module.chip}</Text>
        <View style={[styles.arrowBubble, { borderColor: module.accent }]}>
          <Text style={[styles.arrow, { color: module.accent }]}>{'>'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: homeRadii.service,
    borderWidth: 1,
    height: 158,
    marginRight: 16,
    overflow: 'hidden',
    padding: 16,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    width: 158,
    elevation: 5,
  },
  softOrb: {
    borderRadius: 58,
    height: 100,
    opacity: 0.72,
    position: 'absolute',
    right: -34,
    top: -34,
    width: 100,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  copy: {
    marginTop: 16,
  },
  title: {
    color: homeColors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greeting: {
    color: homeColors.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 5,
  },
  footer: {
    alignItems: 'center',
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    position: 'absolute',
    right: 16,
  },
  chip: {
    fontSize: 11,
    fontWeight: '900',
  },
  arrowBubble: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  arrow: {
    fontSize: 14,
    fontWeight: '900',
  },
});
