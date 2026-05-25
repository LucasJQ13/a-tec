import { supabase } from './supabaseClient';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function registerDevicePushToken(input: {
  userName: string;
  expoPushToken: string;
  deviceId: string;
}) {
  if (!supabase || !input.expoPushToken) return null;
  const { data, error } = await supabase
    .from('device_push_tokens')
    .upsert({
      id: createId('push-token'),
      user_name: input.userName,
      expo_push_token: input.expoPushToken,
      device_id: input.deviceId,
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function scheduleDailyAgendaNotification(count: number) {
  try {
    const Notifications = await import('expo-notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Agenda de hoy',
        body: count > 0 ? `Hoy tienes ${count} pacientes para visitar` : 'No tienes visitas programadas para hoy',
        data: { screen: 'DailyAppointments' },
      },
      trigger: null,
    });
    return true;
  } catch {
    return false;
  }
}
