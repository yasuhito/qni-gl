import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("Y gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Y gate on the first bit", async ({ page, circuitInfo }) => {
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, yGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22Y%22');

    await expect(page).toHaveScreenshot("y-gate-bit1.png");
  });

  test("Place a Y gate on the second bit", async ({ page, circuitInfo }) => {
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, yGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22Y%22');

    await expect(page).toHaveScreenshot("y-gate-bit2.png");
  });

  test("Place a Y gate on the third bit", async ({ page, circuitInfo }) => {
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, yGate, { step: 0, bit: 2 });
    
    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22Y%22');

    await expect(page).toHaveScreenshot("y-gate-bit3.png");
  });
});
