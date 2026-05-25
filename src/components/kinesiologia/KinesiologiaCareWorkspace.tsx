import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';
import { getMovementsByPerson } from '../../shared/services/financeService';
import {
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
import type { FinancialMovement, PaymentMethod } from '../../shared/types/finance';
import { useToast } from '../../shared/components/ToastProvider';
import {
  formatCurrencyARS,
  formatDateAR,
  formatDateTimeAR,
  formatProfessionalSignature,
  normalizeForSearch,
} from '../../shared/utils/formatters';

type WorkspaceMode = 'patients' | 'history' | 'dates' | 'profile';
type FlowScreen = 'list' | 'detail' | 'editPatient' | 'history' | 'historyForm' | 'appointment' | 'visit';

type Props = {
  mode: WorkspaceMode;
  onFullScreenChange?: (active: boolean) => void;
};

type HistoryForm = {
  id?: string;
  fechaTratamiento: string;
  contenido: string;
};

type AppointmentForm = {
  date: string;
  hour: string;
  minute: string;
  notes: string;
  status: AppointmentStatus;
};

type VisitForm = {
  active: boolean;
  appointmentId?: string;
  visitDate: string;
  start: string;
  observaciones: string;
  pagoRealizado: boolean;
  montoPagado: string;
  paymentMethod: PaymentMethod;
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

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0'));
const paymentMethods: PaymentMethod[] = ['efectivo', 'transferencia', 'mercado_pago', 'tarjeta', 'otro'];

function todayIso() {
  const date = new Date();
  return toIsoDate(date);
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isoToDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
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

function appointmentFormFromNow(): AppointmentForm {
  const [hour, minute] = currentTime().split(':');
  return { date: todayIso(), hour, minute, notes: '', status: 'programada' };
}

function visitFormFromNow(): VisitForm {
  return {
    active: false,
    visitDate: todayIso(),
    start: currentTime(),
    observaciones: '',
    pagoRealizado: false,
    montoPagado: '',
    paymentMethod: 'efectivo',
  };
}

export function KinesiologiaCareWorkspace({ mode, onFullScreenChange }: Props) {
  const { width } = useWindowDimensions();
  const { showToast } = useToast();
  const compact = width < 380;
  const [flow, setFlow] = useState<FlowScreen>('list');
  const [patients, setPatients] = useState<KinesiologiaPatient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [historyEntries, setHistoryEntries] = useState<ClinicalHistoryEntry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [financialMovements, setFinancialMovements] = useState<FinancialMovement[]>([]);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<KinesiologiaPatient | null>(null);
  const [query, setQuery] = useState('');
  const [patientForm, setPatientForm] = useState<PatientInput>(emptyPatient);
  const [editingPatientId, setEditingPatientId] = useState<string | undefined>();
  const [historyForm, setHistoryForm] = useState<HistoryForm>({ fechaTratamiento: todayIso(), contenido: '' });
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>(appointmentFormFromNow());
  const [visitForm, setVisitForm] = useState<VisitForm>(visitFormFromNow());
  const [profileForm, setProfileForm] = useState({
    nombreCompleto: 'Fernanda Canavidez',
    titulo: 'Lic.',
    matriculaProfesional: '',
    especialidad: '',
    horariosAtencion: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBaseData = useCallback(async () => {
    try {
      setError(null);
      const [loadedPatients, loadedAppointments] = await Promise.all([listPatients(), listAppointments()]);
      setPatients(loadedPatients);
      setAppointments(loadedAppointments);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los datos clínicos.');
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const loadedProfile = await getProfessionalProfile();
      setProfile(loadedProfile);
      setProfileForm({
        nombreCompleto: loadedProfile.nombreCompleto,
        titulo: loadedProfile.titulo,
        matriculaProfesional: loadedProfile.matriculaProfesional,
        especialidad: loadedProfile.especialidad ?? '',
        horariosAtencion: loadedProfile.horariosAtencion ?? '',
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el perfil profesional.');
    }
  }, []);

  const loadPatientDetails = useCallback(async (patient: KinesiologiaPatient | null) => {
    if (!patient) {
      setHistoryEntries([]);
      setVisits([]);
      setFinancialMovements([]);
      return;
    }

    try {
      const [loadedHistory, loadedVisits, loadedMovements] = await Promise.all([
        listClinicalHistoryEntries(patient.id),
        listVisits(patient.id),
        getMovementsByPerson(patient.id),
      ]);
      setHistoryEntries(loadedHistory);
      setVisits(loadedVisits);
      setFinancialMovements(loadedMovements);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la ficha del paciente.');
    }
  }, []);

  useEffect(() => {
    setFlow('list');
    setSelectedPatient(null);
    setQuery('');
  }, [mode]);

  useEffect(() => {
    onFullScreenChange?.(flow !== 'list' && mode !== 'profile');
  }, [flow, mode, onFullScreenChange]);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadPatientDetails(selectedPatient);
  }, [loadPatientDetails, selectedPatient]);

  const goBack = useCallback(() => {
    if (flow === 'detail' || flow === 'editPatient') {
      setFlow('list');
      if (flow === 'editPatient') setEditingPatientId(undefined);
      return true;
    }
    if (flow === 'history' || flow === 'appointment' || flow === 'visit') {
      setFlow(mode === 'patients' ? 'detail' : 'list');
      return true;
    }
    if (flow === 'historyForm') {
      setFlow('history');
      return true;
    }
    return false;
  }, [flow, mode]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => goBack());
    return () => subscription.remove();
  }, [goBack]);

  const filteredPatients = useMemo(() => {
    const normalized = normalizeForSearch(query);
    if (!normalized) return patients;
    return patients.filter((patient) => normalizeForSearch(patient.nombreApellido).includes(normalized));
  }, [patients, query]);

  const selectedAppointments = useMemo(() => {
    if (!selectedPatient) return [];
    return appointments.filter((appointment) => appointment.patientId === selectedPatient.id);
  }, [appointments, selectedPatient]);

  const upcomingAppointments = useMemo(
    () => selectedAppointments.filter((appointment) => appointment.status === 'programada').slice(0, 3),
    [selectedAppointments]
  );

  const beginCreatePatient = () => {
    setEditingPatientId(undefined);
    setSelectedPatient(null);
    setPatientForm(emptyPatient);
    setFlow('editPatient');
  };

  const beginEditPatient = (patient: KinesiologiaPatient) => {
    setSelectedPatient(patient);
    setEditingPatientId(patient.id);
    setPatientForm(inputFromPatient(patient));
    setFlow('editPatient');
  };

  const openPatient = (patient: KinesiologiaPatient) => {
    setSelectedPatient(patient);
    setFlow(mode === 'history' ? 'history' : mode === 'dates' ? 'appointment' : 'detail');
  };

  const openHistoryForm = (entry?: ClinicalHistoryEntry) => {
    setHistoryForm(
      entry
        ? { id: entry.id, fechaTratamiento: entry.fechaTratamiento, contenido: entry.contenido }
        : { fechaTratamiento: todayIso(), contenido: '' }
    );
    setFlow('historyForm');
  };

  const openAppointmentForm = () => {
    setAppointmentForm(appointmentFormFromNow());
    setFlow('appointment');
  };

  const openVisitForm = () => {
    const nextAppointment = upcomingAppointments[0];
    setVisitForm({
      ...visitFormFromNow(),
      appointmentId: nextAppointment?.id,
      start: nextAppointment?.appointmentTime ?? currentTime(),
      visitDate: nextAppointment?.appointmentDate ?? todayIso(),
    });
    setFlow('visit');
  };

  const persistPatient = async () => {
    const wasEditing = Boolean(editingPatientId);
    setSaving(true);
    try {
      await savePatient(patientForm, editingPatientId);
      await loadBaseData();
      const savedName = patientForm.nombreApellido;
      setPatientForm(emptyPatient);
      setEditingPatientId(undefined);
      showToast(wasEditing ? 'Paciente actualizado' : 'Paciente guardado', 'success');
      if (wasEditing && selectedPatient) {
        setSelectedPatient({
          ...selectedPatient,
          nombreApellido: patientForm.nombreApellido,
          domicilio: patientForm.domicilio,
          motivoConsulta: patientForm.motivoConsulta,
          afeccionPatologia: patientForm.afeccionPatologia,
          tratamientoPropuesto: patientForm.tratamientoPropuesto,
          fechaNacimiento: patientForm.fechaNacimiento,
          edadEstimada: patientForm.edadEstimada ? Number(patientForm.edadEstimada) : undefined,
          usaEdadEstimada: patientForm.usaEdadEstimada,
          updatedAt: new Date().toISOString(),
        });
        setFlow('detail');
      } else {
        const created = patients.find((patient) => patient.nombreApellido === savedName);
        if (created) setSelectedPatient(created);
        setFlow('list');
      }
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Error al guardar paciente', 'error');
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
        fechaTratamiento: historyForm.fechaTratamiento,
        contenido: historyForm.contenido,
        entryId: historyForm.id,
      });
      await loadPatientDetails(selectedPatient);
      showToast(historyForm.id ? 'Historia clínica actualizada' : 'Historia clínica guardada', 'success');
      setHistoryForm({ fechaTratamiento: todayIso(), contenido: '' });
      setFlow('history');
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Error al guardar historia clínica', 'error');
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
        appointmentTime: `${appointmentForm.hour}:${appointmentForm.minute}`,
        notes: appointmentForm.notes,
        status: appointmentForm.status,
      });
      await loadBaseData();
      showToast('Visita agendada', 'success');
      setFlow(mode === 'patients' ? 'detail' : 'list');
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Error al agendar visita', 'error');
    } finally {
      setSaving(false);
    }
  };

  const startVisit = () => {
    setVisitForm((current) => ({ ...current, active: true, start: current.start || currentTime() }));
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
        paymentMethod: visitForm.paymentMethod,
        appointmentId: visitForm.appointmentId,
      });
      await loadBaseData();
      await loadPatientDetails(selectedPatient);
      showToast(visitForm.pagoRealizado ? 'Sesión finalizada y cobro realizado' : 'Sesión finalizada', 'success');
      setVisitForm(visitFormFromNow());
      setFlow('detail');
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Error al registrar visita', 'error');
    } finally {
      setSaving(false);
    }
  };

  const persistProfile = async () => {
    setSaving(true);
    try {
      await saveProfessionalProfile(profileForm);
      await loadProfile();
      showToast('Cambios realizados', 'success');
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Error al guardar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'profile') {
    return (
      <View style={styles.wrapper}>
        <WorkspaceError message={error} />
        <ProfileEditor form={profileForm} onChange={setProfileForm} onSave={persistProfile} saving={saving} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <WorkspaceError message={error} />

      {flow === 'list' ? (
        <PatientList
          mode={mode}
          patients={filteredPatients}
          query={query}
          compact={compact}
          onCreate={mode === 'patients' ? beginCreatePatient : undefined}
          onOpenPatient={openPatient}
          onQuery={setQuery}
        />
      ) : null}

      {flow === 'detail' && selectedPatient ? (
        <PatientDetail
          appointments={upcomingAppointments}
          histories={historyEntries.slice(0, 3)}
          patient={selectedPatient}
          onAppointment={openAppointmentForm}
          onBack={goBack}
          onEdit={() => beginEditPatient(selectedPatient)}
          onHistory={() => setFlow('history')}
          onVisit={openVisitForm}
        />
      ) : null}

      {flow === 'editPatient' ? (
        <PatientFormScreen
          form={patientForm}
          isEditing={Boolean(editingPatientId)}
          onBack={goBack}
          onChange={setPatientForm}
          onSave={persistPatient}
          saving={saving}
        />
      ) : null}

      {flow === 'history' && selectedPatient ? (
        <ClinicalHistoryScreen
          entries={historyEntries}
          expandedId={expandedHistoryId}
          patient={selectedPatient}
          onBack={goBack}
          onEdit={openHistoryForm}
          onNew={() => openHistoryForm()}
          onToggle={setExpandedHistoryId}
        />
      ) : null}

      {flow === 'historyForm' && selectedPatient ? (
        <ClinicalHistoryFormScreen
          form={historyForm}
          patient={selectedPatient}
          saving={saving}
          onBack={goBack}
          onChange={setHistoryForm}
          onSave={persistHistory}
        />
      ) : null}

      {flow === 'appointment' && selectedPatient ? (
        <AppointmentScreen
          appointments={selectedAppointments}
          form={appointmentForm}
          patient={selectedPatient}
          saving={saving}
          onBack={goBack}
          onChange={setAppointmentForm}
          onSave={persistAppointment}
        />
      ) : null}

      {flow === 'visit' && selectedPatient ? (
        <VisitScreen
          appointments={selectedAppointments.filter((appointment) => appointment.status === 'programada')}
          financialMovements={financialMovements}
          form={visitForm}
          patient={selectedPatient}
          saving={saving}
          visits={visits}
          onBack={goBack}
          onChange={setVisitForm}
          onFinish={finishVisit}
          onStart={startVisit}
        />
      ) : null}
    </View>
  );
}

function WorkspaceError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>Revisión necesaria</Text>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

function ScreenShell({
  children,
  onBack,
  rightAction,
  subtitle,
  title,
}: {
  children: ReactNode;
  onBack?: () => boolean;
  rightAction?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.screenShell}>
      <View style={styles.shellHeader}>
        {onBack ? (
          <TouchableOpacity activeOpacity={0.82} onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.shellTitleBlock}>
          <Text style={styles.shellTitle} numberOfLines={2}>{title}</Text>
          {subtitle ? <Text style={styles.shellSubtitle} numberOfLines={2}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View style={styles.shellAction}>{rightAction}</View> : null}
      </View>
      {children}
    </View>
  );
}

function PatientList({
  compact,
  mode,
  onCreate,
  onOpenPatient,
  onQuery,
  patients,
  query,
}: {
  compact: boolean;
  mode: WorkspaceMode;
  onCreate?: () => void;
  onOpenPatient: (patient: KinesiologiaPatient) => void;
  onQuery: (value: string) => void;
  patients: KinesiologiaPatient[];
  query: string;
}) {
  const title = mode === 'history' ? 'Historias clínicas' : mode === 'dates' ? 'Fechas y agenda' : 'Pacientes';
  const subtitle = mode === 'patients' ? 'Sincronizado con Supabase' : 'Selecciona un paciente';

  return (
    <View style={styles.sectionBlock}>
      <View style={[styles.listHeader, compact ? styles.listHeaderCompact : null]}>
        <View style={styles.listTitleBlock}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionMeta}>{subtitle}</Text>
        </View>
        {onCreate ? <SmallAction label="Nuevo" onPress={onCreate} /> : null}
      </View>
      <Field label="Buscar paciente" value={query} onChangeText={onQuery} />
      <View style={styles.patientList}>
        {patients.length === 0 ? (
          <EmptyState text="No hay pacientes para mostrar." />
        ) : null}
        {patients.map((patient) => (
          <TouchableOpacity key={patient.id} activeOpacity={0.86} onPress={() => onOpenPatient(patient)} style={styles.patientCard}>
            <View style={styles.patientInitial}>
              <Text style={styles.patientInitialText}>{patient.nombreApellido.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.patientCardBody}>
              <Text style={styles.patientName} numberOfLines={1}>{patient.nombreApellido}</Text>
              <Text style={styles.patientDescription} numberOfLines={2}>{patient.motivoConsulta || 'Sin motivo de consulta'}</Text>
              <Text style={styles.patientStatus} numberOfLines={1}>Activo · {patient.fechaNacimiento || `${patient.edadEstimada ?? '-'} años`}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function PatientDetail({
  appointments,
  histories,
  onAppointment,
  onBack,
  onEdit,
  onHistory,
  onVisit,
  patient,
}: {
  appointments: Appointment[];
  histories: ClinicalHistoryEntry[];
  onAppointment: () => void;
  onBack: () => boolean;
  onEdit: () => void;
  onHistory: () => void;
  onVisit: () => void;
  patient: KinesiologiaPatient;
}) {
  const age = patient.fechaNacimiento ? calculateAge(patient.fechaNacimiento) : patient.edadEstimada;
  return (
    <ScreenShell
      title={patient.nombreApellido}
      subtitle="Ficha completa del paciente"
      onBack={onBack}
      rightAction={<SmallAction label="Editar" onPress={onEdit} />}
    >
      <View style={styles.actionGrid}>
        <SecondaryAction label="Historia clínica" onPress={onHistory} />
        <SecondaryAction label="Agendar visita" onPress={onAppointment} />
        <SecondaryAction label="Cargar visita" onPress={onVisit} />
      </View>
      <View style={styles.infoCard}>
        <InfoRow label="Nombre y apellido" value={patient.nombreApellido} />
        <InfoRow label="Domicilio" value={patient.domicilio} />
        <InfoRow label="Fecha de nacimiento" value={patient.fechaNacimiento || '-'} />
        <InfoRow label="Edad" value={age ? `${age} años${patient.usaEdadEstimada ? ' estimados' : ''}` : '-'} />
        <InfoRow label="Motivo de consulta" value={patient.motivoConsulta} />
        <InfoRow label="Afección / enfermedad / patología" value={patient.afeccionPatologia} />
        <InfoRow label="Tratamiento propuesto" value={patient.tratamientoPropuesto} />
        <InfoRow label="Estado" value="Activo" />
        <InfoRow label="Fecha de creación" value={formatDateTimeAR(patient.createdAt)} />
        <InfoRow label="Última actualización" value={formatDateTimeAR(patient.updatedAt)} />
      </View>
      <SummaryList
        emptyText="Sin visitas próximas."
        items={appointments.map((appointment) => `${formatDateAR(appointment.appointmentDate)} ${appointment.appointmentTime} · ${appointment.status}`)}
        title="Próximas visitas"
      />
      <SummaryList
        emptyText="Sin historias clínicas cargadas."
        items={histories.map((entry) => `${formatDateAR(entry.fechaTratamiento)} · ${entry.contenido}`)}
        title="Últimas historias clínicas"
      />
    </ScreenShell>
  );
}

function PatientFormScreen({
  form,
  isEditing,
  onBack,
  onChange,
  onSave,
  saving,
}: {
  form: PatientInput;
  isEditing: boolean;
  onBack: () => boolean;
  onChange: (form: PatientInput) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const automaticAge = calculateAge(form.fechaNacimiento);
  return (
    <ScreenShell title={isEditing ? 'Editar paciente' : 'Nuevo paciente'} subtitle="Datos clínicos principales" onBack={onBack}>
      <View style={styles.formCard}>
        <Field label="Nombre y apellido" value={form.nombreApellido} onChangeText={(nombreApellido) => onChange({ ...form, nombreApellido })} />
        <Field label="Domicilio" value={form.domicilio} onChangeText={(domicilio) => onChange({ ...form, domicilio })} />
        <Field label="Motivo de consulta" value={form.motivoConsulta} onChangeText={(motivoConsulta) => onChange({ ...form, motivoConsulta })} multiline />
        <Field
          label="Afección / patología"
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
          label="Fecha nacimiento DD/MM/AAAA"
          value={form.fechaNacimiento}
          onChangeText={(fechaNacimiento) => onChange({ ...form, fechaNacimiento, usaEdadEstimada: false })}
        />
        {automaticAge !== null ? <Text style={styles.helperText}>Edad calculada automáticamente: {automaticAge} años</Text> : null}
        <TogglePill
          active={form.usaEdadEstimada}
          label="Usar edad estimada"
          onPress={() => onChange({ ...form, usaEdadEstimada: !form.usaEdadEstimada, fechaNacimiento: '' })}
        />
        {form.usaEdadEstimada ? (
          <Field label="Edad estimada" value={form.edadEstimada} onChangeText={(edadEstimada) => onChange({ ...form, edadEstimada })} />
        ) : null}
        <PrimaryButton label={saving ? 'Guardando' : isEditing ? 'Actualizar paciente' : 'Guardar paciente'} onPress={onSave} />
      </View>
    </ScreenShell>
  );
}

function ClinicalHistoryScreen({
  entries,
  expandedId,
  onBack,
  onEdit,
  onNew,
  onToggle,
  patient,
}: {
  entries: ClinicalHistoryEntry[];
  expandedId: string | null;
  onBack: () => boolean;
  onEdit: (entry: ClinicalHistoryEntry) => void;
  onNew: () => void;
  onToggle: (id: string | null) => void;
  patient: KinesiologiaPatient;
}) {
  return (
    <ScreenShell title="Historia clínica" subtitle={patient.nombreApellido} onBack={onBack} rightAction={<SmallAction label="Nueva" onPress={onNew} />}>
      <View style={styles.recordStack}>
        {entries.length === 0 ? <EmptyState text="Todavía no hay entradas clínicas para este paciente." /> : null}
        {entries.map((entry) => {
          const expanded = expandedId === entry.id;
          return (
            <View key={entry.id} style={styles.recordCard}>
              <TouchableOpacity activeOpacity={0.84} onPress={() => onToggle(expanded ? null : entry.id)} style={styles.recordHeader}>
                <View style={styles.recordTitleBlock}>
                  <Text style={styles.recordDate}>{formatDateAR(entry.fechaTratamiento)}</Text>
                  <Text style={styles.recordText} numberOfLines={expanded ? undefined : 2}>{entry.contenido}</Text>
                </View>
                <Text style={styles.chevron}>{expanded ? '⌃' : '⌄'}</Text>
              </TouchableOpacity>
              {expanded ? (
                <View style={styles.recordExpanded}>
                  <Text style={styles.signatureText}>{entry.authorSignatureSnapshot}</Text>
                  <Text style={styles.backupText}>Backup: {entry.backupStatus}</Text>
                  <SecondaryAction label="Editar historia clínica" onPress={() => onEdit(entry)} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}

function ClinicalHistoryFormScreen({
  form,
  onBack,
  onChange,
  onSave,
  patient,
  saving,
}: {
  form: HistoryForm;
  onBack: () => boolean;
  onChange: (form: HistoryForm) => void;
  onSave: () => void;
  patient: KinesiologiaPatient;
  saving: boolean;
}) {
  return (
    <ScreenShell title={form.id ? 'Editar historia clínica' : 'Nueva historia clínica'} subtitle={patient.nombreApellido} onBack={onBack}>
      <DateSelector
        label="Fecha de tratamiento"
        value={form.fechaTratamiento}
        onChange={(fechaTratamiento) => onChange({ ...form, fechaTratamiento })}
      />
      <Field
        label="Observaciones"
        value={form.contenido}
        onChangeText={(contenido) => onChange({ ...form, contenido })}
        multiline
        tall
      />
      <PrimaryButton label={saving ? 'Guardando' : form.id ? 'Actualizar historia clínica' : 'Guardar historia clínica'} onPress={onSave} />
    </ScreenShell>
  );
}

function AppointmentScreen({
  appointments,
  form,
  onBack,
  onChange,
  onSave,
  patient,
  saving,
}: {
  appointments: Appointment[];
  form: AppointmentForm;
  onBack: () => boolean;
  onChange: (form: AppointmentForm) => void;
  onSave: () => void;
  patient: KinesiologiaPatient;
  saving: boolean;
}) {
  return (
    <ScreenShell title="Agendar visita" subtitle={patient.nombreApellido} onBack={onBack}>
      <DateSelector label="Fecha" value={form.date} onChange={(date) => onChange({ ...form, date })} />
      <TimeSelector
        hour={form.hour}
        minute={form.minute}
        onChange={(hour, minute) => onChange({ ...form, hour, minute })}
      />
      <Field label="Notas opcionales" value={form.notes} onChangeText={(notes) => onChange({ ...form, notes })} multiline />
      <PrimaryButton label={saving ? 'Guardando' : 'Agendar visita'} onPress={onSave} />
      <SummaryList
        emptyText="Sin visitas agendadas para este paciente."
        items={appointments.map((appointment) => `${formatDateAR(appointment.appointmentDate)} ${appointment.appointmentTime} · ${appointment.status}`)}
        title="Agenda del paciente"
      />
    </ScreenShell>
  );
}

function VisitScreen({
  appointments,
  financialMovements,
  form,
  onBack,
  onChange,
  onFinish,
  onStart,
  patient,
  saving,
  visits,
}: {
  appointments: Appointment[];
  financialMovements: FinancialMovement[];
  form: VisitForm;
  onBack: () => boolean;
  onChange: (form: VisitForm) => void;
  onFinish: () => void;
  onStart: () => void;
  patient: KinesiologiaPatient;
  saving: boolean;
  visits: Visit[];
}) {
  return (
    <ScreenShell title="Cargar visita" subtitle={patient.nombreApellido} onBack={onBack}>
      {!form.active ? (
        <View style={styles.infoCard}>
          <Text style={styles.recordText}>Elegí una visita programada o iniciá una sesión libre.</Text>
          {appointments.length > 0 ? (
            <View style={styles.optionGrid}>
              {appointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  onPress={() =>
                    onChange({
                      ...form,
                      appointmentId: appointment.id,
                      start: appointment.appointmentTime,
                      visitDate: appointment.appointmentDate,
                    })
                  }
                  style={[styles.optionPill, form.appointmentId === appointment.id ? styles.activeOptionPill : null]}
                >
                  <Text style={[styles.optionText, form.appointmentId === appointment.id ? styles.activeOptionText : null]}>
                    {formatDateAR(appointment.appointmentDate)} · {appointment.appointmentTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          <PrimaryButton label="Iniciar sesión" onPress={onStart} />
        </View>
      ) : (
        <View style={styles.infoCard}>
          <InfoRow label="Fecha" value={formatDateAR(form.visitDate)} />
          <InfoRow label="Hora de inicio" value={form.start} />
          <Field label="Observaciones" value={form.observaciones} onChangeText={(observaciones) => onChange({ ...form, observaciones })} multiline />
          <TogglePill active={form.pagoRealizado} label="Pago realizado" onPress={() => onChange({ ...form, pagoRealizado: !form.pagoRealizado })} />
          {form.pagoRealizado ? (
            <>
              <Field label="Monto pagado" value={form.montoPagado} onChangeText={(montoPagado) => onChange({ ...form, montoPagado })} />
              <Text style={styles.subTitle}>Método de pago</Text>
              <OptionGrid
                options={paymentMethods}
                value={form.paymentMethod}
                onChange={(paymentMethod) => onChange({ ...form, paymentMethod: paymentMethod as PaymentMethod })}
              />
            </>
          ) : null}
          <PrimaryButton label={saving ? 'Guardando' : 'Finalizar sesión'} onPress={onFinish} />
        </View>
      )}
      <SummaryList
        emptyText="Sin visitas finalizadas."
        items={visits.map((visit) => `${formatDateAR(visit.visitDate)} · ${visit.duracionMinutos} min · ${visit.observaciones || 'Sin observaciones'}`)}
        title="Visitas registradas"
      />
      <SummaryList
        emptyText="Sin pagos vinculados."
        items={financialMovements.map((movement) => `${formatDateAR(movement.movementDate)} · ${formatCurrencyARS(movement.amount)} · ${movement.description}`)}
        title="Pagos vinculados"
      />
    </ScreenShell>
  );
}

function ProfileEditor({
  form,
  onChange,
  onSave,
  saving,
}: {
  form: {
    nombreCompleto: string;
    titulo: string;
    matriculaProfesional: string;
    especialidad: string;
    horariosAtencion: string;
  };
  onChange: (form: {
    nombreCompleto: string;
    titulo: string;
    matriculaProfesional: string;
    especialidad: string;
    horariosAtencion: string;
  }) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <ScreenShell title="Perfil profesional" subtitle="Firma clínica persistida en Supabase">
      <View style={styles.formCard}>
        <Field label="Título" value={form.titulo} onChangeText={(titulo) => onChange({ ...form, titulo })} />
        <Field label="Nombre completo" value={form.nombreCompleto} onChangeText={(nombreCompleto) => onChange({ ...form, nombreCompleto })} />
        <Field
          label="Matrícula profesional M.P."
          value={form.matriculaProfesional}
          onChangeText={(matriculaProfesional) => onChange({ ...form, matriculaProfesional })}
        />
        <Field label="Especialidad" value={form.especialidad} onChangeText={(especialidad) => onChange({ ...form, especialidad })} />
        <Field label="Horarios" value={form.horariosAtencion} onChangeText={(horariosAtencion) => onChange({ ...form, horariosAtencion })} multiline />
        <View style={styles.signatureCard}>
          <Text style={styles.signatureLabel}>Firma generada</Text>
          <Text style={styles.signatureText}>{formatProfessionalSignature(form)}</Text>
        </View>
        <PrimaryButton label={saving ? 'Guardando' : 'Guardar perfil'} onPress={onSave} />
      </View>
    </ScreenShell>
  );
}

function DateSelector({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.selectorBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity activeOpacity={0.84} onPress={() => setOpen((current) => !current)} style={styles.selectorButton}>
        <View>
          <Text style={styles.selectorValue}>{formatDateAR(value)}</Text>
          <Text style={styles.selectorHint}>{open ? 'Cerrar calendario' : 'Tocar para elegir fecha'}</Text>
        </View>
        <Text style={styles.selectorIcon}>{open ? '⌃' : '⌄'}</Text>
      </TouchableOpacity>
      {open ? (
        <CalendarPicker
          value={value}
          onChange={(nextValue) => {
            onChange(nextValue);
            setOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}

function TimeSelector({
  hour,
  minute,
  onChange,
}: {
  hour: string;
  minute: string;
  onChange: (hour: string, minute: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.selectorBlock}>
      <Text style={styles.fieldLabel}>Hora</Text>
      <TouchableOpacity activeOpacity={0.84} onPress={() => setOpen((current) => !current)} style={styles.selectorButton}>
        <View>
          <Text style={styles.selectorValue}>{hour}:{minute}</Text>
          <Text style={styles.selectorHint}>{open ? 'Cerrar selector' : 'Tocar para elegir horario'}</Text>
        </View>
        <Text style={styles.selectorIcon}>{open ? '⌃' : '⌄'}</Text>
      </TouchableOpacity>
      {open ? (
        <View style={styles.timePickerCard}>
          <View style={styles.timeColumns}>
            <PickerColumn title="Hora" options={hours} value={hour} onChange={(nextHour) => onChange(nextHour, minute)} />
            <PickerColumn title="Minutos" options={minutes} value={minute} onChange={(nextMinute) => onChange(hour, nextMinute)} />
          </View>
          <SmallAction label="Listo" onPress={() => setOpen(false)} />
        </View>
      ) : null}
    </View>
  );
}

function PickerColumn({
  onChange,
  options,
  title,
  value,
}: {
  onChange: (value: string) => void;
  options: string[];
  title: string;
  value: string;
}) {
  return (
    <View style={styles.pickerColumn}>
      <Text style={styles.pickerTitle}>{title}</Text>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
        {options.map((option) => {
          const active = option === value;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.82}
              onPress={() => onChange(option)}
              style={[styles.pickerRow, active ? styles.activePickerRow : null]}
            >
              <Text style={[styles.pickerRowText, active ? styles.activePickerRowText : null]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CalendarPicker({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  const selected = isoToDate(value);
  const [month, setMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const mondayOffset = (monthStart.getDay() + 6) % 7;
  const cells = [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
  ];

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity activeOpacity={0.82} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.calendarNav}>
          <Text style={styles.calendarNavText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.calendarTitle}>{month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</Text>
        <TouchableOpacity activeOpacity={0.82} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.calendarNav}>
          <Text style={styles.calendarNavText}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <Text key={day} style={styles.weekLabel}>{day}</Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {cells.map((date, index) => {
          const iso = date ? toIsoDate(date) : `empty-${index}`;
          const active = date ? iso === value : false;
          return (
            <TouchableOpacity
              key={iso}
              activeOpacity={date ? 0.82 : 1}
              disabled={!date}
              onPress={() => date && onChange(iso)}
              style={[styles.dayCell, active ? styles.activeDayCell : null]}
            >
              <Text style={[styles.dayText, active ? styles.activeDayText : null]}>{date ? date.getDate() : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.helperText}>Fecha seleccionada: {formatDateAR(value)}</Text>
    </View>
  );
}

function OptionGrid({ onChange, options, value }: { onChange: (value: string) => void; options: string[]; value: string }) {
  return (
    <View style={styles.optionGrid}>
      {options.map((option) => {
        const active = value === option;
        return (
          <TouchableOpacity key={option} activeOpacity={0.82} onPress={() => onChange(option)} style={[styles.optionPill, active ? styles.activeOptionPill : null]}>
            <Text style={[styles.optionText, active ? styles.activeOptionText : null]}>{option.replace('_', ' ')}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SummaryList({ emptyText, items, title }: { emptyText: string; items: string[]; title: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.subTitle}>{title}</Text>
      {items.length === 0 ? <Text style={styles.recordText}>{emptyText}</Text> : null}
      {items.map((item, index) => (
        <Text key={`${item}-${index}`} style={styles.summaryItem} numberOfLines={3}>{item}</Text>
      ))}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
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
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>Sin datos</Text>
      <Text style={styles.emptyText}>{text}</Text>
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

function SmallAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} style={styles.smallAction}>
      <Text style={styles.smallActionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function TogglePill({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.toggleRow, active ? styles.activeToggle : null]}>
      <Text style={[styles.toggleText, active ? styles.activeToggleText : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  sectionBlock: {
    gap: 12,
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  listHeaderCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  listTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: healthColors.night,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 29,
  },
  sectionMeta: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  screenShell: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  shellHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 6,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  backIcon: {
    color: healthColors.cream,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30,
  },
  shellTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  shellTitle: {
    color: healthColors.night,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 26,
  },
  shellSubtitle: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 17,
    marginTop: 2,
  },
  shellAction: {
    flexShrink: 0,
  },
  errorBox: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.burgundy,
    borderRadius: 8,
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
    borderRadius: 6,
    borderWidth: 1,
    color: healthColors.night,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  multiline: {
    minHeight: 88,
    paddingTop: 12,
  },
  tallInput: {
    minHeight: 210,
  },
  patientList: {
    gap: 10,
  },
  patientCard: {
    alignItems: 'center',
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  patientInitial: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 6,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  patientInitialText: {
    color: healthColors.cream,
    fontSize: 18,
    fontWeight: '900',
  },
  patientCardBody: {
    flex: 1,
    minWidth: 0,
  },
  patientName: {
    color: healthColors.night,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  patientDescription: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  patientStatus: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 5,
  },
  chevron: {
    color: healthColors.night,
    fontSize: 24,
    fontWeight: '900',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  infoCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  infoRow: {
    borderBottomColor: healthColors.creamDeep,
    borderBottomWidth: 1,
    paddingVertical: 9,
  },
  infoLabel: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: healthColors.night,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 3,
  },
  helperText: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 8,
  },
  toggleRow: {
    borderColor: healthColors.night,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  activeToggle: {
    backgroundColor: healthColors.night,
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
    borderRadius: 6,
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
  smallAction: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  smallActionText: {
    color: healthColors.cream,
    fontSize: 12,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: healthColors.night,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
  },
  summaryCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  subTitle: {
    color: healthColors.night,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
  },
  summaryItem: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  recordStack: {
    gap: 10,
  },
  recordCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  recordHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  recordTitleBlock: {
    flex: 1,
    minWidth: 0,
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
  recordExpanded: {
    borderTopColor: healthColors.creamDeep,
    borderTopWidth: 1,
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
  },
  signatureCard: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
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
  },
  backupText: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
  },
  selectorBlock: {
    marginTop: 8,
  },
  selectorButton: {
    alignItems: 'center',
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  selectorValue: {
    color: healthColors.night,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  selectorHint: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
    marginTop: 2,
  },
  selectorIcon: {
    color: healthColors.night,
    fontSize: 18,
    fontWeight: '900',
  },
  timePickerCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 8,
    padding: 12,
  },
  timeColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerColumn: {
    flex: 1,
    minWidth: 0,
  },
  pickerTitle: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  pickerScroll: {
    borderColor: healthColors.creamDeep,
    borderRadius: 6,
    borderWidth: 1,
    maxHeight: 152,
  },
  pickerRow: {
    alignItems: 'center',
    minHeight: 38,
    justifyContent: 'center',
  },
  activePickerRow: {
    backgroundColor: healthColors.night,
  },
  pickerRowText: {
    color: healthColors.night,
    fontSize: 13,
    fontWeight: '900',
  },
  activePickerRowText: {
    color: healthColors.cream,
  },
  calendarCard: {
    backgroundColor: healthColors.creamSoft,
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarNav: {
    alignItems: 'center',
    borderColor: healthColors.night,
    borderRadius: 6,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  calendarNavText: {
    color: healthColors.night,
    fontSize: 22,
    fontWeight: '900',
  },
  calendarTitle: {
    color: healthColors.night,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  weekLabel: {
    color: healthColors.olive,
    flex: 1,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayCell: {
    alignItems: 'center',
    aspectRatio: 1,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  activeDayCell: {
    backgroundColor: healthColors.night,
    borderRadius: 4,
  },
  dayText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
  },
  activeDayText: {
    color: healthColors.cream,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionPill: {
    borderColor: healthColors.night,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  activeOptionPill: {
    backgroundColor: healthColors.night,
  },
  optionText: {
    color: healthColors.night,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  activeOptionText: {
    color: healthColors.cream,
  },
  emptyCard: {
    borderColor: healthColors.creamDeep,
    borderRadius: 8,
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
