# Bear Tab Dimmer 🐻💡

Bear Tab Dimmer es una extensión de Chrome que permite ajustar el brillo de las pestañas para reducir el cansancio visual.

## 🚀 Instalación y Uso

1. **Clona el repositorio**
   ```sh
   git clone https://github.com/dfralan/bear-tab-dimmer.git
   cd bear-tab-dimmer
   ```

2. **Generar el archivo ZIP para distribución**
   ```sh
   npm run build-zip
   ```
   Esto creará `main.zip` dentro de la carpeta `dist/`, con el contenido de `src/` listo para subir a la Chrome Web Store.

3. **Cargar la extensión en Chrome**
   - Abre `chrome://extensions/` en el navegador.
   - Activa el **Modo Desarrollador**.
   - Haz clic en **Cargar descomprimida** y selecciona la carpeta `src/`.

## 📜 Scripts disponibles

- `npm run zip` → Genera `main.zip` en `dist/` con el contenido de `src/`.
- `npm run build-zip` → Ejecuta el script anterior.

## 📂 Estructura del proyecto
```
Bear-Tab-Dimmer/
│── src/            # Archivos de la extensión
│── dist/           # Se generará main.zip aquí
│── scripts/
│   ├── build-zip.js
│── package.json
│── README.md
```

## 📌 Notas
- No se requiere compilación (`build`), ya que la extensión funciona con archivos planos de `src/`.
- El ZIP se genera automáticamente dentro de `dist/` para facilitar la distribución.

## 📜 Licencia
Este proyecto está bajo la licencia MIT. ¡Usalo y mejoralo a gusto! 🚀

