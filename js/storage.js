const STORAGE_KEY = "pm_saved";

function normalizePalette(palette) {
  if (!palette || typeof palette !== "object") return null;
  // Migrate palettes created by the original Pair Me version.
  const colors = Array.isArray(palette.colors) ? palette.colors : palette.c;
  const locks = Array.isArray(palette.locks) ? palette.locks : palette.l;
  if (!Array.isArray(colors) || !colors.length) return null;
  return {
    id: palette.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: palette.name || "Saved Palette",
    colors: colors.map((color) => String(color).toUpperCase()),
    locks: Array.isArray(locks) ? colors.map((_, index) => Boolean(locks[index])) : colors.map(() => false),
    fontIndex: Number.isInteger(palette.fontIndex) ? palette.fontIndex : Number.isInteger(palette.f) ? palette.f : 0,
    height: Number.isFinite(palette.height) ? palette.height : Number.isFinite(palette.h) ? palette.h : 220,
  };
}

export function loadSavedPalettes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    const seen = new Set();
    return parsed.map(normalizePalette).filter((palette) => {
      if (!palette) return false;
      const signature = palette.colors.join("|");
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
  } catch {
    return [];
  }
}

export function savePalettes(palettes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    return true;
  } catch {
    return false;
  }
}
