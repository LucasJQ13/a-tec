export type BackupStatus = 'pending' | 'synced' | 'failed';
export type AppointmentStatus = 'programada' | 'realizada' | 'cancelada' | 'reprogramada';

export type KinesiologiaPatient = {
  id: string;
  nombreApellido: string;
  domicilio: string;
  motivoConsulta: string;
  afeccionPatologia: string;
  tratamientoPropuesto: string;
  fechaNacimiento?: string;
  edadEstimada?: number;
  usaEdadEstimada: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PatientInput = {
  nombreApellido: string;
  domicilio: string;
  motivoConsulta: string;
  afeccionPatologia: string;
  tratamientoPropuesto: string;
  fechaNacimiento: string;
  edadEstimada: string;
  usaEdadEstimada: boolean;
};

export type ProfessionalProfile = {
  id: string;
  nombreCompleto: string;
  titulo: string;
  matriculaProfesional: string;
  especialidad?: string;
  horariosAtencion?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClinicalHistoryEntry = {
  id: string;
  patientId: string;
  fechaTratamiento: string;
  contenido: string;
  authorSignatureSnapshot: string;
  backupStatus: BackupStatus;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type Visit = {
  id: string;
  patientId: string;
  patientName?: string;
  visitDate: string;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
  observaciones: string;
  pagoRealizado: boolean;
  montoPagado: number;
  createdAt: string;
};
