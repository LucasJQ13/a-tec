import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'atec-app',
  slug: 'atec-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  jsEngine: 'hermes',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.canavidezquiroga.atec',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-sqlite',
    [
      'expo-notifications',
      {
        defaultChannel: 'agenda-diaria',
      },
    ],
  ],
  extra: {
    EXPO_PUBLIC_CONTACTS_CREATED_BY: process.env.EXPO_PUBLIC_CONTACTS_CREATED_BY,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  },
};

export default config;
