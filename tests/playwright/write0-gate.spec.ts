import { App } from "../../src/app";
import { GateComponent } from "../../src";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("|0> gate", () => {
  let app: App;
  let idle: Locator;
  let write0Gate: GateComponent | null;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    app = await appData(page);
    idle = page.locator('#app[data-state="idle"]');
    write0Gate = app.gatePalette.gates.Write0Gate;

    await idle.waitFor();
  });

  test("Place a |0> gate on the first bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[0];

    await page.mouse.move(centerPosition(write0Gate).x, centerPosition(write0Gate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("write0-gate-bit1.png");
  });

  test("Place a |0> gate on the second bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(write0Gate).x, centerPosition(write0Gate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("write0-gate-bit2.png");
  });

  test("Place a |0> gate on the third bit", async ({ page }) => {
    await page.mouse.move(centerPosition(write0Gate).x, centerPosition(write0Gate).y);
    await page.mouse.down();

    app = await appData(page);
    const dropzone = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("write0-gate-bit3.png");
  });
});
