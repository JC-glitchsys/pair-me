import { test, expect } from "@playwright/test";

test("Generate creates twelve palettes with valid 2–5 color counts", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  for (const count of [2, 3, 4, 5]) {
    await page.locator(`#gpanel [data-gc='${count}']`).click();
    await page.locator("#gpanel [data-gg]").click();
    await expect(page.locator("#grid .card")).toHaveCount(12);
    const lengths = await page.locator("#grid .card").evaluateAll(cards =>
      cards.map(card => card.querySelectorAll("[data-hex]").length)
    );
    expect(lengths.every(n => n === count)).toBe(true);
    await page.locator("#gset").click();
  }
});

test("custom base color is retained in generated palettes", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  await page.locator("#gBase").fill("#123456");
  await page.locator("#gpanel [data-gg]").click();
  const colors = await page.locator("#grid .card [data-hex]").evaluateAll(nodes => nodes.map(n => n.dataset.hex));
  expect(colors).toContain("#123456");
});

test("all harmony controls can be selected without crashing", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  for (const mode of ["any", "analogous", "complementary", "triadic", "split", "tetradic", "mono"]) {
    await page.locator(`#gpanel [data-gh='${mode}']`).click();
    await expect(page.locator(`#gpanel [data-gh='${mode}']`)).toHaveAttribute("aria-pressed", "true");
  }
});

test("pastel-only toggle can be enabled and disabled", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gset").click();
  const pastel = page.locator("#gpanel [data-gp]");
  await pastel.click();
  await expect(pastel).toHaveAttribute("aria-pressed", "true");
  await pastel.click();
  await expect(pastel).toHaveAttribute("aria-pressed", "false");
});
