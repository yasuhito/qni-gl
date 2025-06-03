import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("H gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an H gate on the first bit", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22H%22');
  
    await expect(page).toHaveScreenshot("h-gate-bit1.png");
  });

  test("Place an H gate on the second bit", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22H%22');

    await expect(page).toHaveScreenshot("h-gate-bit2.png");
  });

  test("Place an H gate on the third bit", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22H%22');
    
    await expect(page).toHaveScreenshot("h-gate-bit3.png");
  });
});
