
import { test, expect } from '@playwright/test';

const URL = 'https://jc-glitchsys.github.io/pair-me/';

test.describe('Pair Me - Functional Testing v2', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('.card');
  });

  // 1. GENERATE: Verify colors actually change
  test('1. Generate creates new colors', async ({ page }) => {
    const firstCard = page.locator('.card').first();

    const before = await firstCard
      .locator('[data-hex]')
      .allTextContents();

    await page.locator('#gen').click();
    await page.waitForTimeout(500);

    const after = await page.locator('.card').first()
      .locator('[data-hex]')
      .allTextContents();

    console.log('BEFORE:', before);
    console.log('AFTER:', after);

    expect(after).not.toEqual(before);
  });

  // 2. SAVE: Verify palette gets saved
  test('2. Save palette', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const saveButton = firstCard.locator('[data-save]');

    await saveButton.click();

    await expect(saveButton).toHaveAttribute(
      'aria-label',
      /^Unsave /
    );

    console.log('Palette saved successfully!');
  });

  // 3. SAVED TAB: Verify saved palettes appear
  test('3. Saved palettes appear in Saved tab', async ({ page }) => {
    await page.locator('.card').first()
      .locator('[data-save]').click();

    await page.locator('#tabSaved').click();

    await expect(page.locator('.card').first()).toBeVisible();

    console.log(
      'Saved palettes:',
      await page.locator('.card').count()
    );
  });

  // 4. UNSAVE: Verify palette gets removed
  test('4. Unsave removes palette', async ({ page }) => {
    await page.locator('.card').first()
      .locator('[data-save]').click();

    await page.locator('#tabSaved').click();

    await expect(page.locator('.card')).toHaveCount(1);

    await page.locator('.card').first()
      .locator('[data-save]').click();

    await expect(page.locator('.card'))
      .toHaveCount(0);

    await expect(page.locator('#empty'))
      .not.toHaveClass(/hidden/);

    console.log('Palette successfully removed!');
  });

  // 5. SHUFFLE FONTS: Verify font pairings change
  test('5. Shuffle Fonts changes pairings', async ({ page }) => {
    await page.locator('#gen').click();

    const before = await page.locator('.card .text-xs')
      .allTextContents();

    await page.locator('[data-fonts]').click();
    await page.waitForTimeout(300);

    const after = await page.locator('.card .text-xs')
      .allTextContents();

    console.log('FONTS BEFORE:', before);
    console.log('FONTS AFTER:', after);

    expect(after).not.toEqual(before);
  });

  // 6. HEX COPY: Verify copied color
  test('6. HEX code copies correctly', async ({ page, context }) => {
    await context.grantPermissions([
      'clipboard-read',
      'clipboard-write'
    ]);

    const hexElement = page.locator('[data-hex]').first();
    const expectedHex = await hexElement.getAttribute('data-hex');

    await hexElement.click();

    await expect.poll(async () => {
      return page.evaluate(() => navigator.clipboard.readText());
    }).toBe(expectedHex);

    console.log('COPIED HEX:', expectedHex);
  });

  // 7. FILTERS: Verify 2-5 colors work
  test('7. Color count filters generate correct palettes', async ({ page }) => {
    for (const count of [2, 3, 4, 5]) {

      await page.locator('#gset').click();

      await page.locator(`[data-gc="${count}"]`).click();

      await page.locator('[data-gg]').click();

      await page.waitForSelector('.card');

      const actualCount = await page.locator('.card')
        .first()
        .locator('[data-hex]')
        .count();

      console.log(`Expected: ${count}, Actual: ${actualCount}`);

      expect(actualCount).toBe(count);
    }
  });

  // 8. SEARCH: Verify matching results
  test('8. Search finds matching palettes', async ({ page }) => {
    const firstCard = page.locator('.card').first();

    const name = await firstCard
      .locator('.font-bold')
      .innerText();

    const keyword = name.split(' ')[0];

    await page.locator('#q').fill(keyword);
    await page.waitForTimeout(400);

    const results = page.locator('.card:visible');

    const resultCount = await results.count();

    console.log('SEARCH:', keyword);
    console.log('RESULT COUNT:', resultCount);

    expect(resultCount).toBeGreaterThan(0);

    const matching = await results.allInnerTexts();

    expect(matching.some(text =>
      text.toLowerCase().includes(keyword.toLowerCase())
    )).toBeTruthy();
  });

});
