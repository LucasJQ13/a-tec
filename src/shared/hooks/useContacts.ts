import { useCallback, useEffect, useMemo, useState } from 'react';
import { listContacts, saveContact as saveSyncedContact, type ContactSource } from '../services/contactService';
import type { Contact, ContactInput, ModuleKey } from '../types/business';

export function useContacts(moduleKey: ModuleKey) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<ContactSource>('local');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listContacts(moduleKey);
      setContacts(result.contacts);
      setSource(result.source);
      setError(result.warning ?? null);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'No se pudieron cargar los contactos.');
    } finally {
      setLoading(false);
    }
  }, [moduleKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contacts;

    return contacts.filter((contact) => {
      return [contact.fullName, contact.phone, contact.email, contact.dni ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [contacts, query]);

  const saveContact = useCallback(
    async (input: ContactInput, contactId?: string) => {
      const result = await saveSyncedContact(moduleKey, input, contactId);
      setSource(result.source);
      setError(result.warning ?? null);
      await refresh();
    },
    [moduleKey, refresh]
  );

  return {
    contacts,
    error,
    filteredContacts,
    loading,
    query,
    refresh,
    saveContact,
    setQuery,
    source,
  };
}
