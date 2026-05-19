# Scripts de desarrollo A-Tec

Estos scripts estan pensados para Windows y evitan depender de scripts de PowerShell.

## Levantar la app en localhost

```cmd
scripts\start-localhost.cmd
```

Abre Expo Web en:

```text
http://localhost:8083
```

## Levantar Expo para probar en celular

```cmd
scripts\start-expo-mobile.cmd
```

Pasos:

1. Instalar Expo Go en el celular.
2. Conectar la PC y el celular a la misma red WiFi.
3. Ejecutar el script.
4. Escanear el QR que muestra Expo.

Si el celular no conecta por red local, abrir el menu de Expo en la terminal y cambiar a modo tunnel.
