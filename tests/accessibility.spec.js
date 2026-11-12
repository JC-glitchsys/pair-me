import { test, expect } from "@playwright/test";

test("search toggle exposes expanded state and focuses search", async ({ page }) => {
  await page.goto("/");
  await page.locator("#sTog").click();
  await expect(page.locator("#sTog")).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#q")).toBeFocused();
});

test("modal traps Tab focus at its boundaries", async ({ page }) => {
  await page.goto("/");
  await page.locator("#grid .card").first().click();
  const dialog = page.locator("#modal [role='dialog']");
  await expect(dialog).toBeVisible();
  const buttons = dialog.locator("button");
  const first = buttons.first();
  const last = buttons.last();
  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
});

test("generate settings panel closes on Escape and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  await expect(page.locator("#gpanel")).not.toHaveClass(/hidden/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#gpanel")).toHaveClass(/hidden/);
  await expect(page.locator("#gset")).toBeFocused();
});
