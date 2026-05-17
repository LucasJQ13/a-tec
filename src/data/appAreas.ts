import type { AreaConfig } from '../types/navigation';

export const appAreas: AreaConfig[] = [
  {
    id: 'electricidad',
    title: 'Servicio de Electricidad',
    label: 'Electricidad',
    description: 'Presupuestos, materiales, instalaciones y trabajos electricos.',
    icon: '⚡',
    eyebrow: 'Industrial',
    accent: '#f5a524',
    accentSoft: '#fff3d4',
    textColor: '#201a12',
    stats: '12 tareas',
  },
  {
    id: 'kinesiologia',
    title: 'Kinesiologia y Fisioterapia',
    label: 'Kinesiologia',
    description: 'Pacientes, sesiones, turnos y tratamientos.',
    icon: '+',
    eyebrow: 'Salud',
    accent: '#36b7a0',
    accentSoft: '#ddf8f3',
    textColor: '#10231f',
    stats: '8 turnos',
  },
  {
    id: 'imprenta',
    title: 'Servicio de Imprenta',
    label: 'Imprenta',
    description: 'Disenos, impresiones, pedidos, costos y entregas.',
    icon: 'CMYK',
    eyebrow: 'Creativo',
    accent: '#8f5cf7',
    accentSoft: '#f0e6ff',
    textColor: '#1d1430',
    stats: '5 pedidos',
  },
];

export const summaryItems = [
  { label: 'Pendientes', value: '14', caption: 'presupuestos' },
  { label: 'Activos', value: '9', caption: 'trabajos' },
  { label: 'Clientes', value: '38', caption: 'cargados' },
  { label: 'Mes', value: '$245k', caption: 'estimado' },
];
