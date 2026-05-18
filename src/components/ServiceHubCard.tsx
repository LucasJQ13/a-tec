import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { ModuleConfig } from '../types/navigation';

type ServiceHubCardProps = {
  module: ModuleConfig;
  onPress: () => void;
};

export function ServiceHubCard({ module, onPress }: ServiceHubCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      <View style={[styles.accentOrb, { backgroundColor: module.accentSoft }]} />

      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: module.accent }]}>
          <Text style={styles.iconText}>{module.icon}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: module.accentSoft }]}>
          <Text style={[styles.chipText, { color: module.accentDark }]}>{module.chip}</Text>
        </View>
      </View>

      <Text style={styles.preview}>{module.greeting}</Text>
      <Text style={styles.title}>{module.title}</Text>
      <Text style={styles.description}>{module.description}</Text>

      <View style={styles.footer}>
        <Text style={[styles.subtitle, { color: module.accentDark }]}>{module.subtitle}</Text>
        <View style={[styles.enterCircle, { borderColor: module.accent }]}>
          <Text style={[styles.enterArrow, { color: module.accent }]}>{'>'}</Text>
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
    marginBottom: 18,
    minHeight: 172,
    overflow: 'hidden',
    padding: 22,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.11,
    shadowRadius: 26,
    elevation: 5,
  },
  accentOrb: {
    borderRadius: 80,
    height: 142,
    opacity: 0.72,
    position: 'absolute',
    right: -52,
    top: -56,
    width: 142,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '900',
  },
  preview: {
    color: homeColors.primary,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 18,
  },
  title: {
    color: homeColors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
    marginTop: 5,
  },
  description: {
    color: homeColors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 275,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  subtitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    paddingRight: 12,
  },
  enterCircle: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  enterArrow: {
    fontSize: 18,
    fontWeight: '900',
  },
});
