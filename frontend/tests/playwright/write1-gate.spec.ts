import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("|1> gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a |1> gate on the first bit", async ({ page, circuitInfo }) => {
    const write1Gate = circuitInfo.gatePalette.write1Gate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, write1Gate, dropzone);

    await expect(page).toHaveScreenshot("write1-gate-bit1.png");
  });

  test("Place a |1> gate on the second bit", async ({ page, circuitInfo }) => {
    const write1Gate = circuitInfo.gatePalette.write1Gate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, write1Gate, dropzone);

    await expect(page).toHaveScreenshot("write1-gate-bit2.png");
  });

  test("Place a |1> gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const write1Gate = circuitInfo.gatePalette.write1Gate;
    await page.mouse.move(write1Gate.x, write1Gate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("write1-gate-bit3.png");
  });
});
