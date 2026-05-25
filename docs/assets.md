# Assets e identidad visual A-Tec

Colocar todos los archivos en `B:\ATec APP\assets`.

## Archivos obligatorios

| Uso | Ruta exacta | Formato | Tamaño recomendado | Transparencia |
| --- | --- | --- | --- | --- |
| Icono APK / launcher | `assets/icon.png` | PNG | 1024 x 1024 px | No |
| Icono adaptativo Android | `assets/adaptive-icon.png` | PNG | 1024 x 1024 px | Sí, fondo transparente |
| Splash/loading | `assets/splash-icon.png` | PNG | 1024 x 1024 px | Sí |
| Favicon web | `assets/favicon.png` | PNG | 48 x 48 px | Sí |
| Logo principal app | `assets/logo-atec.png` | PNG | 1200 x 400 px | Sí |
| Logo Electricidad | `assets/logo-electricidad.png` | PNG | 1024 x 1024 px | Sí |
| Logo Kinesiología | `assets/logo-kinesiologia.png` | PNG | 1024 x 1024 px | Sí |
| Logo Imprenta | `assets/logo-imprenta.png` | PNG | 1024 x 1024 px | Sí |
| Avatar Lucas | `assets/avatar-lucas.png` | PNG/JPG | 512 x 512 px | Opcional |
| Avatar Fernanda | `assets/avatar-fernanda.png` | PNG/JPG | 512 x 512 px | Opcional |

## Recomendaciones visuales

- Usar PNG para logos con transparencia.
- Evitar archivos mayores a 1 MB para iconos internos.
- Mantener margen interno del 12 al 18% en `icon.png` y `adaptive-icon.png`.
- Para splash usar logo centrado, fondo transparente y sin texto pequeño.
- Los logos de módulos deben verse bien en tamaño chico dentro de tarjetas.

## Cambiar icono APK

1. Reemplazar `assets/icon.png`.
2. Reemplazar `assets/adaptive-icon.png`.
3. Abrir Android Studio y sincronizar/compilar manualmente.

## Cambiar splash screen

1. Reemplazar `assets/splash-icon.png`.
2. Verificar que `app.config.ts` apunte a `./assets/splash-icon.png`.
3. Abrir Android Studio y compilar manualmente.

## Fotos de perfil en Supabase Storage

Bucket recomendado: `profile-photos`.

Rutas internas:

- Lucas: `profile-photos/lucas/avatar.jpg`
- Fernanda: `profile-photos/fernanda/avatar.jpg`

Tamaño recomendado:

- 512 x 512 px
- JPG o PNG
- Menos de 500 KB

La app puede seleccionar una imagen desde el celular y subirla al bucket si las políticas de Storage lo permiten.
