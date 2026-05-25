export type MainTabId = 'home' | 'agenda' | 'reports' | 'reminders' | 'settings';

export type AppScreen = MainTabId | 'electricidad' | 'kinesiologia' | 'imprenta';

export type AreaId = 'electricidad' | 'kinesiologia' | 'imprenta';

export type ModuleConfig = {
  id: AreaId;
  title: string;
  description: string;
  greeting: string;
  subtitle: string;
  chip: string;
  icon: string;
  accent: string;
  accentSoft: string;
  accentDark: string;
  preview: string;
};

export type MetricConfig = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

export type QuickActionConfig = {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary';
};

export type UserProfileId = 'lucas' | 'fernanda';

export type UserProfile = {
  id: UserProfileId;
  name: string;
  role: string;
  initial: string;
};

export type RootStackParamList = {
  Home: undefined;
  Electricidad: undefined;
  Kinesiologia: undefined;
  Imprenta: undefined;
  Clients: undefined;
  Reports: undefined;
  DailyAppointments: undefined;
  Reminders: undefined;
  Settings: undefined;
};
