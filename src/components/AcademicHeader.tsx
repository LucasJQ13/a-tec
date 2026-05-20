import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { academicTheme } from '../config/theme.config';
import type { UserProfile } from '../types/navigation';

type AcademicHeaderProps = {
  selectedUser?: UserProfile | null;
  onBackToUsers: () => void;
};

export function AcademicHeader({ selectedUser, onBackToUsers }: AcademicHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <View style={styles.ornamentTop} />
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={onBackToUsers} style={styles.backButton}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.brand}>A-Tec</Text>
        </View>
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>{selectedUser?.initial ?? 'LF'}</Text>
        </View>
      </View>

      <Text style={styles.kicker}>Empresa familiar Canavidez-Quiroga</Text>
      <Text style={styles.title}>Bienvenidos Fer y Lucas</Text>
      <Text style={styles.subtitle}>Disciplina, sacrificio y perseverancia</Text>
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
    minHeight: 270,
    overflow: 'hidden',
    paddingBottom: 28,
    paddingHorizontal: 22,
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
  brandRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minWidth: 0,
  },
  backButton: {
    alignItems: 'center',
    borderColor: academicTheme.colors.bronze,
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  backText: {
    color: academicTheme.colors.bronzeLight,
    fontSize: 12,
    fontWeight: '900',
  },
  brand: {
    color: academicTheme.colors.textLight,
    fontSize: 28,
    fontWeight: '900',
    flexShrink: 1,
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
    marginTop: 24,
    textTransform: 'uppercase',
  },
  title: {
    color: academicTheme.colors.textLight,
    fontSize: 28,
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
    marginTop: 14,
    marginBottom: 14,
    maxWidth: 300,
  },
});
