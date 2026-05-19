import type { ModuleFeatureConfig } from '../types/business';

export const MODULE_FEATURE_CONFIG: Record<string, ModuleFeatureConfig> = {
  kinesiologia: {
    moduleKey: 'kinesiologia',
    labels: {
      contactLabel: 'Paciente',
      contactsLabel: 'Pacientes',
      serviceLabel: 'Tratamiento',
      servicesLabel: 'Tratamientos',
      quoteLabel: 'Presupuesto',
      quotesLabel: 'Presupuestos',
    },
    colors: {
      background: '#fcf4e4',
      surface: '#fff8ea',
      primary: '#040833',
      secondary: '#AFA487',
      border: '#EFE3CC',
      muted: '#766F5F',
      text: '#040833',
    },
  },
  electricidad: {
    moduleKey: 'electricidad',
    labels: {
      contactLabel: 'Cliente',
      contactsLabel: 'Clientes',
      serviceLabel: 'Servicio electrico',
      servicesLabel: 'Servicios electricos',
      quoteLabel: 'Presupuesto',
      quotesLabel: 'Presupuestos',
    },
    colors: {
      background: '#F3F6FF',
      surface: '#ffffff',
      primary: '#3e5bb8',
      secondary: '#f7651b',
      border: '#DDE5FF',
      muted: '#667297',
      text: '#17306F',
    },
  },
  imprenta: {
    moduleKey: 'imprenta',
    labels: {
      contactLabel: 'Cliente',
      contactsLabel: 'Clientes',
      serviceLabel: 'Servicio de imprenta',
      servicesLabel: 'Servicios de imprenta',
      quoteLabel: 'Presupuesto',
      quotesLabel: 'Presupuestos',
    },
    colors: {
      background: '#FBF7FF',
      surface: '#ffffff',
      primary: '#6D35C6',
      secondary: '#00AFC7',
      border: '#E8DDF8',
      muted: '#756887',
      text: '#2A183D',
    },
  },
};
