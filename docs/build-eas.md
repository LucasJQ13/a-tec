# Compilar A-Tec con Expo/EAS el 01/06

EAS queda preparado para usar cuando vuelva a estar disponible el cupo mensual.

## 1. Login

```bash
npx eas login
```

## 2. Verificar configuración

El archivo `eas.json` contiene perfiles:

- `development`: APK con development client.
- `preview`: APK interna para instalar y probar.
- `production`: Android App Bundle para Play Store.

## 3. Variables de entorno

Configurar en Expo/EAS o tenerlas disponibles localmente:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://rfshphvtduzjnfsfkyny.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
EXPO_PUBLIC_CONTACTS_CREATED_BY=Lucas
```

## 4. Comando recomendado para prueba

```bash
npx eas build -p android --profile preview
```

Ese perfil genera un APK para prueba interna.

## 5. Descargar APK

Cuando EAS termine, mostrará un enlace de descarga. También se puede entrar al dashboard de Expo y descargar el artifact desde el build correspondiente.

## 6. Si falla

- Correr `npm run typecheck`.
- Correr `npx expo export --platform android --clear`.
- Revisar que `.env.local` o secrets de EAS estén correctos.
- Revisar que `app.json` tenga `android.package`.
- Si falla por dependencias nativas, correr `npx expo doctor`.
