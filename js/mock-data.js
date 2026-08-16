/* =========================================================
   DATOS DE MUESTRA
   Solo se usan si CONFIG.USE_MOCK_DATA = true en config.js
   Tienen la MISMA estructura de columnas que tu Google Sheet,
   para que el cambio a datos reales sea directo.
   ========================================================= */

const MOCK_DATA = {
  "Miembro Superior": [
    { item: 1, categoria: "Férulas para dedos y manos", marca: "MedFlex", codigo: "FM-01", descripcion: "Férula de Muñeca Ajustable", precio: 45, stock: 12, estatus: "Disponible", uso: "Estabilización postraumática de muñeca" },
    { item: 2, categoria: "Férulas para dedos y manos", marca: "MedFlex", codigo: "FD-02", descripcion: "Férula Digital para Dedo en Martillo", precio: 18, stock: 30, estatus: "Disponible", uso: "Inmovilización de falange distal" },
    { item: 3, categoria: "Soportes de Codo", marca: "OrthoPro", codigo: "SC-03", descripcion: "Codera para Epicondilitis", precio: 32, stock: 20, estatus: "Disponible", uso: "Codo de tenista / golfista" },
    { item: 4, categoria: "Soportes de Hombro", marca: "OrthoPro", codigo: "SH-04", descripcion: "Inmovilizador de Hombro y Brazo", precio: 58, stock: 8, estatus: "Disponible", uso: "Post-cirugía de hombro" }
  ],
  "Miembro Inferior": [
    { item: 1, categoria: "Rodillera Articulada", marca: "BioSupport", codigo: "RD-01", descripcion: "Rodillera Deportiva Acolchada", precio: 85, stock: 15, estatus: "Disponible", uso: "Soporte deportivo flexible" },
    { item: 2, categoria: "Ortesis de Tobillo (AEO)", marca: "BioSupport", codigo: "AEO-02", descripcion: "AEO Estabilizador de Tobillo", precio: 65, stock: 10, estatus: "Disponible", uso: "Prevención de esguinces" },
    { item: 3, categoria: "Férula de Pie/Tobillo (AFO)", marca: "OrthoPro", codigo: "AFO-03", descripcion: "Férula de Rodilla Articulada", precio: 140, stock: 6, estatus: "Disponible", uso: "Control de flexo-extensión" },
    { item: 4, categoria: "Ortesis de Tobillo (AEO)", marca: "MedFlex", codigo: "OW-04", descripcion: "Ortesis Walker (Bota)", precio: 195, stock: 4, estatus: "Disponible", uso: "Inmovilización rígida de tobillo/pie" },
    { item: 5, categoria: "Soporte de Cadera", marca: "BioSupport", codigo: "SC-05", descripcion: "Soporte de Cadera Postquirúrgico", precio: 175, stock: 0, estatus: "Agotado", uso: "Post-cirugía de cadera" }
  ],
  "Tronco, Cuello y Cabeza": [
    { item: 1, categoria: "Collarines Cervicales", marca: "MedFlex", codigo: "CC-01", descripcion: "Collarín Cervical Rígido", precio: 40, stock: 18, estatus: "Disponible", uso: "Inmovilización cervical" },
    { item: 2, categoria: "Corsés y Fajas Lumbares", marca: "OrthoPro", codigo: "FL-02", descripcion: "Faja Lumbar con Soporte Rígido", precio: 55, stock: 22, estatus: "Disponible", uso: "Dolor lumbar y hernias" },
    { item: 3, categoria: "Corsés y Fajas Lumbares", marca: "BioSupport", codigo: "CD-03", descripcion: "Corsé Dorsolumbar", precio: 120, stock: 5, estatus: "Disponible", uso: "Escoliosis / postura" }
  ]
};
