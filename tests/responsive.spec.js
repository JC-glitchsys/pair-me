import { test, expect } from "@playwright/test";

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`layout remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#grid .card").first()).toBeVisible();
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(metrics.page, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(metrics.viewport + 1);
  });
}

test("modal can be used on a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.locator("#grid .card").first().click();
  await expect(page.locator("#modal [role='dialog']")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
});
