import { StyleSheet, Text, View } from 'react-native';

type SummaryCardProps = {
  label: string;
  value: string;
  caption: string;
};

export function SummaryCard({ label, value, caption }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    minHeight: 106,
    padding: 14,
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: '48%',
  },
  label: {
    color: '#7a7f8e',
    fontSize: 12,
    fontWeight: '800',
  },
  value: {
    color: '#202334',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  caption: {
    color: '#9aa0ad',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
