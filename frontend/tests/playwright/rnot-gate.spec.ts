import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("√X gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a √X gate on the first bit", async ({ page, circuitInfo }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, rnotGate, dropzone);

    await expect(page).toHaveScreenshot("rnot-gate-bit1.png");
  });

  test("Place a √X gate on the second bit", async ({ page, circuitInfo }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, rnotGate, dropzone);

    await expect(page).toHaveScreenshot("rnot-gate-bit2.png");
  });

  test("Place a √X gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const rnotGate = circuitInfo.gatePalette.rnotGate;
    await page.mouse.move(rnotGate.x, rnotGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("rnot-gate-bit3.png");
  });
});
