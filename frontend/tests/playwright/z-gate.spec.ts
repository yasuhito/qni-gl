import { App } from "../../src/app";
import { GateComponent } from "../../src";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Z gate", () => {
  let app: App;
  let idle: Locator;
  let zGate: GateComponent;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    app = await appData(page);
    idle = page.locator('#app[data-state="idle"]');
    zGate = app.gatePalette.gates.ZGate as GateComponent;

    await idle.waitFor();
  });

  test("Place a Z gate on the first bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[0];

    await page.mouse.move(centerPosition(zGate).x, centerPosition(zGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("z-gate-bit1.png");
  });

  test("Place a Z gate on the second bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(zGate).x, centerPosition(zGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("z-gate-bit2.png");
  });

  test("Place a Z gate on the third bit", async ({ page }) => {
    await page.mouse.move(centerPosition(zGate).x, centerPosition(zGate).y);
    await page.mouse.down();

    app = await appData(page);
    const dropzone = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("z-gate-bit3.png");
  });

  test("Apply a Z-gate to state |1>.", async ({ page }) => {
    const dropzone00 = app.circuit.steps[0].dropzones[0];
    const xGate = app.gatePalette.gates.XGate as GateComponent;

    await page.mouse.move(centerPosition(xGate).x, centerPosition(xGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone00.x, dropzone00.y);
    await page.mouse.up();
    await idle.waitFor();

    const dropzone10 = app.circuit.steps[1].dropzones[0];

    await page.mouse.move(centerPosition(zGate).x, centerPosition(zGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone10.x, dropzone10.y);
    await page.mouse.up();
    await idle.waitFor();

    const step1 = app.circuit.steps[1];
    await page.mouse.click(step1.x, step1.y);
    await idle.waitFor();

    await expect(page).toHaveScreenshot("z-gate-state-|1>.png");
  });
});
