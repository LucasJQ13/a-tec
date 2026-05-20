# Compilar A-Tec con Android Studio

Esta guía es para compilar en casa sin EAS. La carpeta `android/` se genera cuando hace falta y no se versiona en Git.

## 1. Requisitos

- Instalar Node.js LTS.
- Instalar Git.
- Instalar Android Studio.
- Instalar JDK 17. Android Studio normalmente lo incluye.
- Clonar o actualizar el repositorio:

```bash
git pull origin main
npm install
```

## 2. Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://rfshphvtduzjnfsfkyny.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
EXPO_PUBLIC_CONTACTS_CREATED_BY=Lucas
```

No subir `.env.local` a GitHub.

## 3. Verificaciones previas

```bash
node --version
npm --version
npm run typecheck
npx expo export --platform android --clear
```

## 4. Generar carpeta Android

```bash
npx expo prebuild --platform android --clean
```

Esto crea `android/`.

## 5. Abrir en Android Studio

1. Abrir Android Studio.
2. Elegir `Open`.
3. Seleccionar la carpeta `android/`.
4. Esperar la sincronización de Gradle.

## 6. Generar APK debug

Desde Android Studio:

- `Build`
- `Build Bundle(s) / APK(s)`
- `Build APK(s)`

Ubicación esperada:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

APK debug sirve para pruebas internas.

## 7. Generar APK release

Para distribución real se necesita firma. No guardar keystores ni claves dentro del repositorio.

Desde Android Studio:

- `Build`
- `Generate Signed Bundle / APK`
- Elegir `APK`
- Crear o seleccionar keystore privado
- Elegir variante `release`

Ubicación esperada:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## Errores comunes

- Si falla Gradle, ejecutar `npm install` y volver a correr `npx expo prebuild --platform android --clean`.
- Si faltan variables de Supabase, revisar `.env.local`.
- Si Android Studio pide SDK, instalar el SDK recomendado desde `SDK Manager`.
- Si aparece error de Java, verificar que Android Studio use JDK 17.
