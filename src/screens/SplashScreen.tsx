import { StyleSheet, Text, View } from 'react-native';
import { AnimatedLoadingBar } from '../components/AnimatedLoadingBar';
import { academicTheme } from '../config/theme.config';

export function SplashScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.glow} />
      <View style={styles.brandBox}>
        <Text style={styles.brand}>A-Tec</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>Ecosistema familiar de servicios</Text>
      </View>
      <AnimatedLoadingBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: academicTheme.colors.night,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  glow: {
    backgroundColor: academicTheme.colors.bronze,
    borderRadius: 150,
    height: 260,
    opacity: 0.12,
    position: 'absolute',
    top: 110,
    width: 260,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 42,
  },
  brand: {
    color: academicTheme.colors.textLight,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
  },
  rule: {
    backgroundColor: academicTheme.colors.bronze,
    borderRadius: 2,
    height: 3,
    marginVertical: 14,
    width: 74,
  },
  subtitle: {
    color: '#D9C8A7',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
