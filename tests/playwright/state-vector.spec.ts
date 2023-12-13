import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Dropzone", () => {
  let app;
  let gatePalette;
  let firstDropzone;

  test.beforeEach(async ({ page }) => {
    // TODO: ポート番号を設定から取得する
    await page.goto("http://localhost:5173/");

    const appEl = await page.locator("#app");
    const dataApp = await appEl.getAttribute("data-app");

    if (dataApp === null) {
      fail("data-app is null");
    }

    app = JSON.parse(dataApp);
    gatePalette = app.gatePalette;
    firstDropzone = app.circuit.steps[0].dropzones[0];
  });

  test("1 qubit", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-1qubit.png");
  });

  test("2 qubit", async ({ page }) => {
    const gate = gatePalette.gates.HGate;
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-2qubit.png");
  });
});
