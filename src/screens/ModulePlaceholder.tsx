import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  welcome?: string;
  moduleSubtitle?: string;
  accent: string;
  icon: string;
  onBack: () => void;
};

export function ModulePlaceholder({
  title,
  subtitle,
  welcome,
  moduleSubtitle,
  accent,
  icon,
  onBack,
}: ModulePlaceholderProps) {
  return (
    <View style={styles.screen}>
      <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={[styles.iconBubble, { backgroundColor: accent }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {welcome && moduleSubtitle ? (
        <View style={[styles.welcomeCard, { borderLeftColor: accent }]}>
          <Text style={styles.welcomeTitle}>{welcome}</Text>
          <Text style={styles.welcomeSubtitle}>{moduleSubtitle}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modulo en preparacion</Text>
        <Text style={styles.cardText}>
          Esta pantalla queda lista como entrada visual para desarrollar el flujo especifico en el siguiente bloque.
        </Text>
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
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  backText: {
    color: '#252a3a',
    fontSize: 14,
    fontWeight: '900',
  },
  iconBubble: {
    alignItems: 'center',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginTop: 46,
    width: 68,
  },
  icon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  title: {
    color: '#202334',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 22,
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
    marginTop: 28,
    padding: 20,
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderRadius: 24,
    marginTop: 24,
    padding: 18,
    shadowColor: '#756a91',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  welcomeTitle: {
    color: '#202334',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  welcomeSubtitle: {
    color: '#737988',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 6,
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
