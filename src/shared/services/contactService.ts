import {
  createContact as createLocalContact,
  listContacts as listLocalContacts,
  updateContact as updateLocalContact,
} from '../storage/contactRepository';
import type { Contact, ContactInput, ModuleKey } from '../types/business';
import { contactsCreatedBy, isSupabaseConfigured, supabase } from './supabaseClient';

type ContactRemoteRow = {
  id: string;
  module_type: ModuleKey;
  display_label: 'paciente' | 'cliente';
  full_name: string;
  phone: string | null;
  email: string | null;
  dni: string | null;
  birth_date: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactSource = 'supabase' | 'local';

export type ContactServiceResult = {
  contacts: Contact[];
  source: ContactSource;
  warning?: string;
};

function createId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function displayLabelForModule(moduleKey: ModuleKey): 'paciente' | 'cliente' {
  return moduleKey === 'kinesiologia' ? 'paciente' : 'cliente';
}

function remoteToContact(row: ContactRemoteRow): Contact {
  return {
    id: row.id,
    moduleKey: row.module_type,
    fullName: row.full_name,
    phone: row.phone ?? '',
    email: row.email ?? '',
    dni: row.dni ?? '',
    birthDate: row.birth_date ?? '',
    notes: row.notes ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRemote(moduleKey: ModuleKey, input: ContactInput, id?: string) {
  const timestamp = nowIso();

  return {
    id: id ?? createId(),
    module_type: moduleKey,
    display_label: displayLabelForModule(moduleKey),
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    dni: input.dni ?? '',
    birth_date: input.birthDate ?? '',
    notes: input.notes ?? '',
    status: input.status,
    created_by: contactsCreatedBy,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

function connectionWarning(error: unknown) {
  if (error instanceof Error) {
    return `Supabase no disponible: ${error.message}`;
  }
  return 'Supabase no disponible. Usando datos locales de este dispositivo.';
}

async function listRemoteContacts(moduleKey: ModuleKey): Promise<Contact[]> {
  if (!supabase) {
    throw new Error('Faltan variables de entorno de Supabase.');
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('module_type', moduleKey)
    .order('full_name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => remoteToContact(row as ContactRemoteRow));
}

async function createRemoteContact(moduleKey: ModuleKey, input: ContactInput): Promise<Contact> {
  if (!supabase) {
    throw new Error('Faltan variables de entorno de Supabase.');
  }

  const payload = inputToRemote(moduleKey, input);
  const { data, error } = await supabase.from('contacts').insert(payload).select('*').single();

  if (error) throw new Error(error.message);
  return remoteToContact(data as ContactRemoteRow);
}

async function updateRemoteContact(contactId: string, input: ContactInput): Promise<void> {
  if (!supabase) {
    throw new Error('Faltan variables de entorno de Supabase.');
  }

  const { error } = await supabase
    .from('contacts')
    .update({
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      dni: input.dni ?? '',
      birth_date: input.birthDate ?? '',
      notes: input.notes ?? '',
      status: input.status,
      updated_at: nowIso(),
    })
    .eq('id', contactId);

  if (error) throw new Error(error.message);
}

export async function listContacts(moduleKey: ModuleKey): Promise<ContactServiceResult> {
  if (!isSupabaseConfigured) {
    return {
      contacts: await listLocalContacts(moduleKey),
      source: 'local',
      warning: 'Configura Supabase para sincronizar entre celulares.',
    };
  }

  try {
    return {
      contacts: await listRemoteContacts(moduleKey),
      source: 'supabase',
    };
  } catch (error) {
    return {
      contacts: await listLocalContacts(moduleKey),
      source: 'local',
      warning: connectionWarning(error),
    };
  }
}

export async function saveContact(
  moduleKey: ModuleKey,
  input: ContactInput,
  contactId?: string
): Promise<{ source: ContactSource; warning?: string }> {
  if (!isSupabaseConfigured) {
    if (contactId) {
      await updateLocalContact(contactId, input);
    } else {
      await createLocalContact(moduleKey, input);
    }
    return { source: 'local', warning: 'Guardado solo localmente. Configura Supabase para sincronizar.' };
  }

  try {
    if (contactId) {
      await updateRemoteContact(contactId, input);
    } else {
      await createRemoteContact(moduleKey, input);
    }
    return { source: 'supabase' };
  } catch (error) {
    if (contactId) {
      await updateLocalContact(contactId, input);
    } else {
      await createLocalContact(moduleKey, input);
    }
    return { source: 'local', warning: `${connectionWarning(error)} Guardado solo en este dispositivo.` };
  }
}
