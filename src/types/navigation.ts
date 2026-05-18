export type MainTabId = 'home' | 'clients' | 'reports' | 'settings';

export type AppScreen = MainTabId | 'electricidad' | 'kinesiologia' | 'imprenta';

export type AreaId = 'electricidad' | 'kinesiologia' | 'imprenta';

export type AreaConfig = {
  id: AreaId;
  title: string;
  label: string;
  description: string;
  icon: string;
  eyebrow: string;
  shortCode: string;
  accent: string;
  accentSoft: string;
  surface: string;
  textColor: string;
  stats: string;
  operationalHint: string;
  familyNote: string;
};

export type SummaryMetric = {
  label: string;
  value: string;
  caption: string;
  icon: string;
  tone: 'primary' | 'electric' | 'health' | 'print';
};

export type QuickAction = {
  id: string;
  label: string;
  caption: string;
  icon: string;
};
