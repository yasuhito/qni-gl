import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("Control gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Control gate on the first bit", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, controlGate, dropzone);

    await expect(page).toHaveScreenshot("control-gate-bit1.png");
  });

  test("Place a Control gate on the second bit", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, controlGate, dropzone);

    await expect(page).toHaveScreenshot("control-gate-bit2.png");
  });

  test("Place a Control gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    await page.mouse.move(controlGate.x, controlGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("control-gate-bit3.png");
  });
});
