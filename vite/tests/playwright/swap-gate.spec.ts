import { App } from "../../src/app";
import { GateComponent } from "../../src";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Swap gate", () => {
  let app: App;
  let idle: Locator;
  let swapGate: GateComponent | null;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    app = await appData(page);
    idle = page.locator('#app[data-state="idle"]');
    swapGate = app.circuitFrame.gatePalette.gates.SwapGate;

    await idle.waitFor();
  });

  test("Place a Swap gate on the first bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[0];

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("swap-gate-bit1.png");
  });

  test("Place a Swap gate on the second bit", async ({ page }) => {
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("swap-gate-bit2.png");
  });

  test("Place a Swap gate on the third bit", async ({ page }) => {
    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();

    app = await appData(page);
    const dropzone = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("swap-gate-bit3.png");
  });

  test("Two swap gates join", async ({ page }) => {
    const dropzoneBit0 = app.circuit.steps[0].dropzones[0];
    const dropzoneBit1 = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzoneBit0.x, dropzoneBit0.y);
    await page.mouse.up();

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzoneBit1.x, dropzoneBit1.y);
    await page.mouse.up();

    await idle.waitFor();

    await expect(page).toHaveScreenshot("two-swap-gates-join.png");
  });

  test("Three swap gates don't join", async ({ page }) => {
    const dropzoneBit0 = app.circuit.steps[0].dropzones[0];
    const dropzoneBit1 = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzoneBit0.x, dropzoneBit0.y);
    await page.mouse.up();

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    await page.mouse.move(dropzoneBit1.x, dropzoneBit1.y);
    await page.mouse.up();

    await page.mouse.move(
      centerPosition(swapGate).x,
      centerPosition(swapGate).y
    );
    await page.mouse.down();
    app = await appData(page);
    const dropzoneBit2 = app.circuit.steps[0].dropzones[2];
    await page.mouse.move(dropzoneBit2.x, dropzoneBit2.y);
    await page.mouse.up();

    await idle.waitFor();

    await expect(page).toHaveScreenshot("three-swap-gates-dont-join.png");
  });
});
