import { test, expect } from "@playwright/test";
import { openFirstPalette } from "./helpers.js";

test("palette modal opens and closes with focus restoration", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#grid .card").first();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#modal [role='dialog']")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("#modal")).toHaveClass(/hidden/);
  await expect(card).toBeFocused();
});

test("each color can be locked and unlocked", async ({ page }) => {
  await page.goto("/");
  const dialog = await openFirstPalette(page);
  const lock = dialog.locator("[data-lock]").first();
  await lock.click();
  await expect(dialog.locator("[data-lock]").first()).toHaveAttribute("aria-pressed", "true");
  await dialog.locator("[data-lock]").first().click();
  await expect(dialog.locator("[data-lock]").first()).toHaveAttribute("aria-pressed", "false");
});

test("modal exposes copy, regenerate, save and export actions", async ({ page }) => {
  await page.goto("/");
  const dialog = await openFirstPalette(page);
  for (const id of ["mRe", "mCp", "mDl", "mSh", "mFp", "mSv"]) {
    await expect(dialog.locator(`#${id}`)).toBeVisible();
  }
});

test("design previews render four labeled SVG examples", async ({ page }) => {
  await page.goto("/");
  const dialog = await openFirstPalette(page);
  await dialog.locator("#mFp").click();
  await expect(dialog.locator("#prev")).toBeVisible();
  await expect(dialog.locator("#prev svg")).toHaveCount(4);
  for (const label of ["Mobile UI", "Website hero", "Comic panel", "Dashboard"]) {
    await expect(dialog.locator("#prev")).toContainText(label);
  }
});

test("Escape closes the modal", async ({ page }) => {
  await page.goto("/");
  await openFirstPalette(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("#modal")).toHaveClass(/hidden/);
});
