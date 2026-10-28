// Copia los archivos de la app a la carpeta "www", que es la que se mete dentro del APK.
// No hace falta ejecutarlo a mano: "npm run sync" y el workflow de GitHub ya lo hacen.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const salida = join(raiz, 'www');

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

// Archivos sueltos y carpetas que usa la app (sw.js NO va: el APK no necesita service worker)
for (const archivo of ['index.html', 'manifest.json']) {
  cpSync(join(raiz, archivo), join(salida, archivo));
}
for (const carpeta of ['vendor', 'icons']) {
  if (existsSync(join(raiz, carpeta))) {
    cpSync(join(raiz, carpeta), join(salida, carpeta), { recursive: true });
  }
}
console.log('✔ Carpeta www lista');
