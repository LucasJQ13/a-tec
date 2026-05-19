import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { academicTheme } from '../config/theme.config';
import type { UserProfile } from '../types/navigation';

type UserChoiceCardProps = {
  user: UserProfile;
  onPress: () => void;
};

export function UserChoiceCard({ user, onPress }: UserChoiceCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={styles.card}>
      <View style={styles.initialCircle}>
        <Text style={styles.initial}>{user.initial}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: academicTheme.colors.card,
    borderColor: academicTheme.colors.border,
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 14,
    minHeight: 96,
    padding: 16,
    shadowColor: academicTheme.colors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  initialCircle: {
    alignItems: 'center',
    backgroundColor: academicTheme.colors.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  initial: {
    color: academicTheme.colors.bronzeLight,
    fontSize: 22,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  name: {
    color: academicTheme.colors.textDark,
    fontSize: 19,
    fontWeight: '900',
  },
  role: {
    color: academicTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  arrow: {
    alignItems: 'center',
    borderColor: academicTheme.colors.bronze,
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  arrowText: {
    color: academicTheme.colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
});
