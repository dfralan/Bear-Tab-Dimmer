const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const srcFolder = "src";  // Carpeta con los archivos de la extensión
const outputFolder = "dist"; // Carpeta donde se guardará main.zip
const zipFilename = "main.zip";
const zipPath = path.join(outputFolder, zipFilename);

// 📌 Asegurar que "dist" existe
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// 📌 Eliminar el ZIP anterior si existe dentro de "dist"
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// 📌 Crear el ZIP con los archivos de "src"
const zip = new AdmZip();
zip.addLocalFolder(srcFolder);
zip.writeZip(zipPath);

console.log(`✅ Archivo "${zipFilename}" generado en "${outputFolder}/".`);
