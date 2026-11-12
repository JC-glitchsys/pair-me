import { test, expect } from "@playwright/test";
import { fmt } from "../js/export.js";

const palette = {
  name: "Test Palette", category: "Pastel", moods: ["Calm"],
  c: ["#112233", "#AABBCC", "#FFFFFF"],
  fonts: ["Playfair Display", "Inter"]
};

test("CSS export contains color variables and font families", () => {
  const out = fmt(palette, "css");
  expect(out).toContain("--color-1: #112233");
  expect(out).toContain('--font-heading: "Playfair Display"');
  expect(out).toContain('--font-body: "Inter"');
});

test("Tailwind export contains valid palette values and font names", () => {
  const out = fmt(palette, "tailwind");
  expect(out).toContain('"test-palette"');
  expect(out).toContain('1: "#112233"');
  expect(out).toContain('heading: ["Playfair Display", "serif"]');
});

test("JSON export is parseable and preserves palette data", () => {
  const out = JSON.parse(fmt(palette, "json"));
  expect(out.name).toBe(palette.name);
  expect(out.colors).toEqual(palette.c);
  expect(out.fonts).toEqual({ heading: "Playfair Display", body: "Inter" });
});

test("PNG action creates a downloadable image preview", async ({ page }) => {
  await page.goto("/");
  await page.locator("#grid .card").first().click();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#mDl").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^pair-me-.*\.png$/);
  await expect(page.locator("#pv")).not.toHaveClass(/hidden/);
  await expect(page.locator("#pv img")).toBeVisible();
});
