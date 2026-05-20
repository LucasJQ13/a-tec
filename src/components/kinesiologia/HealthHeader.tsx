import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { healthColors } from '../../constants/healthTheme';

type HealthHeaderProps = {
  onBack: () => void;
};

export function HealthHeader({ onBack }: HealthHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.topRow}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.profileLink}>
          <Text style={styles.profileLinkText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>F</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.welcome}>Bienvenida Lic. Fernanda</Text>
          <Text style={styles.subtitle}>Gestion de pacientes, sesiones y tratamientos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: healthColors.night,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingBottom: 26,
    paddingHorizontal: 20,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.cream,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backText: {
    color: healthColors.cream,
    fontSize: 12,
    fontWeight: '900',
  },
  profileLink: {
    borderBottomColor: healthColors.burgundy,
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
  profileLinkText: {
    color: healthColors.cream,
    fontSize: 12,
    fontWeight: '900',
  },
  mainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: healthColors.cream,
    borderColor: healthColors.cream,
    borderRadius: 34,
    borderWidth: 4,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  avatarText: {
    color: healthColors.night,
    fontSize: 25,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
  },
  welcome: {
    color: healthColors.cream,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 26,
  },
  subtitle: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
  },
});
