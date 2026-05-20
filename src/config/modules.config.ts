import type { MetricConfig, ModuleConfig, QuickActionConfig } from '../types/navigation';

export const MODULES_CONFIG: ModuleConfig[] = [
  {
    id: 'electricidad',
    title: 'Electricidad',
    description: 'Servicios electricos, visitas tecnicas, materiales y presupuestos.',
    greeting: 'Bienvenido Lucas',
    subtitle: 'Gestion de servicios electricos',
    chip: 'Lucas',
    icon: 'EL',
    accent: '#3e5bb8',
    accentSoft: '#E8EDFF',
    accentDark: '#f7651b',
    preview: 'Tecnico, rapido y ordenado',
  },
  {
    id: 'kinesiologia',
    title: 'Kinesiología',
    description: 'Pacientes, sesiones, tratamientos y seguimiento profesional.',
    greeting: 'Bienvenida Lic. Fernanda',
    subtitle: 'Gestión de pacientes, sesiones y tratamientos',
    chip: 'Lic. Fernanda',
    icon: 'KF',
    accent: '#040833',
    accentSoft: '#fcf4e4',
    accentDark: '#040833',
    preview: 'Salud premium y humana',
  },
  {
    id: 'imprenta',
    title: 'Imprenta',
    description: 'Diseno, produccion grafica, pedidos, costos y entregas.',
    greeting: 'Bienvenidos Fer y Lucas',
    subtitle: 'Gestion de servicios de imprenta',
    chip: 'Fer y Lucas',
    icon: 'IM',
    accent: '#B08D57',
    accentSoft: '#F4EBD8',
    accentDark: '#102A43',
    preview: 'Creatividad con control',
  },
];

export const METRICS: MetricConfig[] = [
  { id: 'pending', label: 'Pendientes', value: '14', icon: 'P' },
  { id: 'active', label: 'Activos', value: '9', icon: 'A' },
  { id: 'clients', label: 'Clientes', value: '38', icon: 'C' },
  { id: 'month', label: 'Mes', value: '$245k', icon: '$' },
];

export const QUICK_ACTIONS: QuickActionConfig[] = [
  { id: 'budget', label: 'Nuevo presupuesto', icon: '+', variant: 'primary' },
  { id: 'client', label: 'Nuevo cliente', icon: 'C', variant: 'secondary' },
  { id: 'work', label: 'Nuevo trabajo', icon: 'T', variant: 'secondary' },
  { id: 'reports', label: 'Reportes', icon: 'R', variant: 'secondary' },
];
