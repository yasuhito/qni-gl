import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("X gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an X gate on the first bit", async ({ page, circuitInfo }) => {
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%22');

    await expect(page).toHaveScreenshot("x-gate-bit1.png");
  });

  test("Place an X gate on the second bit", async ({ page, circuitInfo }) => {
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22X%22');

    await expect(page).toHaveScreenshot("x-gate-bit2.png");
  });

  test("Place an X gate on the third bit", async ({ page, circuitInfo }) => {
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 2 });
    
    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22X%22');

    await expect(page).toHaveScreenshot("x-gate-bit3.png");
  });
});
