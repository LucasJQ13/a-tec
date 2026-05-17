import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

type PatientCardProps = {
  name: string;
  nextSession: string;
  state: string;
  initials: string;
};

export function PatientCard({ name, nextSession, state, initials }: PatientCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.84} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.session}>{nextSession}</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contact}>Tel</Text>
          <Text style={styles.contact}>Mail</Text>
          <Text style={styles.state}>{state}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  avatarText: {
    color: healthColors.cream,
    fontSize: 14,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
  },
  name: {
    color: healthColors.night,
    fontSize: 16,
    fontWeight: '900',
  },
  session: {
    color: healthColors.olive,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  contact: {
    backgroundColor: healthColors.olive,
    borderRadius: 10,
    color: healthColors.cream,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  state: {
    backgroundColor: healthColors.night,
    borderRadius: 10,
    color: healthColors.cream,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
