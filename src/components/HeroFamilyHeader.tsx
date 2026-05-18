import { StyleSheet, Text, View } from 'react-native';
import { homeColors, homeRadii } from '../constants/homeTheme';

type HeroFamilyHeaderProps = {
  label: string;
  greeting: string;
  subtitle: string;
  description: string;
};

export function HeroFamilyHeader({ label, greeting, subtitle, description }: HeroFamilyHeaderProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.darkOverlay} />
      <View style={styles.lightOverlay} />

      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.avatarStack}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>L</Text>
          </View>
          <View style={[styles.avatar, styles.avatarOverlap]}>
            <Text style={styles.avatarText}>F</Text>
          </View>
        </View>
      </View>

      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: homeColors.primary,
    borderBottomLeftRadius: homeRadii.hero,
    borderBottomRightRadius: homeRadii.hero,
    height: 248,
    overflow: 'hidden',
    padding: 24,
    shadowColor: homeColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 30,
  },
  darkOverlay: {
    backgroundColor: homeColors.primaryDeeper,
    borderRadius: 130,
    height: 230,
    opacity: 0.32,
    position: 'absolute',
    right: -92,
    top: -72,
    width: 230,
  },
  lightOverlay: {
    backgroundColor: '#ffffff',
    borderRadius: 90,
    bottom: -58,
    height: 150,
    left: -48,
    opacity: 0.12,
    position: 'absolute',
    width: 150,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  avatarStack: {
    flexDirection: 'row',
    paddingRight: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 21,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarOverlap: {
    marginLeft: -14,
  },
  avatarText: {
    color: homeColors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  greeting: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    marginTop: 28,
    maxWidth: 285,
  },
  subtitle: {
    color: '#E4FFFC',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  description: {
    color: '#C9F4F1',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 18,
    maxWidth: 270,
  },
});
