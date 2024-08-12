import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("Swap gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a Swap gate on the first bit", async ({ page, circuitInfo }) => {
    const swapGate = circuitInfo.gatePalette.swapGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, swapGate, dropzone);

    await expect(page).toHaveScreenshot("swap-gate-bit1.png");
  });

  test("Place a Swap gate on the second bit", async ({ page, circuitInfo }) => {
    const swapGate = circuitInfo.gatePalette.swapGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, swapGate, dropzone);

    await expect(page).toHaveScreenshot("swap-gate-bit2.png");
  });

  test("Place a Swap gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const swapGate = circuitInfo.gatePalette.swapGate;
    await page.mouse.move(swapGate.x, swapGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("swap-gate-bit3.png");
  });
});
