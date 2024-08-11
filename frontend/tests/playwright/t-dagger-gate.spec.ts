import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("T† gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a T† gate on the first bit", async ({ page, circuitInfo }) => {
    const tDaggerGate = circuitInfo.gatePalette.tDaggerGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, tDaggerGate, dropzone);

    await expect(page).toHaveScreenshot("t-dagger-gate-bit1.png");
  });

  test("Place a T† gate on the second bit", async ({ page, circuitInfo }) => {
    const tDaggerGate = circuitInfo.gatePalette.tDaggerGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, tDaggerGate, dropzone);

    await expect(page).toHaveScreenshot("t-dagger-gate-bit2.png");
  });

  test("Place a T† gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const tDaggerGate = circuitInfo.gatePalette.tDaggerGate;
    await page.mouse.move(tDaggerGate.x, tDaggerGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("t-dagger-gate-bit3.png");
  });
});
