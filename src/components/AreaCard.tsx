import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AreaConfig } from '../types/navigation';

type AreaCardProps = {
  area: AreaConfig;
  onPress: () => void;
};

export function AreaCard({ area, onPress }: AreaCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[styles.card, { backgroundColor: area.accentSoft }]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBubble, { backgroundColor: area.accent }]}>
          <Text style={styles.icon}>{area.icon}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={[styles.eyebrow, { color: area.accent }]}>{area.eyebrow}</Text>
          <Text style={styles.stats}>{area.stats}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: area.textColor }]}>{area.title}</Text>
      <Text style={styles.description}>{area.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ingresar</Text>
        <View style={[styles.arrowCircle, { backgroundColor: area.accent }]}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    minHeight: 184,
    shadowColor: '#6b5b8f',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  iconBubble: {
    alignItems: 'center',
    borderRadius: 20,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  metaBlock: {
    alignItems: 'flex-end',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  stats: {
    color: '#6d7280',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
  },
  description: {
    color: '#697082',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  footerText: {
    color: '#222838',
    fontSize: 13,
    fontWeight: '900',
  },
  arrowCircle: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  arrow: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
});
