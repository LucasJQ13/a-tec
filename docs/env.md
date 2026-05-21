# Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto. No subirlo a GitHub.

```text
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
EXPO_PUBLIC_CONTACTS_CREATED_BY=family-device
```

La app lee estas variables desde `process.env` y desde `expo-constants` mediante `app.config.ts`.

Después de crear o cambiar `.env.local`, reiniciar Expo con caché limpia:

```powershell
npm run dev:localhost
```
