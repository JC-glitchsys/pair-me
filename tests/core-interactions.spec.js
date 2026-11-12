import { test, expect } from "@playwright/test";
import { openGenerated, waitForSearch } from "./helpers.js";

test("Generate creates a generated palette collection", async ({ page }) => {
  await page.goto("/");
  await openGenerated(page);
  await expect(page.locator("#filters [data-src='generated']")).toHaveAttribute("aria-pressed", "true");
});

test("Save adds a palette to the Saved tab", async ({ page }) => {
  await page.goto("/");
  const first = page.locator("#grid .card").first();
  const name = await first.locator(".font-bold").first().innerText();
  await first.locator("[data-save]").click();
  await page.locator("#tabSaved").click();
  await expect(page.locator("#grid .card")).toContainText(name);
});

test("Unsave removes a palette from the Saved tab", async ({ page }) => {
  await page.goto("/");
  await page.locator("#grid .card").first().locator("[data-save]").click();
  await page.locator("#tabSaved").click();
  await expect(page.locator("#grid .card")).toHaveCount(1);
  await page.locator("#grid .card").first().locator("[data-save]").click();
  await expect(page.locator("#grid .card")).toHaveCount(0);
  await expect(page.locator("#empty")).not.toHaveClass(/hidden/);
});

test("Shuffle Fonts keeps generated cards valid", async ({ page }) => {
  await page.goto("/");
  await openGenerated(page);
  const before = await page.locator("#grid .card").count();
  await page.locator("#filters [data-fonts]").click();
  await expect(page.locator("#grid .card")).toHaveCount(before);
  const labels = await page.locator("#grid .card .text-xs").allTextContents();
  expect(labels.every(Boolean)).toBe(true);
});

test("HEX swatch interaction copies the selected color", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const swatch = page.locator("#grid .card [data-hex]").first();
  const hex = await swatch.getAttribute("data-hex");
  await swatch.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(hex);
});

test("color count controls generate exactly the selected number of swatches", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  for (const count of [2, 3, 4, 5]) {
    await page.locator(`#gpanel [data-gc='${count}']`).click();
    await page.locator("#gpanel [data-gg]").click();
    const counts = await page.locator("#grid .card").evaluateAll(cards =>
      cards.map(c => c.querySelectorAll("[data-hex]").length)
    );
    expect(counts.every(n => n === count)).toBe(true);
    if (count !== 5) await page.locator("#gset").click();
  }
});

test("search filters by a palette name", async ({ page }) => {
  await page.goto("/");
  await page.locator("#sTog").click();
  const name = (await page.locator("#grid .card").first().locator(".font-bold").first().innerText()).trim();
  await page.locator("#q").fill(name);
  await waitForSearch(page);
  await expect(page.locator("#grid .card:visible")).toHaveCount(1);
  await expect(page.locator("#grid .card:visible")).toContainText(name);
});
