import { Platform } from 'react-native';
import type { Contact, ContactInput, ModuleKey } from '../types/business';

type ContactRow = {
  id: string;
  module_key: ModuleKey;
  full_name: string;
  phone: string;
  email: string;
  dni: string | null;
  birth_date: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

const DATABASE_NAME = 'atec.db';
const WEB_STORAGE_KEY = 'atec.contacts.v1';

let initialized = false;

function createId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function rowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    moduleKey: row.module_key,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    dni: row.dni ?? '',
    birthDate: row.birth_date ?? '',
    notes: row.notes ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getDatabase() {
  const SQLite = await import('expo-sqlite');
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

async function ensureNativeDatabase() {
  if (initialized) return;

  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY NOT NULL,
      module_key TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      dni TEXT,
      birth_date TEXT,
      notes TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contacts_module_key ON contacts(module_key);
  `);
  initialized = true;
}

function readWebContacts(): Contact[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(WEB_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Contact[];
  } catch {
    return [];
  }
}

function writeWebContacts(contacts: Contact[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(contacts));
}

export async function listContacts(moduleKey: ModuleKey): Promise<Contact[]> {
  if (Platform.OS === 'web') {
    return readWebContacts()
      .filter((contact) => contact.moduleKey === moduleKey)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  await ensureNativeDatabase();
  const db = await getDatabase();
  const rows = await db.getAllAsync<ContactRow>(
    'SELECT * FROM contacts WHERE module_key = ? ORDER BY full_name COLLATE NOCASE ASC',
    moduleKey
  );
  return rows.map(rowToContact);
}

export async function createContact(moduleKey: ModuleKey, input: ContactInput): Promise<Contact> {
  const timestamp = nowIso();
  const contact: Contact = {
    id: createId(),
    moduleKey,
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (Platform.OS === 'web') {
    writeWebContacts([...readWebContacts(), contact]);
    return contact;
  }

  await ensureNativeDatabase();
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO contacts (
      id, module_key, full_name, phone, email, dni, birth_date, notes, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    contact.id,
    contact.moduleKey,
    contact.fullName,
    contact.phone,
    contact.email,
    contact.dni ?? '',
    contact.birthDate ?? '',
    contact.notes ?? '',
    contact.status,
    contact.createdAt,
    contact.updatedAt
  );

  return contact;
}

export async function updateContact(contactId: string, input: ContactInput): Promise<void> {
  const timestamp = nowIso();

  if (Platform.OS === 'web') {
    writeWebContacts(
      readWebContacts().map((contact) =>
        contact.id === contactId ? { ...contact, ...input, updatedAt: timestamp } : contact
      )
    );
    return;
  }

  await ensureNativeDatabase();
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE contacts
      SET full_name = ?, phone = ?, email = ?, dni = ?, birth_date = ?, notes = ?, status = ?, updated_at = ?
      WHERE id = ?`,
    input.fullName,
    input.phone,
    input.email,
    input.dni ?? '',
    input.birthDate ?? '',
    input.notes ?? '',
    input.status,
    timestamp,
    contactId
  );
}
