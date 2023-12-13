import * as PIXI from "pixi.js";
import { fail } from "assert";
import { test, expect } from "@playwright/test";

test.describe("Dropzone", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1 qubit", async ({ page }) => {
    const app = await appData(page);
    const hGate = app.gatePalette.gates.HGate;
    const dropzone = app.circuit.steps[0].dropzones[0];

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-1qubit.png");
  });

  test("2 qubit", async ({ page }) => {
    const app = await appData(page);
    const hGate = app.gatePalette.gates.HGate;
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-2qubit.png");
  });

  test("3 qubit", async ({ page }) => {
    let app = await appData(page);
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    app = await appData(page);
    const dropzone = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-3qubit.png");
  });

  async function appData(page) {
    const appEl = await page.locator("#app");
    const dataApp = await appEl.getAttribute("data-app");

    if (dataApp === null) {
      fail("data-app is null");
    }

    return JSON.parse(dataApp);
  }

  function centerPosition(gate) {
    return new PIXI.Point(gate.x + gate.width / 2, gate.y + gate.height / 2);
  }
});
