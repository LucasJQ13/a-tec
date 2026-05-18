import { homeColors } from '../constants/homeTheme';
import type { AreaConfig, QuickAction, SummaryMetric } from '../types/navigation';

export const appAreas: AreaConfig[] = [
  {
    id: 'electricidad',
    title: 'Servicio de Electricidad',
    label: 'Electricidad',
    description: 'Instalaciones, reparaciones y trabajos tecnicos con control de costos.',
    icon: 'EL',
    eyebrow: 'Tecnico',
    shortCode: 'E-01',
    accent: homeColors.electric,
    accentSoft: homeColors.electricSoft,
    surface: '#fffaf0',
    textColor: homeColors.text,
    stats: '12 activos',
    operationalHint: 'Ordenes, visitas y presupuestos',
    familyNote: 'Gestion Lucas',
  },
  {
    id: 'kinesiologia',
    title: 'Kinesiologia y Fisioterapia',
    label: 'Kinesiologia',
    description: 'Atencion profesional, sesiones y seguimiento con una experiencia clara.',
    icon: 'KF',
    eyebrow: 'Salud',
    shortCode: 'K-02',
    accent: homeColors.health,
    accentSoft: homeColors.healthSoft,
    surface: '#fbfffe',
    textColor: homeColors.text,
    stats: '8 sesiones',
    operationalHint: 'Pacientes, turnos y planes',
    familyNote: 'Gestion familiar',
  },
  {
    id: 'imprenta',
    title: 'Servicio de Imprenta',
    label: 'Imprenta',
    description: 'Diseno, produccion grafica, pedidos y entregas con mirada creativa.',
    icon: 'IM',
    eyebrow: 'Grafica',
    shortCode: 'I-03',
    accent: homeColors.print,
    accentSoft: homeColors.printSoft,
    surface: '#fffbfd',
    textColor: homeColors.text,
    stats: '5 pedidos',
    operationalHint: 'Costeo, diseno y entrega',
    familyNote: 'Lucas y Fernanda',
  },
];

export const summaryItems: SummaryMetric[] = [
  {
    label: 'Presupuestos pendientes',
    value: '14',
    caption: 'por revisar',
    icon: 'PP',
    tone: 'primary',
  },
  {
    label: 'Trabajos activos',
    value: '9',
    caption: 'en curso',
    icon: 'TA',
    tone: 'electric',
  },
  {
    label: 'Clientes cargados',
    value: '38',
    caption: 'base familiar',
    icon: 'CL',
    tone: 'health',
  },
  {
    label: 'Total mensual',
    value: '$245k',
    caption: 'estimado',
    icon: 'TM',
    tone: 'print',
  },
];

export const quickActions: QuickAction[] = [
  { id: 'budget', label: 'Nuevo presupuesto', caption: 'Crear TEC-000001', icon: '+' },
  { id: 'client', label: 'Nuevo cliente', caption: 'Alta rapida', icon: 'CL' },
  { id: 'work', label: 'Nuevo trabajo', caption: 'Orden interna', icon: 'OT' },
  { id: 'reports', label: 'Reportes', caption: 'Vista mensual', icon: 'RP' },
];
