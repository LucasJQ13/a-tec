import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserChoiceCard } from '../components/UserChoiceCard';
import { academicTheme } from '../config/theme.config';
import { USERS_CONFIG } from '../config/users.config';
import type { UserProfile } from '../types/navigation';

type WelcomeUserScreenProps = {
  onSelectUser: (user: UserProfile) => void;
};

export function WelcomeUserScreen({ onSelectUser }: WelcomeUserScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 22 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>A-Tec</Text>
        <Text style={styles.title}>Bienvenidos, como trabajamos hoy?</Text>
        <Text style={styles.subtitle}>Elegir usuario para iniciar una sesion familiar de gestion.</Text>
      </View>

      <View style={styles.users}>
        {USERS_CONFIG.map((user) => (
          <UserChoiceCard key={user.id} user={user} onPress={() => onSelectUser(user)} />
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>Ambos perfiles tienen las mismas atribuciones por ahora.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: academicTheme.colors.night,
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
  },
  header: {
    marginBottom: 18,
  },
  brand: {
    color: academicTheme.colors.bronzeLight,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: academicTheme.colors.textLight,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    marginTop: 14,
  },
  subtitle: {
    color: '#D6C4A1',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 10,
  },
  users: {
    marginTop: 12,
  },
  note: {
    borderColor: 'rgba(176, 141, 87, 0.35)',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 14,
  },
  noteText: {
    color: '#CDB993',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
});
