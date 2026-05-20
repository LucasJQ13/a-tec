import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';
import {
  buildProfessionalSignature,
  calculateAge,
  getProfessionalProfile,
  listAppointments,
  listClinicalHistoryEntries,
  listPatients,
  listVisits,
  saveAppointment,
  saveClinicalHistoryEntry,
  savePatient,
  saveProfessionalProfile,
  saveVisit,
} from '../../shared/services/kinesiologiaService';
import type {
  Appointment,
  AppointmentStatus,
  ClinicalHistoryEntry,
  KinesiologiaPatient,
  PatientInput,
  ProfessionalProfile,
  Visit,
} from '../../shared/types/kinesiologia';

type WorkspaceMode = 'patients' | 'history' | 'dates' | 'profile';

type Props = {
  mode: WorkspaceMode;
};

const emptyPatient: PatientInput = {
  nombreApellido: '',
  domicilio: '',
  motivoConsulta: '',
  afeccionPatologia: '',
  tratamientoPropuesto: '',
  fechaNacimiento: '',
  edadEstimada: '',
  usaEdadEstimada: false,
};

const appointmentStatuses: AppointmentStatus[] = ['programada', 'realizada', 'cancelada', 'reprogramada'];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function minutesBetween(start: string, end: string) {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute));
}

function inputFromPatient(patient: KinesiologiaPatient): PatientInput {
  return {
    nombreApellido: patient.nombreApellido,
    domicilio: patient.domicilio,
    motivoConsulta: patient.motivoConsulta,
    afeccionPatologia: patient.afeccionPatologia,
    tratamientoPropuesto: patient.tratamientoPropuesto,
    fechaNacimiento: patient.fechaNacimiento ?? '',
    edadEstimada: patient.edadEstimada ? String(patient.edadEstimada) : '',
    usaEdadEstimada: patient.usaEdadEstimada,
  };
}

export function KinesiologiaCareWorkspace({ mode }: Props) {
  const [patients, setPatients] = useState<KinesiologiaPatient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [historyEntries, setHistoryEntries] = useState<ClinicalHistoryEntry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<KinesiologiaPatient | null>(null);
  const [query, setQuery] = useState('');
  const [patientForm, setPatientForm] = useState<PatientInput>(emptyPatient);
  const [editingPatientId, setEditingPatientId] = useState<string | undefined>();
  const [historyForm, setHistoryForm] = useState({ id: '', fecha: todayDate(), contenido: '' });
  const [appointmentForm, setAppointmentForm] = useState({
    date: todayDate(),
    time: currentTime(),
    notes: '',
    status: 'programada' as AppointmentStatus,
  });
  const [visitForm, setVisitForm] = useState({
    active: false,
    visitDate: todayDate(),
    start: currentTime(),
    end: '',
    observaciones: '',
    pagoRealizado: false,
    montoPagado: '',
  });
  const [profileForm, setProfileForm] = useState({
    nombreCompleto: 'Fernanda Canavidez',
    titulo: 'Lic.',
    matriculaProfesional: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBaseData = useCallback(async () => {
    try {
      setError(null);
      const [loadedPatients, loadedAppointments, loadedProfile] = await Promise.all([
        listPatients(),
        listAppointments(),
        getProfessionalProfile(),
      ]);
      setPatients(loadedPatients);
      setAppointments(loadedAppointments);
      setProfile(loadedProfile);
      setProfileForm({
        nombreCompleto: loadedProfile.nombreCompleto,
        titulo: loadedProfile.titulo,
        matriculaProfesional: loadedProfile.matriculaProfesional,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los datos clinicos.');
    }
  }, []);

  const loadPatientDetails = useCallback(async (patient: KinesiologiaPatient | null) => {
    if (!patient) {
      setHistoryEntries([]);
      setVisits([]);
      return;
    }

    try {
      const [loadedHistory, loadedVisits] = await Promise.all([
        listClinicalHistoryEntries(patient.id),
        listVisits(patient.id),
      ]);
      setHistoryEntries(loadedHistory);
      setVisits(loadedVisits);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la ficha del paciente.');
    }
  }, []);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    loadPatientDetails(selectedPatient);
  }, [loadPatientDetails, selectedPatient]);

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return patients;
    return patients.filter((patient) => patient.nombreApellido.toLowerCase().includes(normalized));
  }, [patients, query]);

  const selectedAppointments = useMemo(() => {
    if (!selectedPatient) return appointments;
    return appointments.filter((appointment) => appointment.patientId === selectedPatient.id);
  }, [appointments, selectedPatient]);

  const beginCreatePatient = () => {
    setEditingPatientId(undefined);
    setPatientForm(emptyPatient);
  };

  const selectPatient = (patient: KinesiologiaPatient) => {
    setSelectedPatient(patient);
    setEditingPatientId(patient.id);
    setPatientForm(inputFromPatient(patient));
    setHistoryForm({ id: '', fecha: todayDate(), contenido: '' });
    setVisitForm({
      active: false,
      visitDate: todayDate(),
      start: currentTime(),
      end: '',
      observaciones: '',
      pagoRealizado: false,
      montoPagado: '',
    });
  };

  const persistPatient = async () => {
    setSaving(true);
    try {
      await savePatient(patientForm, editingPatientId);
      await loadBaseData();
      beginCreatePatient();
      Alert.alert('Paciente guardado', 'La ficha quedo sincronizada en Supabase.');
    } catch (saveError) {
      Alert.alert('No se pudo guardar', saveError instanceof Error ? saveError.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  const persistHistory = async () => {
    if (!selectedPatient) return;
    setSaving(true);
    try {
      await saveClinicalHistoryEntry({
        patientId: selectedPatient.id,
        fechaTratamiento: historyForm.fecha,
        contenido: historyForm.contenido,
        entryId: historyForm.id || undefined,
      });
      setHistoryForm({ id: '', fecha: todayDate(), contenido: '' });
      await loadPatientDetails(selectedPatient);
      Alert.alert('Historia guardada', 'La entrada clinica quedo vinculada al paciente.');
    } catch (saveError) {
      Alert.alert('No se pudo guardar', saveError instanceof Error ? saveError.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  const persistAppointment = async () => {
    if (!selectedPatient) return;
    setSaving(true);
    try {
      await saveAppointment({
        patientId: selectedPatient.id,
        appointmentDate: appointmentForm.date,
        appointmentTime: appointmentForm.time,
        notes: appointmentForm.notes,
        status: appointmentForm.status,
      });
      setAppointmentForm({ date: todayDate(), time: currentTime(), notes: '', status: 'programada' });
      await loadBaseData();
      Alert.alert('Agenda actualizada', 'La visita programada ya aparece en Fechas.');
    } catch (saveError) {
      Alert.alert('No se pudo agendar', saveError instanceof Error ? saveError.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  const startVisit = () => {
    setVisitForm((current) => ({
      ...current,
      active: true,
      visitDate: todayDate(),
      start: currentTime(),
      end: '',
    }));
  };

  const finishVisit = async () => {
    if (!selectedPatient) return;
    const end = currentTime();
    const duration = minutesBetween(visitForm.start, end);
    setSaving(true);
    try {
      await saveVisit({
        patient: selectedPatient,
        visitDate: visitForm.visitDate,
        horaInicio: visitForm.start,
        horaFin: end,
        duracionMinutos: duration,
        observaciones: visitForm.observaciones,
        pagoRealizado: visitForm.pagoRealizado,
        montoPagado: Number(visitForm.montoPagado || 0),
      });
      setVisitForm({
        active: false,
        visitDate: todayDate(),
        start: currentTime(),
        end: '',
        observaciones: '',
        pagoRealizado: false,
        montoPagado: '',
      });
      await loadPatientDetails(selectedPatient);
      Alert.alert('Visita finalizada', `Duracion calculada: ${duration} minutos.`);
    } catch (saveError) {
      Alert.alert('No se pudo cerrar la visita', saveError instanceof Error ? saveError.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  const persistProfile = async () => {
    setSaving(true);
    try {
      await saveProfessionalProfile(profileForm);
      await loadBaseData();
      Alert.alert('Perfil guardado', 'La firma profesional se usara en nuevas historias clinicas.');
    } catch (saveError) {
      Alert.alert('No se pudo guardar perfil', saveError instanceof Error ? saveError.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'profile') {
    return (
      <View style={styles.wrapper}>
        <SectionHeader title="Perfil profesional" meta="Firma clinica" />
        <Field label="Titulo" value={profileForm.titulo} onChangeText={(titulo) => setProfileForm((current) => ({ ...current, titulo }))} />
        <Field
          label="Nombre completo"
          value={profileForm.nombreCompleto}
          onChangeText={(nombreCompleto) => setProfileForm((current) => ({ ...current, nombreCompleto }))}
        />
        <Field
          label="Matricula profesional M.P."
          value={profileForm.matriculaProfesional}
          onChangeText={(matriculaProfesional) => setProfileForm((current) => ({ ...current, matriculaProfesional }))}
        />
        <View style={styles.signatureCard}>
          <Text style={styles.signatureLabel}>Firma generada</Text>
          <Text style={styles.signatureText}>{buildProfessionalSignature(profileForm)}</Text>
        </View>
        <PrimaryButton label={saving ? 'Guardando' : 'Guardar perfil'} onPress={persistProfile} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Revision necesaria</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <SectionHeader
        title={mode === 'history' ? 'Historias clinicas' : mode === 'dates' ? 'Fechas y agenda' : 'Pacientes'}
        meta={mode === 'patients' ? 'Ficha clinica' : 'Supabase'}
      />

      <PatientPicker
        patients={filteredPatients}
        query={query}
        selectedPatient={selectedPatient}
        setQuery={setQuery}
        onSelect={selectPatient}
      />

      {mode === 'patients' ? (
        <PatientForm
          form={patientForm}
          onChange={setPatientForm}
          onNew={beginCreatePatient}
          onSave={persistPatient}
          saving={saving}
          selectedPatient={selectedPatient}
        />
      ) : null}

      {selectedPatient ? (
        <View style={styles.patientPanel}>
          <Text style={styles.panelTitle}>{selectedPatient.nombreApellido}</Text>
          <Text style={styles.panelMeta}>
            Edad: {selectedPatient.fechaNacimiento ? calculateAge(selectedPatient.fechaNacimiento) : selectedPatient.edadEstimada} anos
          </Text>
          <Text style={styles.panelText}>{selectedPatient.motivoConsulta}</Text>

          {(mode === 'patients' || mode === 'history') ? (
            <HistoryPanel
              entries={historyEntries}
              form={historyForm}
              onChange={setHistoryForm}
              onEdit={(entry) =>
                setHistoryForm({ id: entry.id, fecha: entry.fechaTratamiento, contenido: entry.contenido })
              }
              onSave={persistHistory}
              saving={saving}
            />
          ) : null}

          {(mode === 'patients' || mode === 'dates') ? (
            <AppointmentPanel
              appointments={selectedAppointments}
              form={appointmentForm}
              onChange={setAppointmentForm}
              onSave={persistAppointment}
              saving={saving}
            />
          ) : null}

          {mode === 'patients' ? (
            <VisitPanel
              form={visitForm}
              visits={visits}
              onChange={setVisitForm}
              onFinish={finishVisit}
              onStart={startVisit}
              saving={saving}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Selecciona un paciente</Text>
          <Text style={styles.emptyText}>Desde aca se accede a historia clinica, agenda y visitas.</Text>
        </View>
      )}
    </View>
  );
}

function SectionHeader({ meta, title }: { meta: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{meta}</Text>
    </View>
  );
}

function PatientPicker({
  onSelect,
  patients,
  query,
  selectedPatient,
  setQuery,
}: {
  onSelect: (patient: KinesiologiaPatient) => void;
  patients: KinesiologiaPatient[];
  query: string;
  selectedPatient: KinesiologiaPatient | null;
  setQuery: (value: string) => void;
}) {
  return (
    <View>
      <Field label="Buscar paciente" value={query} onChangeText={setQuery} />
      <View style={styles.patientRail}>
        {patients.map((patient) => {
          const active = selectedPatient?.id === patient.id;
          return (
            <TouchableOpacity
              key={patient.id}
              activeOpacity={0.84}
              onPress={() => onSelect(patient)}
              style={[styles.patientChip, active ? styles.activePatientChip : null]}
            >
              <Text style={[styles.patientChipText, active ? styles.activePatientChipText : null]} numberOfLines={1}>
                {patient.nombreApellido}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function PatientForm({
  form,
  onChange,
  onNew,
  onSave,
  saving,
  selectedPatient,
}: {
  form: PatientInput;
  onChange: (form: PatientInput) => void;
  onNew: () => void;
  onSave: () => void;
  saving: boolean;
  selectedPatient: KinesiologiaPatient | null;
}) {
  const automaticAge = calculateAge(form.fechaNacimiento);

  return (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{selectedPatient ? 'Editar paciente' : 'Nuevo paciente'}</Text>
        <TouchableOpacity activeOpacity={0.82} onPress={onNew} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>
      <Field label="Nombre y apellido" value={form.nombreApellido} onChangeText={(nombreApellido) => onChange({ ...form, nombreApellido })} />
      <Field label="Domicilio" value={form.domicilio} onChangeText={(domicilio) => onChange({ ...form, domicilio })} />
      <Field
        label="Motivo de consulta"
        value={form.motivoConsulta}
        onChangeText={(motivoConsulta) => onChange({ ...form, motivoConsulta })}
        multiline
      />
      <Field
        label="Afeccion / patologia"
        value={form.afeccionPatologia}
        onChangeText={(afeccionPatologia) => onChange({ ...form, afeccionPatologia })}
        multiline
      />
      <Field
        label="Tratamiento propuesto"
        value={form.tratamientoPropuesto}
        onChangeText={(tratamientoPropuesto) => onChange({ ...form, tratamientoPropuesto })}
        multiline
      />
      <Field
        label="Fecha nacimiento YYYY-MM-DD"
        value={form.fechaNacimiento}
        onChangeText={(fechaNacimiento) => onChange({ ...form, fechaNacimiento, usaEdadEstimada: false })}
      />
      {automaticAge !== null ? <Text style={styles.helperText}>Edad calculada automaticamente: {automaticAge} anos</Text> : null}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => onChange({ ...form, usaEdadEstimada: !form.usaEdadEstimada, fechaNacimiento: '' })}
        style={[styles.toggleRow, form.usaEdadEstimada ? styles.activeToggle : null]}
      >
        <Text style={[styles.toggleText, form.usaEdadEstimada ? styles.activeToggleText : null]}>Usar edad estimada</Text>
      </TouchableOpacity>
      {form.usaEdadEstimada ? (
        <Field label="Edad estimada" value={form.edadEstimada} onChangeText={(edadEstimada) => onChange({ ...form, edadEstimada })} />
      ) : null}
      <PrimaryButton label={saving ? 'Guardando' : 'Guardar paciente'} onPress={onSave} />
    </View>
  );
}

function HistoryPanel({
  entries,
  form,
  onChange,
  onEdit,
  onSave,
  saving,
}: {
  entries: ClinicalHistoryEntry[];
  form: { id: string; fecha: string; contenido: string };
  onChange: (form: { id: string; fecha: string; contenido: string }) => void;
  onEdit: (entry: ClinicalHistoryEntry) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <View style={styles.subPanel}>
      <Text style={styles.subTitle}>Historia clinica</Text>
      <Field label="Fecha tratamiento" value={form.fecha} onChangeText={(fecha) => onChange({ ...form, fecha })} />
      <Field label="Contenido libre" value={form.contenido} onChangeText={(contenido) => onChange({ ...form, contenido })} multiline tall />
      <PrimaryButton label={saving ? 'Guardando' : form.id ? 'Actualizar entrada' : 'Guardar entrada'} onPress={onSave} />
      {entries.map((entry) => (
        <TouchableOpacity key={entry.id} activeOpacity={0.84} onPress={() => onEdit(entry)} style={styles.recordCard}>
          <Text style={styles.recordDate}>{entry.fechaTratamiento}</Text>
          <Text style={styles.recordText} numberOfLines={4}>{entry.contenido}</Text>
          <Text style={styles.signatureText}>{entry.authorSignatureSnapshot}</Text>
          <Text style={styles.backupText}>Backup: {entry.backupStatus}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AppointmentPanel({
  appointments,
  form,
  onChange,
  onSave,
  saving,
}: {
  appointments: Appointment[];
  form: { date: string; time: string; notes: string; status: AppointmentStatus };
  onChange: (form: { date: string; time: string; notes: string; status: AppointmentStatus }) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <View style={styles.subPanel}>
      <Text style={styles.subTitle}>Agenda</Text>
      <View style={styles.twoColumns}>
        <View style={styles.column}>
          <Field label="Fecha" value={form.date} onChangeText={(date) => onChange({ ...form, date })} />
        </View>
        <View style={styles.column}>
          <Field label="Hora" value={form.time} onChangeText={(time) => onChange({ ...form, time })} />
        </View>
      </View>
      <Field label="Notas" value={form.notes} onChangeText={(notes) => onChange({ ...form, notes })} multiline />
      <View style={styles.statusWrap}>
        {appointmentStatuses.map((status) => (
          <TouchableOpacity
            key={status}
            activeOpacity={0.82}
            onPress={() => onChange({ ...form, status })}
            style={[styles.statusPill, form.status === status ? styles.activeStatus : null]}
          >
            <Text style={[styles.statusText, form.status === status ? styles.activeStatusText : null]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <PrimaryButton label={saving ? 'Guardando' : 'Agendar visita'} onPress={onSave} />
      {appointments.map((appointment) => (
        <View key={appointment.id} style={styles.recordCard}>
          <Text style={styles.recordDate}>{appointment.appointmentDate} - {appointment.appointmentTime}</Text>
          <Text style={styles.recordText}>{appointment.patientName ?? 'Paciente'} | {appointment.status}</Text>
          <Text style={styles.recordText}>{appointment.notes || 'Sin notas'}</Text>
        </View>
      ))}
    </View>
  );
}

function VisitPanel({
  form,
  onChange,
  onFinish,
  onStart,
  saving,
  visits,
}: {
  form: {
    active: boolean;
    visitDate: string;
    start: string;
    end: string;
    observaciones: string;
    pagoRealizado: boolean;
    montoPagado: string;
  };
  onChange: (form: {
    active: boolean;
    visitDate: string;
    start: string;
    end: string;
    observaciones: string;
    pagoRealizado: boolean;
    montoPagado: string;
  }) => void;
  onFinish: () => void;
  onStart: () => void;
  saving: boolean;
  visits: Visit[];
}) {
  return (
    <View style={styles.subPanel}>
      <Text style={styles.subTitle}>Cargar visita</Text>
      {!form.active ? (
        <PrimaryButton label="Iniciar visita" onPress={onStart} />
      ) : (
        <>
          <Text style={styles.helperText}>Inicio automatico: {form.visitDate} {form.start}</Text>
          <Field label="Observaciones" value={form.observaciones} onChangeText={(observaciones) => onChange({ ...form, observaciones })} multiline />
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => onChange({ ...form, pagoRealizado: !form.pagoRealizado })}
            style={[styles.toggleRow, form.pagoRealizado ? styles.activeToggle : null]}
          >
            <Text style={[styles.toggleText, form.pagoRealizado ? styles.activeToggleText : null]}>Pago realizado</Text>
          </TouchableOpacity>
          {form.pagoRealizado ? (
            <Field label="Monto pagado" value={form.montoPagado} onChangeText={(montoPagado) => onChange({ ...form, montoPagado })} />
          ) : null}
          <PrimaryButton label={saving ? 'Guardando' : 'Finalizar visita'} onPress={onFinish} />
        </>
      )}
      {visits.map((visit) => (
        <View key={visit.id} style={styles.recordCard}>
          <Text style={styles.recordDate}>{visit.visitDate} | {visit.horaInicio} - {visit.horaFin}</Text>
          <Text style={styles.recordText}>Duracion: {visit.duracionMinutos} minutos</Text>
          <Text style={styles.recordText}>{visit.observaciones || 'Sin observaciones'}</Text>
          {visit.pagoRealizado ? <Text style={styles.backupText}>Pago: ${visit.montoPagado}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function Field({
  label,
  multiline,
  onChangeText,
  tall,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  tall?: boolean;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={healthColors.olive}
        style={[styles.input, multiline ? styles.multiline : null, tall ? styles.tallInput : null]}
        value={value}
      />
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: healthColors.night,
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  sectionMeta: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  errorBox: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.burgundy,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  errorTitle: {
    color: healthColors.burgundy,
    fontSize: 14,
    fontWeight: '900',
  },
  errorText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  field: {
    marginTop: 8,
  },
  fieldLabel: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
  },
  input: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 12,
    borderWidth: 1,
    color: healthColors.night,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  multiline: {
    minHeight: 84,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  tallInput: {
    minHeight: 150,
  },
  patientRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  patientChip: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  activePatientChip: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.night,
  },
  patientChipText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
  },
  activePatientChipText: {
    color: healthColors.cream,
  },
  formCard: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.creamDeep,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  formHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formTitle: {
    color: healthColors.night,
    fontSize: 17,
    fontWeight: '900',
  },
  smallButton: {
    borderColor: healthColors.night,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: healthColors.night,
    fontSize: 11,
    fontWeight: '900',
  },
  helperText: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 8,
  },
  toggleRow: {
    borderColor: healthColors.creamDeep,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
  },
  activeToggle: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.night,
  },
  toggleText: {
    color: healthColors.night,
    fontSize: 13,
    fontWeight: '900',
  },
  activeToggleText: {
    color: healthColors.cream,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '900',
  },
  patientPanel: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  panelTitle: {
    color: healthColors.night,
    fontSize: 20,
    fontWeight: '900',
  },
  panelMeta: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  panelText: {
    color: healthColors.night,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
  },
  subPanel: {
    borderTopColor: healthColors.creamDeep,
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 14,
  },
  subTitle: {
    color: healthColors.night,
    fontSize: 16,
    fontWeight: '900',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  statusPill: {
    borderColor: healthColors.night,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  activeStatus: {
    backgroundColor: healthColors.night,
  },
  statusText: {
    color: healthColors.night,
    fontSize: 11,
    fontWeight: '900',
  },
  activeStatusText: {
    color: healthColors.cream,
  },
  recordCard: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.creamDeep,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
  },
  recordDate: {
    color: healthColors.burgundy,
    fontSize: 12,
    fontWeight: '900',
  },
  recordText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  signatureCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  signatureLabel: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  signatureText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: 8,
  },
  backupText: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8,
  },
  emptyCard: {
    borderColor: healthColors.creamDeep,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 16,
  },
  emptyTitle: {
    color: healthColors.night,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: healthColors.olive,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 5,
  },
});
