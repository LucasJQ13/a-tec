import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { AreaConfig } from '../types/navigation';

type AreaCardProps = {
  area: AreaConfig;
  onPress: () => void;
};

export function AreaCard({ area, onPress }: AreaCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={[styles.card, { backgroundColor: area.surface }]}>
      <View style={[styles.glow, { backgroundColor: area.accentSoft }]} />

      <View style={styles.topRow}>
        <View style={[styles.iconShell, { backgroundColor: area.accent }]}>
          <Text style={styles.icon}>{area.icon}</Text>
        </View>
        <View style={styles.codeBlock}>
          <Text style={styles.shortCode}>{area.shortCode}</Text>
          <Text style={[styles.stats, { color: area.accent }]}>{area.stats}</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>{area.eyebrow}</Text>
      <Text style={[styles.title, { color: area.textColor }]}>{area.title}</Text>
      <Text style={styles.description}>{area.description}</Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.familyNote}>{area.familyNote}</Text>
          <Text style={styles.footerText}>{area.operationalHint}</Text>
        </View>
        <View style={[styles.enterButton, { backgroundColor: area.accent }]}>
          <Text style={styles.enterText}>Entrar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: homeColors.border,
    borderRadius: homeRadii.card,
    borderWidth: 1,
    minHeight: 214,
    overflow: 'hidden',
    padding: 20,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5,
  },
  glow: {
    borderRadius: 80,
    height: 138,
    opacity: 0.82,
    position: 'absolute',
    right: -42,
    top: -46,
    width: 138,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconShell: {
    alignItems: 'center',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  icon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  codeBlock: {
    alignItems: 'flex-end',
  },
  shortCode: {
    color: homeColors.softText,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  stats: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  eyebrow: {
    color: homeColors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 22,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
    marginTop: 6,
  },
  description: {
    color: homeColors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  familyNote: {
    color: homeColors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  footerText: {
    color: homeColors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  enterButton: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 16,
  },
  enterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
});
