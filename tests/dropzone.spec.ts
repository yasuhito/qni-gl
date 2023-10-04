import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Dropzone", () => {
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

    const app = JSON.parse(dataApp);
    gatePalette = app.gatePalette;
    firstDropzone = app.circuit.steps[0].dropzones[0];
  });

  test("Drag and drop H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-h-gate.png");
  });

  test("Drag and drop X gate", async ({ page }) => {
    const gate = gatePalette.gates.XGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-x-gate.png");
  });

  test("Drag and drop Y gate", async ({ page }) => {
    const gate = gatePalette.gates.YGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-y-gate.png");
  });

  test("Drag and drop Z gate", async ({ page }) => {
    const gate = gatePalette.gates.ZGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-z-gate.png");
  });

  test("Drag and drop Swap gate", async ({ page }) => {
    const gate = gatePalette.gates.SwapGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-swap-gate.png");
  });

  test("Drag and drop Control gate", async ({ page }) => {
    const gate = gatePalette.gates.ControlGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-control-gate.png");
  });

  test("Drag and drop Anti Control gate", async ({ page }) => {
    const gate = gatePalette.gates.AntiControlGate;

    await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-anti-control-gate.png");
  });
});
