import { expect } from "@playwright/test";

export async function openFirstPalette(page) {
  const firstCard = page.locator("#grid .card").first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();
  await expect(page.locator("#modal [role='dialog']")).toBeVisible();
  return page.locator("#modal [role='dialog']");
}

export async function openGenerated(page) {
  await page.locator("#gen").click();
  await expect(page.locator("#grid .card")).toHaveCount(12);
}

export async function visibleCards(page) {
  return page.locator("#grid .card:visible").count();
}

export async function waitForSearch(page) {
  await page.waitForTimeout(300);
}
