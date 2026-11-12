import { test, expect } from "@playwright/test";

test("application loads without uncaught page errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#grid .card").first()).toBeVisible();
  await expect(page.locator("#hero")).toBeVisible();
  expect(errors).toEqual([]);
});

test("curated gallery renders a substantial collection", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#grid .card")).toHaveCount(60);
});

test("hero actions navigate to the expected app areas", async ({ page }) => {
  await page.goto("/");
  await page.locator("#heroGen").click();
  await expect(page.locator("#grid .card")).toHaveCount(12);
  await expect(page.locator("#filters [data-src='generated']")).toHaveAttribute("aria-pressed", "true");
});
