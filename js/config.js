/* =========================================================
   CONFIGURACIÓN DE LA APP — ÓRTESIS CENTER
   Edita SOLO este archivo para conectar tus datos reales.
   ========================================================= */

const CONFIG = {

  // ---------------------------------------------------------------
  // 1) MODO DE DATOS
  //    true  = usa los datos de muestra incluidos (para probar la app YA)
  //    false = usa tus 3 links de Google Sheets publicados como CSV
  // ---------------------------------------------------------------
  USE_MOCK_DATA: false,

  // ---------------------------------------------------------------
  // 2) LINKS DE GOOGLE SHEETS (uno por cada pestaña)
  //
  //    Cómo obtenerlos:
  //    a) Abre tu Google Sheet
  //    b) Ve a la pestaña "Miembro Superior" (haz clic en ella para
  //       que quede activa)
  //    c) Archivo → Compartir → Publicar en la web
  //    d) En "Publicar en la web": selecciona la pestaña específica
  //       (NO "Todo el documento") y elige formato "Valores separados
  //       por comas (.csv)"
  //    e) Clic en "Publicar" y copia el link generado aquí abajo
  //    f) Repite para las otras 2 pestañas
  //
  //    El link se ve así:
  //    https://docs.google.com/spreadsheets/d/e/2PACX-xxxxx/pub?gid=123&single=true&output=csv
  // ---------------------------------------------------------------
  SHEET_CSV_URLS: {
    "Miembro Superior":        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVn0tfRfszlZqLlL43O6KsWTzXyaezvTVidtvBgUimBttyghrrxNZ8cVlTfdVL6oLNE4Wou6ZD8RYe/pub?gid=0&single=true&output=csv",
    "Miembro Inferior":        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVn0tfRfszlZqLlL43O6KsWTzXyaezvTVidtvBgUimBttyghrrxNZ8cVlTfdVL6oLNE4Wou6ZD8RYe/pub?gid=769723611&single=true&output=csv",
    "Tronco, Cuello y Cabeza": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVn0tfRfszlZqLlL43O6KsWTzXyaezvTVidtvBgUimBttyghrrxNZ8cVlTfdVL6oLNE4Wou6ZD8RYe/pub?gid=400107604&single=true&output=csv"
  },

  // ---------------------------------------------------------------
  // 3) WHATSAPP DEL VENDEDOR
  //    Formato internacional, SOLO números, sin +, sin espacios.
  //    Ejemplo Venezuela: "584121234567"
  //    Ejemplo España:    "34600123456"
  // ---------------------------------------------------------------
  WHATSAPP_NUMBER: "584123853831",

  // ---------------------------------------------------------------
  // 4) IMÁGENES
  //    Carpeta donde subirás las fotos, nombradas EXACTO como la
  //    columna "CÓDIGO" de tu Sheet. Ej: código "AEO-01" -> images/AEO-01.jpg
  //    Si un producto no tiene imagen aún, se muestra un ícono de reemplazo.
  // ---------------------------------------------------------------
  IMAGE_BASE_PATH: "images/",
  IMAGE_EXTENSIONS: ["jpg", "jpeg", "png", "webp"], // orden de búsqueda

  // ---------------------------------------------------------------
  // 5) MARCA / TEXTOS
  // ---------------------------------------------------------------
  BRAND_NAME: "ÓRTESIS CENTER",
  CURRENCY_SYMBOL: "€",
  WHATSAPP_INTRO_MESSAGE: "Hola, estoy interesado/a en los siguientes productos de Órtesis Center:"
};
