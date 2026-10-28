# My AntBank

App de ahorros hormiga. Funciona como página web (GitHub Pages) y como **APK de Android**.

## Carpetas

| Qué | Dónde |
|---|---|
| La app (pantallas y lógica) | `index.html` |
| Firebase y confeti guardados dentro del proyecto | `vendor/` |
| Íconos de la app | `icons/` (el dibujo original está en `icons/icon-source.svg`) |
| Proyecto de Android (generado con Capacitor) | `android/` |
| Receta para construir el APK en GitHub | `build-apk.yml` (hay que activarla, ver abajo) |

## Activar la construcción automática del APK (un solo paso manual)

Las herramientas con las que Claude edita este proyecto no pueden escribir dentro de la carpeta `.github`,
así que la receta quedó en el archivo `build-apk.yml` (en esta misma carpeta). Para activarla:

1. Entra a tu repositorio en github.com → **Add file → Create new file**.
2. En el nombre escribe exactamente `.github/workflows/build-apk.yml` (al escribir las `/` se crean las carpetas).
3. Pega todo el contenido de `build-apk.yml` y pulsa **Commit changes**.
4. Después puedes borrar el `build-apk.yml` suelto de la raíz.

## Cómo sacar un APK nuevo después de cambiar `index.html`

1. Sube tus cambios a GitHub (rama `main`).
2. En GitHub entra a la pestaña **Actions** → **Construir APK** (se ejecuta sola; también puedes pulsar *Run workflow*).
3. Cuando termine (unos minutos), abre esa ejecución y descarga **MyAntBank-apk** (abajo, en *Artifacts*). Dentro está el `.apk`.
4. Pásalo al celular e instálalo (hay que permitir "instalar apps de origen desconocido").

### Para que cada APK nuevo se instale encima del anterior (sin desinstalar)

Todos los APK deben estar firmados con la **misma llave**. Guarda la llave en GitHub una sola vez:
*Settings → Secrets and variables → Actions → New repository secret*, y crea estos cuatro:

- `ANTBANK_KEYSTORE_BASE64`: el archivo `antbank-release.keystore` convertido a texto base64
- `ANTBANK_KEYSTORE_PASSWORD`: la contraseña
- `ANTBANK_KEY_ALIAS`: `antbank`
- `ANTBANK_KEY_PASSWORD`: la misma contraseña

Sin esos secretos el APK se construye igual, pero con una llave de pruebas distinta cada vez; para instalar una versión nueva tendrías que desinstalar la anterior primero.

> La llave (`*.keystore`) y su contraseña **no deben subirse al repositorio** (ya están en `.gitignore`).

## Nombre e ícono del APK

- Nombre: `android/app/src/main/res/values/strings.xml` y `capacitor.config.json`.
- Ícono: `android/app/src/main/res/mipmap-*` y `icons/`.
