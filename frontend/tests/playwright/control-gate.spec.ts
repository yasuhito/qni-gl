import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("Control gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Control gate on the first bit", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%E2%80%A2%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("control-gate-bit1.png");
  });

  test("Place a Control gate on the second bit", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22%E2%80%A2%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("control-gate-bit2.png");
  });

  test("Place a Control gate on the third bit", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22%E2%80%A2%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("control-gate-bit3.png");
  });
});
