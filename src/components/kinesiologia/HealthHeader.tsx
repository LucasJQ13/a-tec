import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

type HealthHeaderProps = {
  onBack: () => void;
};

export function HealthHeader({ onBack }: HealthHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>A-Tec</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.profileLink}>
          <Text style={styles.profileLinkText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.welcome}>Bienvenida Licenciada Fernanda</Text>
          <Text style={styles.subtitle}>Gestión de pacientes, sesiones y tratamientos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: healthColors.night,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingBottom: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.cream,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
  },
});
