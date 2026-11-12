import { test, expect } from "@playwright/test";
import { CURATED, CATEGORIES } from "../js/palettes.js";
import { FP } from "../js/data.js";

test("every curated palette has a unique stable ID", () => {
  const ids = CURATED.map(p => p.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toEqual(CURATED.map((_, i) => `pm-${String(i + 1).padStart(3, "0")}`));
});

test("curated palettes contain valid colors, categories and font pairs", () => {
  for (const palette of CURATED) {
    expect(palette.c.length, palette.name).toBeGreaterThanOrEqual(3);
    expect(palette.c.length, palette.name).toBeLessThanOrEqual(5);
    for (const color of palette.c) expect(color, palette.name).toMatch(/^#[0-9A-F]{6}$/);
    expect(CATEGORIES).toContain(palette.category);
    expect(palette.fonts).toHaveLength(2);
    expect(palette.fonts[0]).toBeTruthy();
    expect(palette.fonts[1]).toBeTruthy();
    expect(palette.moods.length).toBeGreaterThan(0);
  }
});

test("curated palettes do not duplicate a color combination", () => {
  const keys = CURATED.map(p => [...p.c].sort().join("|"));
  expect(new Set(keys).size).toBe(keys.length);
});

test("curated font pairs exist in the font-pair data", () => {
  const allowedFonts = new Set(FP.flat());
  for (const p of CURATED) {
    expect(allowedFonts.has(p.fonts[0]), `${p.name} heading font`).toBe(true);
    expect(allowedFonts.has(p.fonts[1]), `${p.name} body font`).toBe(true);
  }
});
