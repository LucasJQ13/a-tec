import { useCallback, useEffect, useMemo, useState } from 'react';
import { createContact, listContacts, updateContact } from '../storage/contactRepository';
import type { Contact, ContactInput, ModuleKey } from '../types/business';

export function useContacts(moduleKey: ModuleKey) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setContacts(await listContacts(moduleKey));
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
      if (contactId) {
        await updateContact(contactId, input);
      } else {
        await createContact(moduleKey, input);
      }
      await refresh();
    },
    [moduleKey, refresh]
  );

  return {
    contacts,
    filteredContacts,
    loading,
    query,
    refresh,
    saveContact,
    setQuery,
  };
}
