import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

test.describe("X gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place an X gate on the first bit", async ({ page, circuitInfo }) => {
    const xGate = circuitInfo.gatePalette.xGate;
    const dropzone = circuitInfo.steps[0][0];

    await dragAndDrop(page, xGate, dropzone);

    await expect(page).toHaveScreenshot("x-gate-bit1.png");
  });

  test("Place an X gate on the second bit", async ({ page, circuitInfo }) => {
    const xGate = circuitInfo.gatePalette.xGate;
    const dropzone = circuitInfo.steps[0][1];

    await dragAndDrop(page, xGate, dropzone);

    await expect(page).toHaveScreenshot("x-gate-bit2.png");
  });

  test("Place an X gate on the third bit", async ({
    page,
    circuitInfo,
    idle,
  }) => {
    const xGate = circuitInfo.gatePalette.xGate;
    await page.mouse.move(xGate.x, xGate.y);
    await page.mouse.down();

    circuitInfo = await getCircuitInfo(page);
    const dropzone = circuitInfo.steps[0][2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("x-gate-bit3.png");
  });
});
