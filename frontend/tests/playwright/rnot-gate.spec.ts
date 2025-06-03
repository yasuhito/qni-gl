import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("√X gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a √X gate on the first bit", async ({ page, circuitInfo }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;

    await dragAndDrop(page, rnotGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%5E%C2%BD%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("rnot-gate-bit1.png");
  });

  test("Place a √X gate on the second bit", async ({ page, circuitInfo }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;

    await dragAndDrop(page, rnotGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22X%5E%C2%BD%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("rnot-gate-bit2.png");
  });

  test("Place a √X gate on the third bit", async ({ page, circuitInfo }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;

    await dragAndDrop(page, rnotGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22X%5E%C2%BD%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("rnot-gate-bit3.png");
  });
});
