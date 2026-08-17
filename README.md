# Órtesis Center — Catálogo Digital

App web (PWA-ready) para catálogo de órtesis, alimentada por Google Sheets y con
selección de productos para enviar por WhatsApp. Sin backend: 100% archivos
estáticos, lista para GitHub Pages.

## 📁 Estructura

```
ortesis-app/
├── index.html          → estructura de las 3 pantallas (Inicio, Catálogo, Compartir)
├── css/style.css        → estilos
├── js/config.js          → 👉 AQUÍ CONECTAS TUS DATOS REALES
├── js/mock-data.js       → datos de muestra (solo para probar)
├── js/app.js            → lógica de la app
└── images/               → aquí subes las fotos de los productos
```

## 🚀 Puesta en marcha (5 pasos)

### 1. Prueba la app tal cual está
Abre `index.html` en el navegador (o súbela a GitHub Pages) — ya funciona
con datos de muestra (`USE_MOCK_DATA: true` en `config.js`), para que veas
el comportamiento completo: zonas, categorías, selección y envío a WhatsApp.

### 2. Publica tu Google Sheet como CSV (una vez por cada pestaña)
En tu Sheet:
1. Haz clic en la pestaña **Miembro Superior** para activarla.
2. `Archivo → Compartir → Publicar en la web`.
3. En el desplegable elige **"Miembro Superior"** (no "Todo el documento").
4. Formato: **Valores separados por comas (.csv)**.
5. Clic en **Publicar**, copia el enlace.
6. Repite con **Miembro Inferior** y **Tronco, Cuello y Cabeza**.

> ⚠️ Importante: cualquier persona con el enlace podrá leer esos datos (no
> editarlos). No publiques ninguna otra pestaña que tenga información sensible.

### 3. Pega los 3 enlaces en `js/config.js`
```js
SHEET_CSV_URLS: {
  "Miembro Superior": "https://docs.google.com/spreadsheets/d/e/AQUI.../pub?output=csv",
  "Miembro Inferior": "https://docs.google.com/spreadsheets/d/e/AQUI.../pub?output=csv",
  "Tronco, Cuello y Cabeza": "https://docs.google.com/spreadsheets/d/e/AQUI.../pub?output=csv"
}
```
Y cambia:
```js
USE_MOCK_DATA: false,
```

### 4. Configura tu WhatsApp y marca
En el mismo archivo:
```js
WHATSAPP_NUMBER: "584121234567",  // tu número real, sin +, sin espacios
BRAND_NAME: "ÓRTESIS CENTER",
CURRENCY_SYMBOL: "€"
```

### 5. Sube las imágenes
Cada producto necesita una imagen en `images/` con el **mismo nombre que el
código de la columna D** de tu Sheet. Ejemplo: si el código es `AEO-02`, el
archivo debe llamarse `AEO-02.jpg` (o `.png` / `.webp`).

**Recomendación de tamaño:** 800×800px, formato JPG o WebP comprimido,
apuntando a **menos de 120 KB por imagen**. Es nítido en pantalla de móvil
y carga rápido incluso con conexión débil. Si un producto no tiene imagen
todavía, la app muestra automáticamente un ícono de reemplazo — no se rompe
el diseño.

## 🖼️ Imagen de Inicio
En `index.html`, busca el bloque `id="hero-image-slot"` y reemplázalo por tu
imagen de presentación:
```html
<div class="hero-image" style="background-image:url('images/inicio-hero.jpg'); background-size:cover; background-position:center;"></div>
```

## 🌐 Publicar en GitHub Pages
1. Crea un repositorio nuevo y sube todo el contenido de esta carpeta.
2. `Settings → Pages → Deploy from a branch → main / (root)`.
3. En un par de minutos tu app estará en:
   `https://tu-usuario.github.io/tu-repo/`

## ✅ Cómo evita duplicados en la lista de categorías
El campo "Producto de órtesis" (segunda lista desplegable) se genera
automáticamente leyendo la columna **CATEGORÍAS** de la pestaña activa y
eliminando duplicados (`[...new Set(...)]` en `app.js`). Solo necesitas
escribir bien el nombre de la categoría en el Sheet — si lo escribes igual
(misma mayúscula/minúscula y sin espacios extra) en varias filas, en la
lista aparecerá una sola vez agrupando todos esos productos.

## 🛍️ Cómo funciona "Compartir"
No es un carrito de compras — es una guía de selección:
1. El cliente toca **Seleccionar** en los productos que le interesan.
2. Va a la pestaña **Compartir**, revisa/quita productos.
3. Toca **Enviar selección por WhatsApp** → se abre WhatsApp con un
   mensaje pre-armado (código, nombre y precio de cada producto) dirigido
   al número configurado en `WHATSAPP_NUMBER`, listo para que el vendedor
   cierre la venta directamente.

## 🎨 Sobre alojar imágenes/datos en otra plataforma
GitHub Pages es la opción correcta aquí: es gratis, no requiere backend,
y esta app ya está construida 100% estática pensando en eso. Si más adelante
tu catálogo crece mucho (cientos de productos con fotos), puedes migrar las
imágenes a un bucket de Cloudflare R2 o similar sin tocar el resto del
código — solo cambiarías `IMAGE_BASE_PATH` en `config.js`.
