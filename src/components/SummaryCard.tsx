import { StyleSheet, Text, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { SummaryMetric } from '../types/navigation';

type SummaryCardProps = {
  item: SummaryMetric;
};

const toneColors = {
  primary: homeColors.primary,
  electric: homeColors.electric,
  health: homeColors.health,
  print: homeColors.print,
};

export function SummaryCard({ item }: SummaryCardProps) {
  const tone = toneColors[item.tone];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconBadge, { backgroundColor: tone }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: tone }]} />
      </View>
      <Text style={styles.value}>{item.value}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {item.label}
      </Text>
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeColors.surface,
    borderColor: homeColors.border,
    borderRadius: homeRadii.control,
    borderWidth: 1,
    minHeight: 126,
    padding: 14,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: '48%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  value: {
    color: homeColors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 12,
  },
  label: {
    color: homeColors.text,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 4,
    minHeight: 32,
  },
  caption: {
    color: homeColors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
