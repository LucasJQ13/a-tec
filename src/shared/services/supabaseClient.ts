import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

type ExpoExtra = {
  EXPO_PUBLIC_CONTACTS_CREATED_BY?: string;
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  EXPO_PUBLIC_SUPABASE_URL?: string;
};

const extra = (Constants.expoConfig?.extra ?? Constants.manifest2?.extra ?? {}) as ExpoExtra;

function getEnvValue(key: keyof ExpoExtra) {
  return process.env[key] || extra[key] || '';
}

const supabaseUrl = getEnvValue('EXPO_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvValue('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseKey as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export const contactsCreatedBy = getEnvValue('EXPO_PUBLIC_CONTACTS_CREATED_BY') || 'family-device';
