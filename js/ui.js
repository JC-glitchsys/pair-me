import { FONT_PAIRS } from "./data.js";
import { getUnsplashPhotos } from "./images.js";

export const $ = (id) => document.getElementById(id);

export function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("toast-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("toast-visible"), 1800);
}

export async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied to clipboard");
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const success = document.execCommand("copy");
    field.remove();
    showToast(success ? "Copied to clipboard" : "Unable to copy");
  }
}

export function renderFilters(state) {
  const items = [
    { label: "2 Colors", action: "count", value: 2 },
    { label: "3 Colors", action: "count", value: 3 },
    { label: "4 Colors", action: "count", value: 4 },
    { label: "5 Colors", action: "count", value: 5 },
    { label: "Pastel", action: "pastel" },
    { label: "Shuffle Fonts", action: "fonts" },
  ];
  $("filters").innerHTML = items.map((item) => {
    const active = item.action === "count" ? state.count === item.value
      : item.action === "pastel" && state.pastel;
    return `<button type="button" data-filter="${item.action}" ${item.value ? `data-value="${item.value}"` : ""}
      aria-pressed="${Boolean(active)}"
      class="shrink-0 h-10 rounded-full px-4 text-sm font-semibold transition ${active ? "bg-black text-white" : "bg-[#EFEFEF] text-black hover:bg-[#e2e2e2]"}">${item.label}</button>`;
  }).join("");
}

export function renderGrid(state, palettes, isSaved) {
  const grid = $("grid");
  const fragment = document.createDocumentFragment();
  const html = palettes.map((palette) => {
    const saved = isSaved(palette);
    return `<article class="card group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white ${state.animate ? "fade" : ""}"
      data-card="${palette.id}">
      <button type="button" class="block w-full cursor-pointer text-left" data-open="${palette.id}"
        aria-label="Open ${palette.name} palette">
        <span class="relative flex flex-col" style="height:${palette.height}px">
          ${palette.colors.map((color) => `<span class="palette-swatch flex flex-1 items-end px-3 pb-2" style="background:${color}">
            <span class="card-hex rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-black/80">${color}</span>
          </span>`).join("")}
        </span>
      </button>
      <button type="button" data-save="${palette.id}" aria-label="${saved ? "Unsave" : "Save"} ${palette.name}"
        aria-pressed="${saved}"
        class="absolute right-3 top-3 h-10 rounded-full px-4 text-sm font-semibold text-white shadow-sm transition focus-visible:opacity-100 ${saved ? "bg-black" : "bg-[#E60023] hover:bg-[#ad081b]"}">
        ${saved ? "Saved" : "Save"}
      </button>
      <div class="px-1 pb-1 pt-2">
        <div class="text-sm font-bold">${palette.name}</div>
        <div class="text-xs text-neutral-500">${FONT_PAIRS[palette.fontIndex].join(" + ")}</div>
      </div>
    </article>`;
  }).join("");
  grid.innerHTML = html;
}

export function openPaletteModal(palette, options) {
  const { isSaved, onClose, onChange, onSave, onRegenerate, onDownload } = options;
  const [headingFont, bodyFont] = FONT_PAIRS[palette.fontIndex];
  const modal = $("modal");
  const photos = getUnsplashPhotos(palette.colors, 6);
  let showPhotos = false;

  const render = () => {
    modal.innerHTML = `<div class="modal-panel relative mx-auto my-4 max-w-2xl rounded-3xl bg-white p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button type="button" id="modalClose" class="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFEFEF] text-xl hover:bg-[#e2e2e2]" aria-label="Close palette details">&times;</button>
      <h2 id="modal-title" class="mb-4 pr-12 text-xl font-bold">${palette.name}</h2>
      <div class="flex h-44 overflow-hidden rounded-2xl sm:h-52">
        ${palette.colors.map((color, index) => `<div class="flex min-w-0 flex-1 flex-col items-center justify-between py-3" style="background:${color}">
          <button type="button" data-lock="${index}" aria-label="${palette.locks[index] ? "Unlock" : "Lock"} ${color}" aria-pressed="${palette.locks[index]}"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white">${palette.locks[index]
              ? '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
              : '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0"/></svg>'}</button>
          <button type="button" data-copy="${color}" class="hex-chip rounded-full bg-white/85 px-2.5 py-2 text-xs font-bold text-black shadow-sm" aria-label="Copy ${color}">${color}</button>
        </div>`).join("")}
      </div>
      <section class="mt-6" aria-label="Font pairing preview">
        <p style="font-family:'${headingFont}';font-weight:600" class="text-2xl leading-tight sm:text-3xl">Hello, This is Your Heading</p>
        <p style="font-family:'${bodyFont}'" class="mt-2 text-base text-neutral-700">This is your body text with this palette.</p>
        <p class="mt-3 text-xs text-neutral-500">Heading: ${headingFont} / Body: ${bodyFont}</p>
      </section>
      <div class="mt-6 flex flex-wrap gap-2">
        <button type="button" id="modalRegenerate" class="h-11 rounded-full bg-[#EFEFEF] px-5 text-sm font-semibold hover:bg-[#e2e2e2]">Regenerate</button>
        <button type="button" id="modalCopy" class="h-11 rounded-full bg-[#EFEFEF] px-5 text-sm font-semibold hover:bg-[#e2e2e2]">Copy HEX</button>
        <button type="button" id="modalDownload" class="h-11 rounded-full bg-[#EFEFEF] px-5 text-sm font-semibold hover:bg-[#e2e2e2]">Download Image</button>
        <button type="button" id="modalPictures" aria-expanded="${showPhotos}" class="h-11 rounded-full bg-black px-5 text-sm font-semibold text-white">Find Pictures</button>
        <button type="button" id="modalSave" class="h-11 rounded-full px-5 text-sm font-semibold text-white ${isSaved(palette) ? "bg-black" : "bg-[#E60023]"}">${isSaved(palette) ? "Saved" : "Save"}</button>
      </div>
      ${showPhotos ? `<section class="mt-6" aria-label="Unsplash photo inspiration">
        <div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-semibold">Photo inspiration</h3><a href="https://unsplash.com" target="_blank" rel="noreferrer" class="text-xs text-neutral-500 underline">Photos from Unsplash</a></div>
        <div class="columns-2 gap-4 sm:columns-3">${photos.map((photo) => `<figure class="photo-tile mb-4 overflow-hidden rounded-2xl bg-neutral-100">
          <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" class="min-h-40 w-full"
            onerror="this.onerror=null;this.src=this.dataset.fallback" data-fallback="${photo.fallback}">
        </figure>`).join("")}</div>
      </section>` : ""}
    </div>`;

    modal.querySelector("#modalClose").addEventListener("click", onClose);
    modal.querySelector("#modalRegenerate").addEventListener("click", () => onRegenerate(palette));
    modal.querySelector("#modalCopy").addEventListener("click", () => options.onCopy(palette.colors.join(", ")));
    modal.querySelector("#modalDownload").addEventListener("click", () => onDownload(palette));
    modal.querySelector("#modalPictures").addEventListener("click", () => { showPhotos = !showPhotos; render(); });
    modal.querySelector("#modalSave").addEventListener("click", () => { onSave(palette); render(); });
    modal.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", () => options.onCopy(button.dataset.copy)));
    modal.querySelectorAll("[data-lock]").forEach((button) => button.addEventListener("click", () => {
      palette.locks[Number(button.dataset.lock)] = !palette.locks[Number(button.dataset.lock)];
      onChange(palette);
      render();
    }));
  };

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  render();
  modal.querySelector("#modalClose").focus();
}

export function closeModal(restoreFocus) {
  $("modal").classList.add("hidden");
  $("modal").innerHTML = "";
  document.body.style.overflow = "";
  if (restoreFocus?.isConnected) restoreFocus.focus();
  else $("logo").focus();
}
