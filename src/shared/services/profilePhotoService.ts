import { supabase } from './supabaseClient';
import type { UserProfileId } from '../../types/navigation';

const BUCKET = 'profile-photos';

function publicUrl(path: string) {
  if (!supabase) return '';
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function pickProfilePhoto() {
  const ImagePicker = await import('expo-image-picker');
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('Permiso de galería denegado.');
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.82,
  });
  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

export async function uploadUserProfilePhoto(userId: UserProfileId, uri: string) {
  if (!supabase) throw new Error('No se pudo conectar con Supabase.');
  const response = await fetch(uri);
  const blob = await response.blob();
  const path = `${userId}/avatar.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '3600',
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return publicUrl(path);
}

export async function saveUserProfilePhoto(userId: UserProfileId, photoUrl: string) {
  if (!supabase) throw new Error('No se pudo conectar con Supabase.');
  const { error } = await supabase.from('user_profiles').upsert({
    id: userId,
    display_name: userId === 'lucas' ? 'Lucas' : 'Fernanda',
    profile_photo_url: photoUrl,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
