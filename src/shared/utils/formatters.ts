import type { ProfessionalProfile } from '../types/kinesiologia';

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
});

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  currency: 'ARS',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: 'currency',
});

function toDate(value?: Date | string | null) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const isoFromAR = parseDateARToISO(value);
  const normalizedValue = isoFromAR || value;
  const normalized = normalizedValue.length === 10 ? `${normalizedValue}T00:00:00` : normalizedValue;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function slugify(value: string) {
  return normalizeForSearch(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function sanitizeFileName(value: string) {
  return slugify(value) || 'archivo';
}

export function formatDateAR(value?: Date | string | null) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '-';
}

export function isValidDateAR(value?: string | null) {
  if (!value) return false;
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function parseDateARToISO(value?: string | null) {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (!isValidDateAR(trimmed)) return '';

  const [day, month, year] = trimmed.split('/');
  return `${year}-${month}-${day}`;
}

export function formatDateTimeAR(value?: Date | string | null) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : '-';
}

export function formatTimeAR(value?: Date | string | null) {
  if (!value) return '-';
  if (typeof value === 'string' && /^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  const date = toDate(value);
  return date ? timeFormatter.format(date) : '-';
}

export function formatCurrencyARS(amount?: number | string | null) {
  const value = Number(amount ?? 0);
  return currencyFormatter
    .format(Number.isFinite(value) ? value : 0)
    .replace('ARS', '$')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseDateForDatabase(value: Date | string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const trimmed = value.trim();
  return parseDateARToISO(trimmed) || trimmed;
}

export function calculateAgeFromBirthDate(value?: Date | string | null) {
  const birth = toDate(value);
  if (!birth) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function formatProfessionalSignature(
  profile: Pick<ProfessionalProfile, 'matriculaProfesional' | 'nombreCompleto' | 'titulo'>
) {
  return `${profile.titulo} ${profile.nombreCompleto}\nM.P.: ${profile.matriculaProfesional || 'Sin matrícula'}`;
}
