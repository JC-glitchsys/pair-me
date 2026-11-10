import "../css/style.css";
import { FONT_PAIRS, HUE_FAMILIES, INITIAL_PALETTE_COUNT } from "./data.js";
import { createPaletteColors, paletteSignature } from "./color.js";
import { loadSavedPalettes, savePalettes } from "./storage.js";
import { $, showToast, copyText, renderFilters, renderGrid, openPaletteModal, closeModal } from "./ui.js";

const state = {
  count: 3,
  pastel: false,
  tab: "home",
  query: "",
  palettes: [],
  saved: loadSavedPalettes(),
  animate: true,
};

let activePalette = null;
let modalReturnFocus = null;
let searchFrame = 0;

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const randomBetween = (min, max) => min + Math.random() * (max - min);
const makePalette = (lockedColors = [], lockedFlags = []) => {
  const { colors, locks } = createPaletteColors(state.count, state.pastel, lockedColors, lockedFlags);
  const family = randomItem(HUE_FAMILIES);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: randomItem(family.names),
    colors,
    locks,
    fontIndex: Math.floor(Math.random() * FONT_PAIRS.length),
    height: Math.round(randomBetween(175, 290)),
  };
};

const isSaved = (palette) => state.saved.some((item) => paletteSignature(item) === paletteSignature(palette));

function persistSaved() {
  if (!savePalettes(state.saved)) showToast("Storage is full — unable to save");
}

function render() {
  renderFilters(state);
  $("filters").classList.toggle("hidden", state.tab !== "home");
  $("tabSaved").setAttribute("aria-pressed", String(state.tab === "saved"));
  $("tabSaved").classList.toggle("bg-[#EFEFEF]", state.tab === "saved");
  $("tabSaved").classList.toggle("bg-white", state.tab !== "saved");

  const source = state.tab === "home" ? state.palettes : state.saved;
  const query = state.query.trim().toLowerCase().replaceAll("#", "");
  const visible = source.filter((palette) => {
    if (!query) return true;
    const searchable = [palette.name, ...palette.colors, ...FONT_PAIRS[palette.fontIndex]].join(" ").toLowerCase().replaceAll("#", "");
    return searchable.includes(query);
  });

  renderGrid(state, visible, isSaved);
  $("empty").classList.toggle("hidden", visible.length > 0);
  $("empty").textContent = state.tab === "saved"
    ? "No saved palettes match your search."
    : "No palettes match your search.";
  state.animate = false;
}

function generate(carryLocked = false) {
  const locked = carryLocked
    ? state.palettes.flatMap((palette) => palette.colors.filter((_, index) => palette.locks[index])).slice(0, state.count)
    : [];
  const flags = locked.map(() => true);
  state.palettes = Array.from({ length: INITIAL_PALETTE_COUNT }, () => makePalette(locked, flags));
  state.animate = true;
  render();
}

function toggleSave(palette) {
  const signature = paletteSignature(palette);
  const existingIndex = state.saved.findIndex((item) => paletteSignature(item) === signature);
  if (existingIndex >= 0) {
    state.saved.splice(existingIndex, 1);
    showToast("Removed from Saved");
  } else {
    state.saved.unshift(structuredClone(palette));
    showToast("Palette saved");
  }
  persistSaved();
  render();
}

function syncSavedPalette(palette) {
  const index = state.saved.findIndex((item) => item.id === palette.id);
  if (index >= 0) {
    state.saved[index] = structuredClone(palette);
    persistSaved();
  }
}

function openDetails(palette, trigger) {
  activePalette = palette;
  modalReturnFocus = trigger;
  openPaletteModal(palette, {
    isSaved,
    onClose: () => closeModal(modalReturnFocus),
    onChange: syncSavedPalette,
    onSave: toggleSave,
    onRegenerate: regeneratePalette,
    onDownload: downloadPalette,
    onCopy: copyText,
  });
}

function regeneratePalette(palette) {
  const { colors, locks } = createPaletteColors(
    palette.colors.length,
    state.pastel,
    palette.colors,
    palette.locks,
  );
  palette.colors = colors;
  palette.locks = locks;
  syncSavedPalette(palette);
  activePalette = palette;
  openDetails(palette, modalReturnFocus);
  render();
}

function createSvgFallback(color, index) {
  const safe = color.replace("#", "%23");
  const second = ["#F6D7E3", "#DDE7F2", "#DDEBDD", "#F5E5D2"][index % 4];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${safe}"/><stop offset="1" stop-color="${second}"/></linearGradient></defs><rect width="800" height="560" fill="url(%23g)"/><circle cx="220" cy="180" r="130" fill="#fff" opacity=".35"/><path d="M0 430 Q200 300 400 430 T800 430 V560 H0Z" fill="#fff" opacity=".3"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function downloadPalette(palette) {
  const [headingFont, bodyFont] = FONT_PAIRS[palette.fontIndex];
  try {
    await Promise.all([
      document.fonts.load(`600 48px "${headingFont}"`),
      document.fonts.load(`400 26px "${bodyFont}"`),
    ]);
  } catch { /* Use browser fallback fonts if Google Fonts are unavailable. */ }

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const x = 48, y = 48, width = 1104, height = 400;
  const blockWidth = width / palette.colors.length;
  palette.colors.forEach((color, index) => {
    context.fillStyle = color;
    context.fillRect(x + index * blockWidth, y, blockWidth + 1, height);
    context.fillStyle = "rgba(0,0,0,.72)";
    context.font = "600 24px Inter, sans-serif";
    context.fillText(color, x + index * blockWidth + 18, y + height - 24);
  });

  context.fillStyle = "#111";
  context.font = "700 34px Inter, sans-serif";
  context.fillText(palette.name, 56, 520);
  context.font = `600 56px "${headingFont}", serif`;
  context.fillText("Hello, This is Your Heading", 56, 610);
  context.fillStyle = "#444";
  context.font = `400 28px "${bodyFont}", sans-serif`;
  context.fillText("This is your body text with this palette.", 56, 665);
  context.fillStyle = "#767676";
  context.font = "400 22px Inter, sans-serif";
  context.fillText(`${headingFont} + ${bodyFont}`, 56, 730);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    showToast("Could not create image");
    return;
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pair-me-${palette.name.toLowerCase().replace(/\s+/g, "-")}.png`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Palette image downloaded");
}

function trapModalFocus(event) {
  if (event.key !== "Tab" || $("modal").classList.contains("hidden")) return;
  const focusable = [...$("modal").querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

$("grid").addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const palette = [...state.palettes, ...state.saved].find((item) => item.id === saveButton.dataset.save);
    if (palette) toggleSave(palette);
    return;
  }
  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    const palette = [...state.palettes, ...state.saved].find((item) => item.id === openButton.dataset.open);
    if (palette) openDetails(palette, openButton);
  }
});

$("grid").addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open]")) {
    event.preventDefault();
    const palette = [...state.palettes, ...state.saved].find((item) => item.id === event.target.dataset.open);
    if (palette) openDetails(palette, event.target);
  }
});

$("filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  if (button.dataset.filter === "count") {
    state.count = Number(button.dataset.value);
    generate();
  } else if (button.dataset.filter === "pastel") {
    state.pastel = !state.pastel;
    generate();
  } else if (button.dataset.filter === "fonts") {
    state.palettes.forEach((palette) => { palette.fontIndex = Math.floor(Math.random() * FONT_PAIRS.length); });
    render();
  }
});

$("gen").addEventListener("click", () => {
  state.tab = "home";
  generate(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("tabSaved").addEventListener("click", () => {
  state.tab = state.tab === "saved" ? "home" : "saved";
  render();
});
$("logo").addEventListener("click", () => {
  state.tab = "home";
  state.query = "";
  $("q").value = "";
  render();
});
$("q").addEventListener("input", (event) => {
  state.query = event.target.value;
  cancelAnimationFrame(searchFrame);
  searchFrame = requestAnimationFrame(render);
});
$("modal").addEventListener("click", (event) => {
  if (event.target === $("modal")) closeModal(modalReturnFocus);
});
$("pv").addEventListener("click", (event) => {
  if (event.target === $("pv") || event.target.id === "pvx") $("pv").classList.add("hidden");
});
document.addEventListener("keydown", (event) => {
  trapModalFocus(event);
  if (event.key === "Escape") {
    if (!$("pv").classList.contains("hidden")) $("pv").classList.add("hidden");
    else if (!$("modal").classList.contains("hidden")) closeModal(modalReturnFocus);
  }
});

generate();
