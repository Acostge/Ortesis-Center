/* =========================================================
   ÓRTESIS CENTER — Lógica de la app
   ========================================================= */

const state = {
  zonas: Object.keys(CONFIG.SHEET_CSV_URLS), // orden = orden de las pestañas
  productosPorZona: {},   // { "Miembro Superior": [ {...}, ... ], ... }
  zonaActual: "",
  categoriaActual: "",
  seleccionados: new Map() // codigo -> producto
};

/* ---------------- ARRANQUE ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("brand-name-text").innerHTML =
    `${CONFIG.BRAND_NAME.split(" ")[0]} <span>${CONFIG.BRAND_NAME.split(" ").slice(1).join(" ")}</span>`;

  setupNav();
  setupZonaSelect();
  setupCategoriaSelect();
  cargarTodasLasZonas();
  cargarImagenInicio();
});

/* ---------------- IMAGEN DE INICIO (automática) ---------------- */
function cargarImagenInicio(extIndex = 0) {
  if (extIndex >= CONFIG.IMAGE_EXTENSIONS.length) return; // no se encontró, se queda el texto de ayuda
  const ext = CONFIG.IMAGE_EXTENSIONS[extIndex];
  const src = `${CONFIG.IMAGE_BASE_PATH}${CONFIG.HERO_IMAGE_NAME}.${ext}`;
  const img = new Image();
  img.onload = () => {
    const slot = document.getElementById("hero-image-slot");
    slot.style.backgroundImage = `url('${src}')`;
    slot.style.backgroundSize = "cover";
    slot.style.backgroundPosition = "center";
    const note = document.getElementById("hero-placeholder-note");
    if (note) note.style.display = "none";
  };
  img.onerror = () => cargarImagenInicio(extIndex + 1);
  img.src = src;
}

/* ---------------- NAVEGACIÓN ---------------- */
function setupNav() {
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
  });
  document.querySelectorAll("[data-goto]").forEach(el => {
    el.addEventListener("click", () => goToView(el.dataset.goto));
  });
}

function goToView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${viewName}`).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === viewName));
  if (viewName === "compartir") renderSelection();
}

/* ---------------- CARGA DE DATOS ---------------- */
function cargarTodasLasZonas() {
  if (CONFIG.USE_MOCK_DATA) {
    state.productosPorZona = MOCK_DATA;
    return;
  }
  state.zonas.forEach(zona => {
    const url = CONFIG.SHEET_CSV_URLS[zona];
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        state.productosPorZona[zona] = results.data.map(normalizarFila).filter(p => p.codigo);
        if (zona === state.zonaActual) renderProductGrid();
      },
      error: (err) => {
        console.error(`No se pudo cargar la pestaña "${zona}":`, err);
        state.productosPorZona[zona] = [];
      }
    });
  });
}

// Convierte una fila cruda del CSV (encabezados en español, con acentos)
// al mismo formato que usan los datos de muestra.
function normalizarFila(row) {
  const get = (keys) => {
    for (const k of Object.keys(row)) {
      const norm = k.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (keys.includes(norm)) return (row[k] || "").toString().trim();
    }
    return "";
  };
  return {
    item: get(["item"]),
    categoria: get(["categorias", "categoria"]),
    marca: get(["marca"]),
    codigo: get(["codigo"]),
    descripcion: get(["descripcion"]),
    precio: parseFloat(get(["precio"]).replace(",", ".")) || 0,
    stock: parseInt(get(["stock"])) || 0,
    estatus: get(["estatus"]) || "Disponible",
    uso: get(["uso"])
  };
}

/* ---------------- SELECT: ZONA ANATÓMICA ---------------- */
function setupZonaSelect() {
  const select = document.getElementById("select-zona");
  state.zonas.forEach(zona => {
    const opt = document.createElement("option");
    opt.value = zona;
    opt.textContent = zona;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    state.zonaActual = select.value;
    state.categoriaActual = "";
    poblarCategorias();
    const catSelect = document.getElementById("select-categoria");
    catSelect.disabled = !state.zonaActual;
    renderProductGrid();
  });
}

/* ---------------- SELECT: CATEGORÍA (sin duplicados) ---------------- */
function setupCategoriaSelect() {
  document.getElementById("select-categoria").addEventListener("change", (e) => {
    state.categoriaActual = e.target.value;
    renderProductGrid();
  });
}

function poblarCategorias() {
  const select = document.getElementById("select-categoria");
  select.innerHTML = `<option value="">Todas las categorías</option>`;
  const productos = state.productosPorZona[state.zonaActual] || [];
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

/* ---------------- RENDER: GRID DE PRODUCTOS ---------------- */
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  const countEl = document.getElementById("results-count");
  grid.innerHTML = "";

  if (!state.zonaActual) {
    countEl.textContent = "";
    grid.innerHTML = emptyStateHTML("Selecciona una zona anatómica para ver los productos disponibles.");
    return;
  }

  let productos = state.productosPorZona[state.zonaActual] || [];
  if (state.categoriaActual) {
    productos = productos.filter(p => p.categoria === state.categoriaActual);
  }

  countEl.textContent = `${productos.length} producto${productos.length === 1 ? "" : "s"} encontrado${productos.length === 1 ? "" : "s"}`;

  if (productos.length === 0) {
    grid.innerHTML = emptyStateHTML("No hay productos cargados en esta categoría todavía.");
    return;
  }

  productos.forEach(p => grid.appendChild(productCardEl(p)));
}

function emptyStateHTML(msg) {
  return `<div class="empty-state" style="grid-column:1/-1;">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <div>${msg}</div>
  </div>`;
}

function productCardEl(p) {
  const disponible = (p.estatus || "").toLowerCase().includes("dispon") && p.stock !== 0;
  const isSelected = state.seleccionados.has(p.codigo);

  const card = document.createElement("div");
  card.className = "product-card" + (disponible ? "" : " out-of-stock");
  card.innerHTML = `
    ${!disponible ? `<span class="stock-badge">Agotado</span>` : ""}
    <div class="product-image">${imageOrPlaceholder(p)}</div>
    <div class="product-info">
      <span class="product-name">${p.descripcion || "Sin nombre"}</span>
      <span class="product-code">REF. ${p.codigo}${p.marca ? " · " + p.marca : ""}</span>
      ${p.uso ? `<span class="product-uso">${p.uso}</span>` : ""}
      <div class="product-bottom-row">
        ${estatusBadgeHTML(p, disponible)}
        <span class="product-price">${CONFIG.CURRENCY_SYMBOL}${p.precio.toFixed(2)}</span>
      </div>
      <button class="select-btn ${isSelected ? "selected" : ""}" ${disponible ? "" : "disabled"}>
        ${isSelected ? "Seleccionado ✓" : "Seleccionar"}
      </button>
    </div>
  `;
  card.querySelector(".select-btn").addEventListener("click", () => toggleSeleccion(p));
  return card;
}

function estatusBadgeHTML(p, disponible) {
  const texto = disponible ? "Disponible" : (p.estatus || "Agotado");
  const clase = disponible ? "estatus-disponible" : "estatus-agotado";
  return `<span class="estatus-badge ${clase}">${texto}</span>`;
}

function imageOrPlaceholder(p) {
  const id = `img-${p.codigo}`;
  setTimeout(() => tryLoadImage(id, p.codigo), 0);
  return `<span id="${id}">${placeholderIconSVG()}</span>`;
}

function placeholderIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;
}

// Intenta cargar images/{codigo}.{ext} probando las extensiones configuradas.
function tryLoadImage(elId, codigo, extIndex = 0) {
  const el = document.getElementById(elId);
  if (!el || extIndex >= CONFIG.IMAGE_EXTENSIONS.length) return;
  const ext = CONFIG.IMAGE_EXTENSIONS[extIndex];
  const img = new Image();
  img.onload = () => { if (el) el.innerHTML = `<img src="${img.src}" alt="${codigo}">`; };
  img.onerror = () => tryLoadImage(elId, codigo, extIndex + 1);
  img.src = `${CONFIG.IMAGE_BASE_PATH}${codigo}.${ext}`;
}

/* ---------------- SELECCIÓN (para compartir) ---------------- */
function toggleSeleccion(p) {
  if (state.seleccionados.has(p.codigo)) {
    state.seleccionados.delete(p.codigo);
  } else {
    state.seleccionados.set(p.codigo, p);
  }
  renderProductGrid();
  updateNavBadge();
}

function updateNavBadge() {
  const badge = document.getElementById("nav-badge");
  const count = state.seleccionados.size;
  badge.style.display = count > 0 ? "flex" : "none";
  badge.textContent = count;
}

/* ---------------- VISTA: COMPARTIR ---------------- */
function renderSelection() {
  const container = document.getElementById("selection-container");
  const items = [...state.seleccionados.values()];

  if (items.length === 0) {
    container.innerHTML = emptyStateHTML("Aún no has seleccionado productos. Ve al catálogo y toca \"Seleccionar\" en lo que te interese.");
    return;
  }

  const total = items.reduce((sum, p) => sum + p.precio, 0);

  container.innerHTML = `
    <div class="selection-list">
      ${items.map(p => `
        <div class="selection-item" data-codigo="${p.codigo}">
          <div class="product-image" id="sel-img-${p.codigo}">${placeholderIconSVG()}</div>
          <div class="selection-item-info">
            <div class="name">${p.descripcion}</div>
            <div class="meta">Cód. ${p.codigo} · ${CONFIG.CURRENCY_SYMBOL}${p.precio.toFixed(2)}</div>
          </div>
          <button class="remove-btn" data-codigo="${p.codigo}">&times;</button>
        </div>
      `).join("")}
    </div>

    <div class="summary-bar">
      <span class="label">${items.length} producto${items.length === 1 ? "" : "s"} seleccionado${items.length === 1 ? "" : "s"}</span>
      <span class="total">${CONFIG.CURRENCY_SYMBOL}${total.toFixed(2)}</span>
    </div>

    <button class="whatsapp-btn" id="whatsapp-send-btn">
      <svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1s-.7.9-.9 1-.3.2-.6.1a7.7 7.7 0 0 1-2.2-1.4 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.8-2.1-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.1 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>
      Enviar selección por WhatsApp
    </button>
  `;

  items.forEach(p => tryLoadImage(`sel-img-${p.codigo}`, p.codigo));

  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.seleccionados.delete(btn.dataset.codigo);
      renderSelection();
      updateNavBadge();
      renderProductGrid();
    });
  });

  document.getElementById("whatsapp-send-btn").addEventListener("click", enviarPorWhatsapp);
}

function enviarPorWhatsapp() {
  const items = [...state.seleccionados.values()];
  if (items.length === 0) return;

  let mensaje = `${CONFIG.WHATSAPP_INTRO_MESSAGE}\n\n`;
  items.forEach((p, i) => {
    mensaje += `${i + 1}. ${p.descripcion} (Cód. ${p.codigo}) — ${CONFIG.CURRENCY_SYMBOL}${p.precio.toFixed(2)}\n`;
  });
  const total = items.reduce((sum, p) => sum + p.precio, 0);
  mensaje += `\nTotal referencial: ${CONFIG.CURRENCY_SYMBOL}${total.toFixed(2)}`;

  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
