import { test, expect } from "@playwright/test";
import { MOODS, moodsOf } from "../js/mood.js";

test("mood vocabulary contains the expected unique labels", () => {
  expect(MOODS).toHaveLength(11);
  expect(new Set(MOODS).size).toBe(MOODS.length);
});

test("mood engine always returns known labels for curated palettes", async () => {
  const { CURATED } = await import("../js/palettes.js");
  for (const p of CURATED) {
    const moods = moodsOf(p.c);
    expect(moods.length, p.name).toBeGreaterThan(0);
    for (const mood of moods) expect(MOODS).toContain(mood);
  }
});

test("neutral and grayscale palettes safely fall back to Calm", () => {
  expect(moodsOf(["#FFFFFF", "#808080", "#000000"])).toContain("Calm");
});

test("single-color and multi-color palettes return arrays", () => {
  expect(Array.isArray(moodsOf(["#FFC8DD"]))).toBe(true);
  expect(Array.isArray(moodsOf(["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"]))).toBe(true);
});

// Invalid input behavior is deliberately recorded as a contract test.
// If you later add input validation, change this test to assert your chosen safe result.
test("malformed hex text currently falls back to Calm", () => {
  expect(moodsOf(["not-a-hex"])).toEqual(["Calm"]);
});
