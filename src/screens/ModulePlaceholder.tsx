import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePullRefresh } from '../shared/hooks/usePullRefresh';

type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  welcome?: string;
  moduleSubtitle?: string;
  accent: string;
  secondaryAccent?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  icon: string;
  onBack: () => void;
};

export function ModulePlaceholder({
  title,
  subtitle,
  welcome,
  moduleSubtitle,
  accent,
  secondaryAccent,
  backgroundColor = '#ffffff',
  surfaceColor = '#ffffff',
  textColor = '#202334',
  icon,
  onBack,
}: ModulePlaceholderProps) {
  const detailColor = secondaryAccent ?? accent;
  const insets = useSafeAreaInsets();
  const { onRefresh, refreshing } = usePullRefresh();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.screen, { backgroundColor, paddingTop: insets.top + 16 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={accent}
          colors={[accent]}
          progressBackgroundColor="rgba(255,255,255,0.86)"
        />
      }
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBack}
        style={[styles.backButton, { borderColor: accent }]}
      >
        <Text style={[styles.backText, { color: accent }]}>{'<'}</Text>
      </TouchableOpacity>

      <View style={[styles.iconBubble, { backgroundColor: detailColor }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {welcome && moduleSubtitle ? (
        <View style={[styles.welcomeCard, { backgroundColor: surfaceColor, borderLeftColor: detailColor }]}>
          <Text style={[styles.welcomeTitle, { color: textColor }]}>{welcome}</Text>
          <Text style={styles.welcomeSubtitle}>{moduleSubtitle}</Text>
        </View>
      ) : null}

      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>Modulo en preparacion</Text>
        <Text style={styles.cardText}>
          Esta pantalla queda lista como entrada visual para desarrollar el flujo especifico en el siguiente bloque.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 110,
    paddingHorizontal: 22,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 18,
    height: 42,
    minHeight: 42,
    justifyContent: 'center',
    width: 42,
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
    borderRadius: 14,
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
    fontSize: 30,
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
    borderRadius: 14,
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
    borderRadius: 14,
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
