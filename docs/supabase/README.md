# Supabase - contactos sincronizados

Este bloque sincroniza la entidad generica `contacts`.

Visualmente se muestra como:

- Kinesiología: Pacientes
- Electricidad: Clientes
- Imprenta: Clientes

## Variables locales

Crear un archivo `.env.local` en la raíz del proyecto:

```text
EXPO_PUBLIC_SUPABASE_URL=https://rfshphvtduzjnfsfkyny.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
EXPO_PUBLIC_CONTACTS_CREATED_BY=family-device
```

El archivo `.env.local` no se sube a GitHub.

## Crear tabla

Abrir Supabase SQL Editor y ejecutar:

```text
docs/supabase/contacts.sql
```

La tabla se llama:

```text
public.contacts
```

## Seguridad de esta etapa

Como todavía no hay login, las políticas RLS permiten lectura, alta y edición con la publishable key.
Esto sirve para un MVP familiar controlado.

Cuando se agregue login para Lucas y Fernanda, estas politicas deben reemplazarse por reglas basadas en usuarios autenticados.
