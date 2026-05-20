export const kinesiologyServices = [
  { id: 'patients', title: 'Pacientes', icon: 'P' },
  { id: 'sessions', title: 'Sesiones', icon: '+' },
  { id: 'treatments', title: 'Tratamientos', icon: 'T' },
  { id: 'appointments', title: 'Turnos', icon: 'C' },
  { id: 'history', title: 'Historial', icon: 'H' },
  { id: 'stats', title: 'Estadisticas', icon: '%' },
];

export const kinesiologyPatients = [
  {
    id: 'maria',
    name: 'Maria Gonzalez',
    nextSession: 'Sesion hoy 10:00',
    state: 'Activo',
    initials: 'MG',
  },
  {
    id: 'juan',
    name: 'Juan Perez',
    nextSession: 'Sesion hoy 11:30',
    state: 'Seguimiento',
    initials: 'JP',
  },
];

export const calendarDays = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;

  return {
    day,
    isSelected: day === 16,
    isAvailable: [3, 5, 8, 10, 12, 16, 18, 21, 24, 27].includes(day),
  };
});

export const availableTimes = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
];

export const profileSpecialties = [
  'Rehabilitacion funcional',
  'Terapia manual',
  'Kinesiología deportiva',
  'Tratamientos posturales',
];
