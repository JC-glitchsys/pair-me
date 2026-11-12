import { test, expect } from "@playwright/test";
import { openFirstPalette } from "./helpers.js";

test("Share Link copies a share URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const dialog = await openFirstPalette(page);
  await dialog.locator("#mSh").click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/#id=pm-\d{3}|#p=/);
});

test("valid curated share hash opens the matching palette", async ({ page }) => {
  await page.goto("/#id=pm-001");
  await expect(page.locator("#modal [role='dialog']")).toBeVisible();
  await expect(page.locator("#modal")).toContainText("Cotton Candy");
});

test("malformed share hash does not crash the app", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/#p=bad-color&f=999&n=Broken");
  await expect(page.locator("#grid .card").first()).toBeVisible();
  expect(errors).toEqual([]);
});
