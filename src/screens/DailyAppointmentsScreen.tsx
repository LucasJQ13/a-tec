import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { healthColors } from '../constants/healthTheme';
import { listDailyAppointments } from '../shared/services/kinesiologiaService';
import { scheduleDailyAgendaNotification } from '../shared/services/notificationsService';
import { useToast } from '../shared/components/ToastProvider';
import { formatDateAR } from '../shared/utils/formatters';
import type { DailyAppointment } from '../shared/types/kinesiologia';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function DailyAppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<DailyAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const date = todayIso();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDailyAppointments(date);
      setAppointments(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  }, [date, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (appointments.length > 0) scheduleDailyAgendaNotification(appointments.length);
  }, [appointments.length]);

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 120 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={healthColors.night} />}
      style={styles.screen}
    >
      <Text style={styles.eyebrow}>Agenda diaria</Text>
      <Text style={styles.title}>Pacientes a visitar</Text>
      <Text style={styles.subtitle}>{formatDateAR(date)} · Ordenado por horario</Text>

      <View style={styles.list}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
            <View style={styles.timeBox}>
              <Text style={styles.time}>{appointment.appointmentTime}</Text>
              <Text style={styles.status}>{appointment.status}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.name}>{appointment.patientName}</Text>
              <Text style={styles.address}>{appointment.domicilio || 'Sin domicilio cargado'}</Text>
              <Text style={styles.notes}>{appointment.quickNotes || 'Sin observaciones rápidas'}</Text>
            </View>
          </View>
        ))}
        {!loading && appointments.length === 0 ? <Text style={styles.empty}>No hay pacientes programados para hoy.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  address: { color: '#54582F', fontSize: 13, fontWeight: '700', marginTop: 5 },
  card: { backgroundColor: '#fcf4e4', borderColor: 'rgba(4,8,51,0.1)', borderRadius: 8, borderWidth: 1, flexDirection: 'row', gap: 12, marginBottom: 12, padding: 14 },
  cardBody: { flex: 1 },
  content: { paddingHorizontal: 18 },
  empty: { color: '#040833', fontSize: 15, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  eyebrow: { color: '#54582F', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  list: { marginTop: 20 },
  name: { color: '#040833', fontSize: 17, fontWeight: '900' },
  notes: { color: '#040833', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 8 },
  screen: { backgroundColor: healthColors.cream, flex: 1 },
  status: { color: '#fcf4e4', fontSize: 10, fontWeight: '900', marginTop: 4, textTransform: 'uppercase' },
  subtitle: { color: '#54582F', fontSize: 14, fontWeight: '800', marginTop: 8 },
  time: { color: '#fcf4e4', fontSize: 18, fontWeight: '900' },
  timeBox: { alignItems: 'center', backgroundColor: '#040833', borderRadius: 8, justifyContent: 'center', minHeight: 72, width: 78 },
  title: { color: '#040833', fontSize: 31, fontWeight: '900', letterSpacing: 0, marginTop: 6 },
});
