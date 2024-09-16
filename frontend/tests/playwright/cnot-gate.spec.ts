import { expect, test } from "./fixtures";
import { activateStep, dragAndDrop } from "./test-helpers";

test.describe("Cnot gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a cnot gate (00)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, controlGate, circuitInfo.steps[0][0]);
    await dragAndDrop(page, xGate, circuitInfo.steps[0][1]);

    await expect(page).toHaveScreenshot("cnot-gate-00.png");
  });

  test("Place a cnot gate (01)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, circuitInfo.steps[0][0]);
    await dragAndDrop(page, controlGate, circuitInfo.steps[1][0]);
    await dragAndDrop(page, xGate, circuitInfo.steps[1][1]);
    await activateStep(page, 1);

    await expect(page).toHaveScreenshot("cnot-gate-01.png");
  });

  test("Place a cnot gate (10)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, circuitInfo.steps[0][1]);
    await dragAndDrop(page, controlGate, circuitInfo.steps[1][0]);
    await dragAndDrop(page, xGate, circuitInfo.steps[1][1]);
    await activateStep(page, 1);

    await expect(page).toHaveScreenshot("cnot-gate-10.png");
  });

  test("Place a cnot gate (11)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, circuitInfo.steps[0][0]);
    await dragAndDrop(page, xGate, circuitInfo.steps[0][1]);
    await dragAndDrop(page, controlGate, circuitInfo.steps[1][0]);
    await dragAndDrop(page, xGate, circuitInfo.steps[1][1]);
    await activateStep(page, 1);

    await expect(page).toHaveScreenshot("cnot-gate-11.png");
  });
});
