import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useContacts } from '../hooks/useContacts';
import type { Contact, ContactInput, ModuleFeatureConfig } from '../types/business';

type ContactManagerProps = {
  config: ModuleFeatureConfig;
};

const emptyInput: ContactInput = {
  fullName: '',
  phone: '',
  email: '',
  dni: '',
  birthDate: '',
  notes: '',
  status: 'active',
};

function inputFromContact(contact: Contact): ContactInput {
  return {
    fullName: contact.fullName,
    phone: contact.phone,
    email: contact.email,
    dni: contact.dni ?? '',
    birthDate: contact.birthDate ?? '',
    notes: contact.notes ?? '',
    status: contact.status,
  };
}

export function ContactManager({ config }: ContactManagerProps) {
  const { error, filteredContacts, loading, query, refresh, saveContact, setQuery, source } = useContacts(
    config.moduleKey
  );
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactInput>(emptyInput);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => form.fullName.trim().length > 1, [form.fullName]);

  const openCreate = () => {
    setSelectedContact(null);
    setEditingContact(null);
    setForm(emptyInput);
    setFormOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setEditingContact(contact);
    setForm(inputFromContact(contact));
    setFormOpen(true);
  };

  const handleChange = (key: keyof ContactInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      await saveContact(
        {
          ...form,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          dni: form.dni?.trim(),
          birthDate: form.birthDate?.trim(),
          notes: form.notes?.trim(),
        },
        editingContact?.id
      );
      setFormOpen(false);
      setEditingContact(null);
      setForm(emptyInput);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: config.colors.background }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[styles.sectionTitle, { color: config.colors.text }]}>
            {config.labels.contactsLabel}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: config.colors.muted }]}>
            {source === 'supabase' ? 'Sincronizado con Supabase' : 'Modo local con reintento disponible'}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={openCreate}
          style={[styles.primaryButton, { backgroundColor: config.colors.primary }]}
        >
          <Text style={styles.primaryButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBox, { backgroundColor: config.colors.surface, borderColor: config.colors.border }]}>
        <TextInput
          placeholder={`Buscar ${config.labels.contactLabel.toLowerCase()}`}
          placeholderTextColor={config.colors.muted}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { color: config.colors.text }]}
        />
      </View>

      {error ? (
        <View style={[styles.errorBox, { borderColor: config.colors.border }]}>
          <View style={styles.errorCopy}>
            <Text style={[styles.errorTitle, { color: config.colors.text }]}>Sincronizacion pendiente</Text>
            <Text style={[styles.errorText, { color: config.colors.muted }]}>{error}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={refresh}
            style={[styles.retryButton, { backgroundColor: config.colors.primary }]}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {formOpen ? (
        <View style={[styles.formCard, { backgroundColor: config.colors.surface, borderColor: config.colors.border }]}>
          <Text style={[styles.formTitle, { color: config.colors.text }]}>
            {editingContact ? `Editar ${config.labels.contactLabel}` : `Nuevo ${config.labels.contactLabel}`}
          </Text>

          <Field
            label="Nombre completo"
            value={form.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            colors={config.colors}
          />
          <Field
            label="Teléfono"
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            colors={config.colors}
          />
          <Field
            label="Email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            colors={config.colors}
          />
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Field
                label="DNI opcional"
                value={form.dni ?? ''}
                onChangeText={(value) => handleChange('dni', value)}
                colors={config.colors}
              />
            </View>
            <View style={styles.column}>
              <Field
                label="Nacimiento opcional"
                value={form.birthDate ?? ''}
                onChangeText={(value) => handleChange('birthDate', value)}
                colors={config.colors}
              />
            </View>
          </View>
          <Field
            label="Observaciones"
            value={form.notes ?? ''}
            onChangeText={(value) => handleChange('notes', value)}
            colors={config.colors}
            multiline
          />

          <View style={styles.statusRow}>
            {(['active', 'inactive'] as const).map((status) => {
              const active = form.status === status;
              return (
                <TouchableOpacity
                  activeOpacity={0.82}
                  key={status}
                  onPress={() => setForm((current) => ({ ...current, status }))}
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: active ? config.colors.primary : config.colors.surface,
                      borderColor: config.colors.primary,
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: active ? '#ffffff' : config.colors.primary }]}>
                    {status === 'active' ? 'Activo' : 'Inactivo'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setFormOpen(false)}
              style={[styles.secondaryButton, { borderColor: config.colors.border }]}
            >
              <Text style={[styles.secondaryButtonText, { color: config.colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={handleSave}
              style={[
                styles.saveButton,
                { backgroundColor: canSave ? config.colors.primary : config.colors.muted },
              ]}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Guardando' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} nestedScrollEnabled>
        {loading ? (
          <Text style={[styles.emptyText, { color: config.colors.muted }]}>Cargando...</Text>
        ) : null}

        {!loading && filteredContacts.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor: config.colors.border }]}>
            <Text style={[styles.emptyTitle, { color: config.colors.text }]}>
              Sin {config.labels.contactsLabel.toLowerCase()} cargados
            </Text>
            <Text style={[styles.emptyText, { color: config.colors.muted }]}>
              Crea el primer registro para empezar a usar el modulo.
            </Text>
          </View>
        ) : null}

        {filteredContacts.map((contact) => {
          const selected = selectedContact?.id === contact.id;
          return (
            <TouchableOpacity
              activeOpacity={0.86}
              key={contact.id}
              onPress={() => setSelectedContact(selected ? null : contact)}
              style={[
                styles.contactCard,
                { backgroundColor: config.colors.surface, borderColor: config.colors.border },
              ]}
            >
              <View style={styles.contactTop}>
                <View style={[styles.initials, { backgroundColor: config.colors.primary }]}>
                  <Text style={styles.initialsText}>{contact.fullName.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={styles.contactCopy}>
                  <Text style={[styles.contactName, { color: config.colors.text }]} numberOfLines={1}>
                    {contact.fullName}
                  </Text>
                  <Text style={[styles.contactMeta, { color: config.colors.muted }]} numberOfLines={1}>
                    {contact.phone || contact.email || 'Sin contacto cargado'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.stateBadge,
                    { backgroundColor: contact.status === 'active' ? config.colors.primary : config.colors.muted },
                  ]}
                >
                  <Text style={styles.stateBadgeText}>{contact.status === 'active' ? 'Activo' : 'Inactivo'}</Text>
                </View>
              </View>

              {selected ? (
                <View style={styles.detailBlock}>
                  <DetailLine label="Email" value={contact.email || '-'} colors={config.colors} />
                  <DetailLine label="DNI" value={contact.dni || '-'} colors={config.colors} />
                  <DetailLine label="Nacimiento" value={contact.birthDate || '-'} colors={config.colors} />
                  <DetailLine label="Obs." value={contact.notes || '-'} colors={config.colors} />
                  <TouchableOpacity
                    activeOpacity={0.84}
                    onPress={() => openEdit(contact)}
                    style={[styles.editButton, { backgroundColor: config.colors.primary }]}
                  >
                    <Text style={styles.editButtonText}>Editar {config.labels.contactLabel}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: ModuleFeatureConfig['colors'];
  multiline?: boolean;
};

function Field({ label, value, onChangeText, colors, multiline }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        style={[
          styles.input,
          multiline ? styles.multilineInput : null,
          { backgroundColor: colors.background, borderColor: colors.border, color: colors.text },
        ]}
      />
    </View>
  );
}

function DetailLine({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ModuleFeatureConfig['colors'];
}) {
  return (
    <View style={styles.detailLine}>
      <Text style={[styles.detailLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  searchBox: {
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
  },
  searchInput: {
    fontSize: 14,
    fontWeight: '700',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
  },
  errorCopy: {
    flex: 1,
    paddingRight: 10,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: 14,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  field: {
    marginTop: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  multilineInput: {
    minHeight: 82,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '900',
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  list: {
    marginTop: 16,
    maxHeight: 560,
  },
  listContent: {
    paddingBottom: 18,
  },
  emptyCard: {
    borderRadius: 22,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 6,
  },
  contactCard: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  contactTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  initials: {
    alignItems: 'center',
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  initialsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  contactCopy: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '900',
  },
  contactMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  stateBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  stateBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  detailBlock: {
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 12,
  },
  detailLine: {
    flexDirection: 'row',
    marginTop: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '900',
    width: 92,
  },
  detailValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  editButton: {
    alignItems: 'center',
    borderRadius: 18,
    marginTop: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
});
