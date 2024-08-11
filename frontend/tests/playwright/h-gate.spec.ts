import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("H gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an H gate on the first bit", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, hGate, dropzone);

    await expect(page).toHaveScreenshot("h-gate-bit1.png");
  });

  test("Place an H gate on the second bit", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, hGate, dropzone);

    await expect(page).toHaveScreenshot("h-gate-bit2.png");
  });

  test("Place an H gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const hGate = circuitInfo.gatePalette.hGate;
    await page.mouse.move(hGate.x, hGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("h-gate-bit3.png");
  });
});
