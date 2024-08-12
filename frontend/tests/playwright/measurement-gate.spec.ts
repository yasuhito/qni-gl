import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("Measurement gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Measurement gate on the first bit", async ({
    page,
    circuitInfo,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, measurementGate, dropzone);

    await expect(page).toHaveScreenshot("measurement-gate-bit1.png");
  });

  test("Place a Measurement gate on the second bit", async ({
    page,
    circuitInfo,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, measurementGate, dropzone);

    await expect(page).toHaveScreenshot("measurement-gate-bit2.png");
  });

  test("Place a Measurement gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const measurementGate = circuitInfo.gatePalette.measurementGate;
    await page.mouse.move(measurementGate.x, measurementGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("measurement-gate-bit3.png");
  });
});
