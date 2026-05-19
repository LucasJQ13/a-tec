export type ModuleKey = 'kinesiologia' | 'electricidad' | 'imprenta';

export type EntityStatus = 'active' | 'inactive';

export type Contact = {
  id: string;
  moduleKey: ModuleKey;
  fullName: string;
  phone: string;
  email: string;
  dni?: string;
  birthDate?: string;
  notes?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContactInput = {
  fullName: string;
  phone: string;
  email: string;
  dni?: string;
  birthDate?: string;
  notes?: string;
  status: EntityStatus;
};

export type ModuleEntityLabels = {
  contactLabel: string;
  contactsLabel: string;
  serviceLabel: string;
  servicesLabel: string;
  quoteLabel: string;
  quotesLabel: string;
};

export type ModuleFeatureConfig = {
  moduleKey: ModuleKey;
  labels: ModuleEntityLabels;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    border: string;
    muted: string;
    text: string;
  };
};
