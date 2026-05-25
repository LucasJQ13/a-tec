import { supabase } from './supabaseClient';
import type { Reminder, ReminderInput, ReminderPriority, ReminderStatus, ReminderTarget } from '../types/reminders';

type ReminderRow = {
  id: string;
  author_name: string;
  target_user: ReminderTarget;
  message: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

function requireSupabase() {
  if (!supabase) throw new Error('No se pudo conectar con Supabase.');
  return supabase;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function reminderFromRow(row: ReminderRow): Reminder {
  return {
    id: row.id,
    authorName: row.author_name,
    targetUser: row.target_user,
    message: row.message,
    priority: row.priority,
    status: row.status,
    readAt: row.read_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listReminders(filter?: { targetUser?: ReminderTarget | 'Todos'; status?: ReminderStatus | 'Todos' }) {
  const client = requireSupabase();
  let query = client.from('reminders').select('*').order('created_at', { ascending: false }).limit(80);
  if (filter?.targetUser && filter.targetUser !== 'Todos') {
    query = query.in('target_user', [filter.targetUser, 'Ambos']);
  }
  if (filter?.status && filter.status !== 'Todos') {
    query = query.eq('status', filter.status);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => reminderFromRow(row as ReminderRow));
}

export async function createReminder(input: ReminderInput) {
  const client = requireSupabase();
  if (input.message.trim().length < 3) throw new Error('Escribí un recordatorio.');
  const timestamp = nowIso();
  const { data, error } = await client
    .from('reminders')
    .insert({
      id: createId('reminder'),
      author_name: input.authorName,
      target_user: input.targetUser,
      message: input.message.trim(),
      priority: input.priority,
      status: 'pendiente',
      read_at: null,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return reminderFromRow(data as ReminderRow);
}

export async function markReminderRead(reminderId: string) {
  const client = requireSupabase();
  const timestamp = nowIso();
  const { error } = await client
    .from('reminders')
    .update({ status: 'leido', read_at: timestamp, updated_at: timestamp })
    .eq('id', reminderId);
  if (error) throw new Error(error.message);
}
