import { test, expect } from "@playwright/test";

test("saved palette survives reload", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#grid .card").first();
  const name = (await card.locator(".font-bold").first().innerText()).trim();
  await card.locator("[data-save]").click();
  await expect(page.locator("[data-save]").first()).toContainText(/Saved|Save/);
  await page.reload();
  await page.locator("#tabSaved").click();
  await expect(page.locator("#grid .card")).toContainText(name);
});

test("legacy pm_saved storage is migrated", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pm_saved", JSON.stringify([{
      id: "legacy-1", name: "Legacy Palette", c: ["#112233", "#445566", "#778899"],
      fonts: ["Inter", "Inter"], l: [false, false, false], category: "Pastel"
    }]));
  });
  await page.goto("/");
  const migrated = await page.evaluate(() => ({
    current: localStorage.getItem("pairme_saved_v2"),
    legacy: localStorage.getItem("pm_saved")
  }));
  expect(migrated.current).not.toBeNull();
  expect(migrated.legacy).toBeNull();
  expect(JSON.parse(migrated.current)[0].name).toBe("Legacy Palette");
});

test("corrupt saved JSON does not crash initial rendering", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("pairme_saved_v2", "{broken"));
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("#grid .card").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("duplicate saved IDs are deduplicated on load", async ({ page }) => {
  const palette = {
    id: "duplicate-1", name: "Duplicate Test", c: ["#112233", "#445566", "#778899"],
    fonts: ["Inter", "Inter"], l: [false, false, false], category: "Pastel"
  };
  await page.addInitScript(p => {
    localStorage.setItem("pairme_saved_v2", JSON.stringify([p, { ...p, name: "Duplicate Copy" }]));
  }, palette);
  await page.goto("/");
  await page.locator("#tabSaved").click();
  await expect(page.locator("#grid .card")).toHaveCount(1);
});
