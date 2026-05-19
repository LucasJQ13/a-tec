import { StyleSheet, Text, View } from 'react-native';
import { academicTheme } from '../config/theme.config';
import type { UserProfile } from '../types/navigation';

type AcademicHeaderProps = {
  selectedUser?: UserProfile | null;
};

export function AcademicHeader({ selectedUser }: AcademicHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.ornamentTop} />
      <View style={styles.topRow}>
        <Text style={styles.brand}>A-Tec</Text>
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>{selectedUser?.initial ?? 'LF'}</Text>
        </View>
      </View>

      <Text style={styles.kicker}>Biblioteca operativa familiar</Text>
      <Text style={styles.title}>Bienvenidos Fer y Lucas</Text>
      <Text style={styles.subtitle}>Ecosistema familiar de servicios</Text>
      <Text style={styles.context}>
        {selectedUser ? `Sesion de trabajo: ${selectedUser.name}` : 'Electricidad, salud e imprenta bajo una misma casa.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: academicTheme.colors.primary,
    borderBottomLeftRadius: academicTheme.radii.hero,
    borderBottomRightRadius: academicTheme.radii.hero,
    minHeight: 258,
    overflow: 'hidden',
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
    shadowColor: academicTheme.colors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
  },
  ornamentTop: {
    backgroundColor: academicTheme.colors.bronze,
    borderRadius: 120,
    height: 210,
    opacity: 0.13,
    position: 'absolute',
    right: -84,
    top: -88,
    width: 210,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: academicTheme.colors.textLight,
    fontSize: 28,
    fontWeight: '900',
  },
  userBadge: {
    alignItems: 'center',
    backgroundColor: academicTheme.colors.card,
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  userBadgeText: {
    color: academicTheme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  kicker: {
    color: academicTheme.colors.bronzeLight,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 28,
    textTransform: 'uppercase',
  },
  title: {
    color: academicTheme.colors.textLight,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    marginTop: 10,
    maxWidth: 310,
  },
  subtitle: {
    color: '#E7D7B8',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  context: {
    color: '#D5C29F',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 18,
    maxWidth: 300,
  },
});
