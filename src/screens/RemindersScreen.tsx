import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { academicTheme, homeColors } from '../config/theme.config';
import { createReminder, listReminders, markReminderRead } from '../shared/services/remindersService';
import { useToast } from '../shared/components/ToastProvider';
import { formatDateTimeAR } from '../shared/utils/formatters';
import type { Reminder, ReminderPriority, ReminderTarget } from '../shared/types/reminders';
import type { UserProfile } from '../types/navigation';

type RemindersScreenProps = {
  selectedUser: UserProfile | null;
};

const targets: ReminderTarget[] = ['Lucas', 'Fer', 'Ambos'];
const priorities: ReminderPriority[] = ['normal', 'importante', 'urgente'];

export function RemindersScreen({ selectedUser }: RemindersScreenProps) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [targetUser, setTargetUser] = useState<ReminderTarget>('Ambos');
  const [priority, setPriority] = useState<ReminderPriority>('normal');
  const [message, setMessage] = useState('');
  const [targetFilter, setTargetFilter] = useState<ReminderTarget | 'Todos'>('Todos');

  const authorName = selectedUser?.name ?? 'Lucas';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listReminders({ targetUser: targetFilter });
      setReminders(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, targetFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unreadCount = useMemo(() => reminders.filter((reminder) => reminder.status === 'pendiente').length, [reminders]);

  const saveReminder = async () => {
    try {
      await createReminder({ authorName, targetUser, priority, message });
      setMessage('');
      setTargetUser('Ambos');
      setPriority('normal');
      setShowForm(false);
      showToast('Recordatorio creado', 'success');
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar recordatorio', 'error');
    }
  };

  const readReminder = async (reminder: Reminder) => {
    if (reminder.status === 'leido') return;
    try {
      await markReminderRead(reminder.id);
      showToast('Recordatorio marcado como leído', 'success');
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error de conexión', 'error');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 124 }]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={academicTheme.colors.bronzeLight} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>A-Tec compartido</Text>
          <Text style={styles.title}>Recordatorios</Text>
          <Text style={styles.subtitle}>{unreadCount} pendientes para revisar entre Lucas y Fer.</Text>
        </View>

        <View style={styles.toolbar}>
          {(['Todos', ...targets] as Array<ReminderTarget | 'Todos'>).map((target) => (
            <TouchableOpacity
              key={target}
              onPress={() => setTargetFilter(target)}
              style={[styles.filterChip, targetFilter === target ? styles.filterChipActive : null]}
            >
              <Text style={[styles.filterText, targetFilter === target ? styles.filterTextActive : null]}>{target}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowForm((value) => !value)}>
          <Text style={styles.primaryButtonText}>{showForm ? 'Cerrar formulario' : 'Nuevo recordatorio'}</Text>
        </TouchableOpacity>

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Crear recordatorio</Text>
            <Text style={styles.label}>Destinatario</Text>
            <Segmented options={targets} value={targetUser} onChange={(value) => setTargetUser(value as ReminderTarget)} />
            <Text style={styles.label}>Prioridad</Text>
            <Segmented options={priorities} value={priority} onChange={(value) => setPriority(value as ReminderPriority)} />
            <Text style={styles.label}>Mensaje</Text>
            <TextInput
              multiline
              onChangeText={setMessage}
              placeholder="Escribir recordatorio..."
              placeholderTextColor="rgba(4, 8, 51, 0.44)"
              style={styles.textarea}
              value={message}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.list}>
          {reminders.map((reminder) => (
            <TouchableOpacity key={reminder.id} onPress={() => readReminder(reminder)} style={styles.reminderCard}>
              <View style={styles.cardTop}>
                <Text style={styles.reminderTarget}>{reminder.targetUser}</Text>
                <Text style={[styles.priority, styles[`priority_${reminder.priority}`]]}>{reminder.priority}</Text>
              </View>
              <Text style={styles.message}>{reminder.message}</Text>
              <Text style={styles.meta}>
                {reminder.authorName} · {formatDateTimeAR(reminder.createdAt)} · {reminder.status === 'leido' ? 'Leído' : 'No leído'}
              </Text>
            </TouchableOpacity>
          ))}
          {!loading && reminders.length === 0 ? <Text style={styles.empty}>Sin recordatorios cargados.</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Segmented({
  onChange,
  options,
  value,
}: {
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => (
        <TouchableOpacity key={option} onPress={() => onChange(option)} style={[styles.segment, value === option ? styles.segmentActive : null]}>
          <Text style={[styles.segmentText, value === option ? styles.segmentTextActive : null]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: '#040833', fontSize: 18, fontWeight: '900' },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  content: { paddingHorizontal: 18 },
  empty: { color: '#fcf4e4', fontSize: 14, fontWeight: '700', marginTop: 18, textAlign: 'center' },
  eyebrow: { color: '#D2BF99', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  filterChip: { borderColor: 'rgba(252,244,228,0.24)', borderRadius: 10, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#fcf4e4' },
  filterText: { color: '#fcf4e4', fontSize: 12, fontWeight: '800' },
  filterTextActive: { color: '#040833' },
  formCard: { backgroundColor: '#fcf4e4', borderRadius: 8, marginTop: 14, padding: 16 },
  header: { marginBottom: 16 },
  label: { color: '#040833', fontSize: 12, fontWeight: '900', marginTop: 14, textTransform: 'uppercase' },
  list: { marginTop: 18 },
  message: { color: '#040833', fontSize: 16, fontWeight: '800', lineHeight: 22, marginTop: 12 },
  meta: { color: '#54582F', fontSize: 12, fontWeight: '700', marginTop: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: '#fcf4e4', borderRadius: 8, padding: 14 },
  primaryButtonText: { color: '#040833', fontSize: 14, fontWeight: '900' },
  priority: { borderRadius: 8, fontSize: 11, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, textTransform: 'uppercase' },
  priority_importante: { backgroundColor: '#54582F', color: '#fcf4e4' },
  priority_normal: { backgroundColor: 'rgba(4,8,51,0.08)', color: '#040833' },
  priority_urgente: { backgroundColor: '#56070C', color: '#fcf4e4' },
  reminderCard: { backgroundColor: '#fcf4e4', borderColor: 'rgba(4,8,51,0.1)', borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 15 },
  reminderTarget: { color: '#040833', fontSize: 13, fontWeight: '900' },
  saveButton: { alignItems: 'center', backgroundColor: '#040833', borderRadius: 8, marginTop: 14, padding: 13 },
  saveButtonText: { color: '#fcf4e4', fontSize: 14, fontWeight: '900' },
  screen: { backgroundColor: homeColors.background, flex: 1 },
  segment: { alignItems: 'center', borderRadius: 8, flex: 1, paddingVertical: 10 },
  segmentActive: { backgroundColor: '#040833' },
  segmentText: { color: '#040833', fontSize: 12, fontWeight: '800' },
  segmentTextActive: { color: '#fcf4e4' },
  segmented: { backgroundColor: 'rgba(4,8,51,0.08)', borderRadius: 8, flexDirection: 'row', gap: 6, marginTop: 8, padding: 5 },
  subtitle: { color: '#D2BF99', fontSize: 14, fontWeight: '700', lineHeight: 20, marginTop: 6 },
  textarea: { backgroundColor: '#fffaf0', borderColor: 'rgba(4,8,51,0.12)', borderRadius: 8, borderWidth: 1, color: '#040833', minHeight: 104, padding: 12, textAlignVertical: 'top' },
  title: { color: '#fcf4e4', fontSize: 32, fontWeight: '900', letterSpacing: 0, marginTop: 6 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
});
