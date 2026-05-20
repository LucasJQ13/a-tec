import { StyleSheet, Text, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';
import type { MetricConfig } from '../types/navigation';

type MetricsGlassStripProps = {
  metrics: MetricConfig[];
};

export function MetricsGlassStrip({ metrics }: MetricsGlassStripProps) {
  return (
    <View style={styles.strip}>
      {metrics.map((metric, index) => (
        <View key={metric.id} style={styles.metricSlot}>
          <View style={styles.metricIcon}>
            <Text style={styles.metricIconText}>{metric.icon}</Text>
          </View>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          {index < metrics.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: homeColors.glass,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: homeRadii.glass,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 18,
    minHeight: 104,
    paddingHorizontal: 8,
    paddingVertical: 14,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  metricSlot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: homeColors.primarySoft,
    borderRadius: 10,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  metricIconText: {
    color: homeColors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  metricValue: {
    color: homeColors.text,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 7,
  },
  metricLabel: {
    color: homeColors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  divider: {
    backgroundColor: homeColors.divider,
    bottom: 8,
    position: 'absolute',
    right: 0,
    top: 8,
    width: 1,
  },
});
