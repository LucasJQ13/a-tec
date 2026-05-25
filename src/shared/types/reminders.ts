export type ReminderTarget = 'Lucas' | 'Fer' | 'Ambos';
export type ReminderPriority = 'normal' | 'importante' | 'urgente';
export type ReminderStatus = 'pendiente' | 'leido';

export type Reminder = {
  id: string;
  authorName: string;
  targetUser: ReminderTarget;
  message: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReminderInput = {
  authorName: string;
  targetUser: ReminderTarget;
  message: string;
  priority: ReminderPriority;
};

export type DevicePushToken = {
  id: string;
  userName: string;
  expoPushToken: string;
  deviceId: string;
  createdAt: string;
};
