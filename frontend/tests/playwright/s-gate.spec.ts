import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("S gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an S gate on the first bit", async ({ page, circuitInfo }) => {
    const sGate = circuitInfo.gatePalette.sGate;

    await dragAndDrop(page, sGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22S%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("s-gate-bit1.png");
  });

  test("Place an S gate on the second bit", async ({ page, circuitInfo }) => {
    const sGate = circuitInfo.gatePalette.sGate;

    await dragAndDrop(page, sGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22S%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("s-gate-bit2.png");
  });

  test("Place an S gate on the third bit", async ({ page, circuitInfo }) => {
    const sGate = circuitInfo.gatePalette.sGate;

    await dragAndDrop(page, sGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22S%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("s-gate-bit3.png");
  });
});
