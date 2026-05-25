import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { academicTheme, homeColors } from '../config/theme.config';
import { pickProfilePhoto, saveUserProfilePhoto, uploadUserProfilePhoto } from '../shared/services/profilePhotoService';
import { useToast } from '../shared/components/ToastProvider';
import type { UserProfile } from '../types/navigation';

type Props = {
  selectedUser: UserProfile | null;
  onBackToUsers: () => void;
};

export function UserSettingsScreen({ onBackToUsers, selectedUser }: Props) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [photoUri, setPhotoUri] = useState<string>('');
  const user = selectedUser ?? { id: 'lucas', name: 'Lucas', role: 'Administración General', initial: 'L' } as UserProfile;

  const selectPhoto = async () => {
    try {
      const uri = await pickProfilePhoto();
      if (!uri) return;
      setPhotoUri(uri);
      const publicUrl = await uploadUserProfilePhoto(user.id, uri);
      await saveUserProfilePhoto(user.id, publicUrl);
      showToast('Foto de perfil guardada', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar foto', 'error');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 124 }]}>
      <Text style={styles.eyebrow}>Ajustes</Text>
      <Text style={styles.title}>Perfil de usuario</Text>
      <View style={styles.card}>
        <View style={styles.avatar}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{user.initial}</Text>}
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
        <TouchableOpacity onPress={selectPhoto} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Seleccionar foto de perfil</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onBackToUsers} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Cambiar usuario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#040833', borderRadius: 8, height: 96, justifyContent: 'center', width: 96 },
  avatarImage: { borderRadius: 8, height: 96, width: 96 },
  avatarText: { color: '#fcf4e4', fontSize: 36, fontWeight: '900' },
  card: { backgroundColor: '#fcf4e4', borderColor: 'rgba(4,8,51,0.1)', borderRadius: 8, borderWidth: 1, marginTop: 20, padding: 18 },
  content: { paddingHorizontal: 18 },
  eyebrow: { color: '#D2BF99', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: '#040833', fontSize: 24, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  primaryButton: { alignItems: 'center', backgroundColor: '#040833', borderRadius: 8, marginTop: 18, padding: 14 },
  primaryButtonText: { color: '#fcf4e4', fontSize: 14, fontWeight: '900' },
  role: { color: '#54582F', fontSize: 14, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  screen: { backgroundColor: homeColors.background, flex: 1 },
  secondaryButton: { alignItems: 'center', borderColor: 'rgba(252,244,228,0.35)', borderRadius: 8, borderWidth: 1, marginTop: 14, padding: 14 },
  secondaryButtonText: { color: '#fcf4e4', fontSize: 14, fontWeight: '900' },
  title: { color: academicTheme.colors.textLight, fontSize: 32, fontWeight: '900', marginTop: 6 },
});
