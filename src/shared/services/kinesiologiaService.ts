import { supabase } from './supabaseClient';
import { createFinancialMovement } from './financeService';
import type {
  Appointment,
  AppointmentStatus,
  ClinicalHistoryEntry,
  KinesiologiaPatient,
  PatientInput,
  ProfessionalProfile,
  Visit,
} from '../types/kinesiologia';
import { calculateAgeFromBirthDate, formatProfessionalSignature } from '../utils/formatters';
import type { PaymentMethod } from '../types/finance';

type PatientRow = {
  id: string;
  nombre_apellido: string;
  domicilio: string;
  motivo_consulta: string;
  afeccion_patologia: string;
  tratamiento_propuesto: string;
  fecha_nacimiento: string | null;
  edad_estimada: number | null;
  usa_edad_estimada: boolean;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  nombre_completo: string;
  titulo: string;
  matricula_profesional: string;
  created_at: string;
  updated_at: string;
};

type HistoryRow = {
  id: string;
  patient_id: string;
  fecha_tratamiento: string;
  contenido: string;
  author_signature_snapshot: string;
  backup_status: 'pending' | 'synced' | 'failed';
  created_at: string;
  updated_at: string;
};

type AppointmentRow = {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  patients?: { nombre_apellido?: string } | null;
};

type VisitRow = {
  id: string;
  patient_id: string;
  visit_date: string;
  hora_inicio: string;
  hora_fin: string;
  duracion_minutos: number;
  observaciones: string | null;
  pago_realizado: boolean;
  monto_pagado: number | null;
  created_at: string;
  patients?: { nombre_apellido?: string } | null;
};

const PROFILE_ID = 'fernanda-main';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Revisa EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }
  return supabase;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function patientFromRow(row: PatientRow): KinesiologiaPatient {
  return {
    id: row.id,
    nombreApellido: row.nombre_apellido,
    domicilio: row.domicilio,
    motivoConsulta: row.motivo_consulta,
    afeccionPatologia: row.afeccion_patologia,
    tratamientoPropuesto: row.tratamiento_propuesto,
    fechaNacimiento: row.fecha_nacimiento ?? '',
    edadEstimada: row.edad_estimada ?? undefined,
    usaEdadEstimada: row.usa_edad_estimada,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function profileFromRow(row: ProfileRow): ProfessionalProfile {
  return {
    id: row.id,
    nombreCompleto: row.nombre_completo,
    titulo: row.titulo,
    matriculaProfesional: row.matricula_profesional,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function historyFromRow(row: HistoryRow): ClinicalHistoryEntry {
  return {
    id: row.id,
    patientId: row.patient_id,
    fechaTratamiento: row.fecha_tratamiento,
    contenido: row.contenido,
    authorSignatureSnapshot: row.author_signature_snapshot,
    backupStatus: row.backup_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function appointmentFromRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patients?.nombre_apellido,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    notes: row.notes ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function visitFromRow(row: VisitRow): Visit {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patients?.nombre_apellido,
    visitDate: row.visit_date,
    horaInicio: row.hora_inicio,
    horaFin: row.hora_fin,
    duracionMinutos: row.duracion_minutos,
    observaciones: row.observaciones ?? '',
    pagoRealizado: row.pago_realizado,
    montoPagado: row.monto_pagado ?? 0,
    createdAt: row.created_at,
  };
}

export const calculateAge = calculateAgeFromBirthDate;
export const buildProfessionalSignature = formatProfessionalSignature;

export function validatePatientInput(input: PatientInput) {
  const required = [
    input.nombreApellido,
    input.domicilio,
    input.motivoConsulta,
    input.afeccionPatologia,
    input.tratamientoPropuesto,
  ];

  if (required.some((value) => value.trim().length < 2)) {
    return 'Completa nombre, domicilio, motivo, afección y tratamiento propuesto.';
  }

  if (!input.fechaNacimiento.trim() && !input.usaEdadEstimada) {
    return 'Carga fecha de nacimiento o activa edad estimada.';
  }

  if (input.usaEdadEstimada && Number(input.edadEstimada) <= 0) {
    return 'Carga una edad estimada válida.';
  }

  return null;
}

function patientPayload(input: PatientInput) {
  const hasBirthDate = input.fechaNacimiento.trim().length > 0;

  return {
    nombre_apellido: input.nombreApellido.trim(),
    domicilio: input.domicilio.trim(),
    motivo_consulta: input.motivoConsulta.trim(),
    afeccion_patologia: input.afeccionPatologia.trim(),
    tratamiento_propuesto: input.tratamientoPropuesto.trim(),
    fecha_nacimiento: hasBirthDate ? input.fechaNacimiento.trim() : null,
    edad_estimada: hasBirthDate ? null : Number(input.edadEstimada),
    usa_edad_estimada: !hasBirthDate && input.usaEdadEstimada,
    updated_at: nowIso(),
  };
}

export async function listPatients() {
  const client = requireSupabase();
  const { data, error } = await client.from('patients').select('*').order('nombre_apellido', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => patientFromRow(row as PatientRow));
}

export async function savePatient(input: PatientInput, patientId?: string) {
  const client = requireSupabase();
  const validation = validatePatientInput(input);
  if (validation) throw new Error(validation);

  if (patientId) {
    const { error } = await client.from('patients').update(patientPayload(input)).eq('id', patientId);
    if (error) throw new Error(error.message);
    return;
  }

  const timestamp = nowIso();
  const { error } = await client.from('patients').insert({
    id: createId('patient'),
    ...patientPayload(input),
    created_at: timestamp,
    updated_at: timestamp,
  });
  if (error) throw new Error(error.message);
}

export async function getProfessionalProfile() {
  const client = requireSupabase();
  const { data, error } = await client.from('professional_profiles').select('*').eq('id', PROFILE_ID).maybeSingle();
  if (error) throw new Error(error.message);

  if (data) return profileFromRow(data as ProfileRow);

  const timestamp = nowIso();
  return profileFromRow({
    id: PROFILE_ID,
    nombre_completo: 'Fernanda Canavidez',
    titulo: 'Lic.',
    matricula_profesional: '',
    created_at: timestamp,
    updated_at: timestamp,
  });
}

export async function saveProfessionalProfile(input: {
  nombreCompleto: string;
  titulo: string;
  matriculaProfesional: string;
}) {
  const client = requireSupabase();
  const timestamp = nowIso();
  const { error } = await client.from('professional_profiles').upsert({
    id: PROFILE_ID,
    nombre_completo: input.nombreCompleto.trim(),
    titulo: input.titulo.trim(),
    matricula_profesional: input.matriculaProfesional.trim(),
    updated_at: timestamp,
  });
  if (error) throw new Error(error.message);
}

export async function listClinicalHistoryEntries(patientId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('clinical_history_entries')
    .select('*')
    .eq('patient_id', patientId)
    .order('fecha_tratamiento', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => historyFromRow(row as HistoryRow));
}

export async function saveClinicalHistoryEntry(input: {
  patientId: string;
  fechaTratamiento: string;
  contenido: string;
  entryId?: string;
}) {
  const client = requireSupabase();
  if (!input.fechaTratamiento || input.contenido.trim().length < 2) {
    throw new Error('Completa fecha de tratamiento y contenido clínico.');
  }

  if (input.entryId) {
    const { error } = await client
      .from('clinical_history_entries')
      .update({
        fecha_tratamiento: input.fechaTratamiento,
        contenido: input.contenido.trim(),
        backup_status: 'pending',
        updated_at: nowIso(),
      })
      .eq('id', input.entryId);
    if (error) throw new Error(error.message);
    return;
  }

  const profile = await getProfessionalProfile();
  const timestamp = nowIso();
  const { error } = await client.from('clinical_history_entries').insert({
    id: createId('history'),
    patient_id: input.patientId,
    fecha_tratamiento: input.fechaTratamiento,
    contenido: input.contenido.trim(),
    author_signature_snapshot: buildProfessionalSignature(profile),
    backup_status: 'pending',
    created_at: timestamp,
    updated_at: timestamp,
  });
  if (error) throw new Error(error.message);
}

export async function listAppointments(patientId?: string) {
  const client = requireSupabase();
  let query = client
    .from('appointments')
    .select('*, patients(nombre_apellido)')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });
  if (patientId) query = query.eq('patient_id', patientId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => appointmentFromRow(row as AppointmentRow));
}

export async function saveAppointment(input: {
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: AppointmentStatus;
}) {
  const client = requireSupabase();
  if (!input.appointmentDate || !input.appointmentTime) throw new Error('Completa fecha y horario.');
  const timestamp = nowIso();
  const { error } = await client.from('appointments').insert({
    id: createId('appointment'),
    patient_id: input.patientId,
    appointment_date: input.appointmentDate,
    appointment_time: input.appointmentTime,
    notes: input.notes.trim(),
    status: input.status,
    created_at: timestamp,
    updated_at: timestamp,
  });
  if (error) throw new Error(error.message);
}

export async function listVisits(patientId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('visits')
    .select('*, patients(nombre_apellido)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => visitFromRow(row as VisitRow));
}

export async function saveVisit(input: {
  patient: KinesiologiaPatient;
  visitDate: string;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
  observaciones: string;
  pagoRealizado: boolean;
  montoPagado: number;
  paymentMethod?: PaymentMethod;
}) {
  const client = requireSupabase();
  const timestamp = nowIso();
  const visitId = createId('visit');
  const { error } = await client.from('visits').insert({
    id: visitId,
    patient_id: input.patient.id,
    visit_date: input.visitDate,
    hora_inicio: input.horaInicio,
    hora_fin: input.horaFin,
    duracion_minutos: input.duracionMinutos,
    observaciones: input.observaciones.trim(),
    pago_realizado: input.pagoRealizado,
    monto_pagado: input.pagoRealizado ? input.montoPagado : 0,
    created_at: timestamp,
  });
  if (error) throw new Error(error.message);

  if (input.pagoRealizado && input.montoPagado > 0) {
    await createFinancialMovement({
      moduleType: 'kinesiologia',
      sourceType: 'visit',
      sourceId: visitId,
      personId: input.patient.id,
      amount: input.montoPagado,
      movementType: 'income',
      paymentStatus: 'paid',
      paymentMethod: input.paymentMethod ?? 'efectivo',
      description: `Pago sesión - ${input.patient.nombreApellido}`,
      movementDate: input.visitDate,
    });
  }
}
