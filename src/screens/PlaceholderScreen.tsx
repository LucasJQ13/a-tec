import { StyleSheet, Text, View } from 'react-native';

type PlaceholderScreenProps = {
  title: string;
  subtitle: string;
};

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Proximo bloque</Text>
        <Text style={styles.cardText}>Esta seccion queda preparada para sumar funcionalidad mas adelante.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 110,
    paddingHorizontal: 22,
    paddingTop: 34,
  },
  title: {
    color: '#202334',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#737988',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    marginTop: 26,
    padding: 20,
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
  },
  cardTitle: {
    color: '#202334',
    fontSize: 18,
    fontWeight: '900',
  },
  cardText: {
    color: '#777e8d',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 8,
  },
});
