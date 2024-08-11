import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("Y gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Y gate on the first bit", async ({ page, circuitInfo }) => {
    const yGate = circuitInfo.gatePalette.yGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, yGate, dropzone);

    await expect(page).toHaveScreenshot("y-gate-bit1.png");
  });

  test("Place a Y gate on the second bit", async ({ page, circuitInfo }) => {
    const yGate = circuitInfo.gatePalette.yGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, yGate, dropzone);

    await expect(page).toHaveScreenshot("y-gate-bit2.png");
  });

  test("Place a Y gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const yGate = circuitInfo.gatePalette.yGate;
    await page.mouse.move(yGate.x, yGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("y-gate-bit3.png");
  });
});
