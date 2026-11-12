import { test, expect } from "@playwright/test";

test("search input is visible and keyboard accessible", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("textbox", { name: "Search palettes" });
  await expect(search).toBeVisible();
  await search.focus();
  await expect(search).toBeFocused();
});

test("mobile search toggle expands the search field when the toggle is available", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.locator("#sTog");

  // Some responsive layouts keep the search input visible and hide the toggle.
  // Only test the toggle interaction on viewports where it is actually rendered.
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#q")).toBeFocused();
  } else {
    await expect(page.locator("#q")).toBeVisible();
  }
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
  const trigger = page.locator("#gset");
  await trigger.click();
  await expect(page.locator("#gpanel")).not.toHaveClass(/hidden/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#gpanel")).toHaveClass(/hidden/);
  await expect(trigger).toBeFocused();
});
