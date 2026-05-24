# Compilar A-Tec con Android Studio

Esta guía es para probar la app en un celular Android usando la carpeta nativa local `android/`.

## 1. Requisitos

- Node.js LTS.
- Git.
- Android Studio.
- JDK 17.
- Android SDK instalado desde Android Studio.

Desde la raíz del proyecto:

```bash
git pull origin main
npm install
```

## 2. Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
EXPO_PUBLIC_CONTACTS_CREATED_BY=Lucas
```

No subir `.env.local` a GitHub.

## 3. Verificaciones previas

```bash
npm run typecheck
npm run android:export
```

Si `android/` todavía no existe o querés regenerarla:

```bash
npm run android:prebuild
```

Si necesitás regenerarla desde cero:

```bash
npm run android:prebuild:clean
```

## 4. Configuración nativa recomendada

Para pruebas locales en celular, A-Tec queda preparada con:

- Hermes activado.
- New Architecture desactivada.
- Formateadores de fecha, hora y moneda sin dependencia obligatoria de `Intl`.
- Package Android: `com.canavidezquiroga.atec`.
- Internet permission habilitado para Supabase.

Esto reduce cierres al arranque en APKs generados manualmente desde Android Studio.

## 5. Abrir en Android Studio

1. Abrir Android Studio.
2. Elegir `Open`.
3. Seleccionar `B:\ATec APP\android`.
4. Esperar la sincronización de Gradle.
5. Usar JDK 17 en Gradle si Android Studio lo solicita.

## 6. Generar APK debug

Desde consola:

```bash
npm run android:debug
```

Ubicación esperada:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Desde Android Studio:

- `Build`
- `Build Bundle(s) / APK(s)`
- `Build APK(s)`

## 7. Generar APK release local

Para una prueba local:

```bash
npm run android:release
```

Ubicación esperada:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Para distribución real se necesita una keystore propia. No guardar keystores ni claves dentro del repositorio.

## 8. Si el APK se cierra al abrir

Conectar el celular por USB, activar depuración USB y ejecutar:

```bash
adb devices
adb logcat -c
adb logcat AndroidRuntime:E ReactNativeJS:E ReactNative:E Expo:E *:S
```

Abrí la app en el celular y copiá las líneas que aparezcan después del cierre. El error real suele estar en `AndroidRuntime` o `ReactNativeJS`.

También podés probar instalar debug desde consola:

```bash
cd android
gradlew.bat :app:installDebug
```

## 9. Limpieza si Android Studio queda con caché vieja

```bash
cd android
gradlew.bat clean
```

Luego volver a compilar `debug` o `release`.
