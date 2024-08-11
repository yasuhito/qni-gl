import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("S† gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an S† gate on the first bit", async ({ page, circuitInfo }) => {
    const sDaggerGate = circuitInfo.gatePalette.sDaggerGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, sDaggerGate, dropzone);

    await expect(page).toHaveScreenshot("s-dagger-gate-bit1.png");
  });

  test("Place an S† gate on the second bit", async ({ page, circuitInfo }) => {
    const sDaggerGate = circuitInfo.gatePalette.sDaggerGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, sDaggerGate, dropzone);

    await expect(page).toHaveScreenshot("s-dagger-gate-bit2.png");
  });

  test("Place an S† gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const sDaggerGate = circuitInfo.gatePalette.sDaggerGate;
    await page.mouse.move(sDaggerGate.x, sDaggerGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("s-dagger-gate-bit3.png");
  });
});
