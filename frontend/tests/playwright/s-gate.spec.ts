import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("S gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an S gate on the first bit", async ({ page, circuitInfo }) => {
    const sGate = circuitInfo.gatePalette.sGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, sGate, dropzone);

    await expect(page).toHaveScreenshot("s-gate-bit1.png");
  });

  test("Place an S gate on the second bit", async ({ page, circuitInfo }) => {
    const sGate = circuitInfo.gatePalette.sGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, sGate, dropzone);

    await expect(page).toHaveScreenshot("s-gate-bit2.png");
  });

  test("Place an S gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const sGate = circuitInfo.gatePalette.sGate;
    await page.mouse.move(sGate.x, sGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("s-gate-bit3.png");
  });
});
