import { App } from "../../src/app";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Swap gate", () => {
  let app: App;
  let idle: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    app = await appData(page);
    idle = page.locator('#app[data-state="idle"]');

    await idle.waitFor();
  });

  test("Two swap gates join", async ({ page }) => {
    const swapGate = app.gatePalette.gates.SwapGate;
    const dropzoneBit0 = app.circuit.steps[0].dropzones[0];
    const dropzoneBit1 = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(swapGate).x, centerPosition(swapGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzoneBit0.x, dropzoneBit0.y);
    await page.mouse.up();

    await page.mouse.move(centerPosition(swapGate).x, centerPosition(swapGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzoneBit1.x, dropzoneBit1.y);
    await page.mouse.up();

    await idle.waitFor();

    await expect(page).toHaveScreenshot("two-swap-gates-join.png");
  });

  test("Three swap gates don't join", async ({ page }) => {
    const swapGate = app.gatePalette.gates.SwapGate;
    const dropzoneBit0 = app.circuit.steps[0].dropzones[0];
    const dropzoneBit1 = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(swapGate).x, centerPosition(swapGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzoneBit0.x, dropzoneBit0.y);
    await page.mouse.up();

    await page.mouse.move(centerPosition(swapGate).x, centerPosition(swapGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzoneBit1.x, dropzoneBit1.y);
    await page.mouse.up();

    await page.mouse.move(centerPosition(swapGate).x, centerPosition(swapGate).y);
    await page.mouse.down();
    app = await appData(page);
    const dropzoneBit2 = app.circuit.steps[0].dropzones[2];
    await page.mouse.move(dropzoneBit2.x, dropzoneBit2.y);
    await page.mouse.up();

    await idle.waitFor();

    await expect(page).toHaveScreenshot("three-swap-gates-dont-join.png");
  });
});
