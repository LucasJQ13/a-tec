export type MainTabId = 'home' | 'clients' | 'reports' | 'settings';

export type AppScreen =
  | MainTabId
  | 'electricidad'
  | 'kinesiologia'
  | 'imprenta';

export type AreaId = 'electricidad' | 'kinesiologia' | 'imprenta';

export type AreaConfig = {
  id: AreaId;
  title: string;
  label: string;
  description: string;
  icon: string;
  eyebrow: string;
  accent: string;
  accentSoft: string;
  textColor: string;
  stats: string;
};
