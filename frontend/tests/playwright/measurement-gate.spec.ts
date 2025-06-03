import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("Measurement gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Measurement gate on the first bit", async ({
    page,
    circuitInfo,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;

    await dragAndDrop(page, measurementGate, { step: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22Measure%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("measurement-gate-bit1.png");
  });

  test("Place a Measurement gate on the second bit", async ({
    page,
    circuitInfo,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;

    await dragAndDrop(page, measurementGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22Measure%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("measurement-gate-bit2.png");
  });

  test("Place a Measurement gate on the third bit", async ({
    page,
    circuitInfo,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;

    await dragAndDrop(page, measurementGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C1%2C%22Measure%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("measurement-gate-bit3.png");
  });
});
