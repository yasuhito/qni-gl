import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("Z gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Z gate on the first bit", async ({ page, circuitInfo }) => {
    const zGate = circuitInfo.gatePalette.zGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, zGate, dropzone);

    await expect(page).toHaveScreenshot("z-gate-bit1.png");
  });

  test("Place a Z gate on the second bit", async ({ page, circuitInfo }) => {
    const zGate = circuitInfo.gatePalette.zGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, zGate, dropzone);

    await expect(page).toHaveScreenshot("z-gate-bit2.png");
  });

  test("Place a Z gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const zGate = circuitInfo.gatePalette.zGate;
    await page.mouse.move(zGate.x, zGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("z-gate-bit3.png");
  });
});
