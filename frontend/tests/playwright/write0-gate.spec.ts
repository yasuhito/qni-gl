import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("|0> gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a |0> gate on the first bit", async ({
    page,
    circuitInfo,
  }) => {
    const write0Gate = circuitInfo.gatePalette.write0Gate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, write0Gate, dropzone);

    await expect(page).toHaveScreenshot("write0-gate-bit1.png");
  });

  test("Place a |0> gate on the second bit", async ({
    page,
    circuitInfo,
  }) => {
    const write0Gate = circuitInfo.gatePalette.write0Gate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, write0Gate, dropzone);

    await expect(page).toHaveScreenshot("write0-gate-bit2.png");
  });

  test("Place a |0> gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const write0Gate = circuitInfo.gatePalette.write0Gate;
    await page.mouse.move(write0Gate.x, write0Gate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("write0-gate-bit3.png");
  });
});
