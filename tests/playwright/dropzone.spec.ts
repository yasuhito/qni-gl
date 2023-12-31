import { appData, centerPosition } from "./test-helpers";
import { test, expect } from "@playwright/test";

test.describe("Dropzone", () => {
  let gatePalette;
  let firstDropzone;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const app = await appData(page);
    gatePalette = app.gatePalette;
    firstDropzone = app.circuit.steps[0].dropzones[0];
  });

  test("Drag and drop H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-h-gate.png");
  });

  test("Drag and drop X gate", async ({ page }) => {
    const gate = gatePalette.gates.XGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-x-gate.png");
  });

  test("Drag and drop Y gate", async ({ page }) => {
    const gate = gatePalette.gates.YGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-y-gate.png");
  });

  test("Drag and drop Z gate", async ({ page }) => {
    const gate = gatePalette.gates.ZGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-z-gate.png");
  });

  test("Drag and drop Swap gate", async ({ page }) => {
    const gate = gatePalette.gates.SwapGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-swap-gate.png");
  });

  test("Drag and drop Control gate", async ({ page }) => {
    const gate = gatePalette.gates.ControlGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-control-gate.png");
  });

  test("Drag and drop Anti Control gate", async ({ page }) => {
    const gate = gatePalette.gates.AntiControlGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-anti-control-gate.png");
  });

  test("Drag and drop |0> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write0Gate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-write0-gate.png");
  });

  test("Drag and drop |1> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write1Gate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-write1-gate.png");
  });

  test("Drag and drop Measurement gate", async ({ page }) => {
    const gate = gatePalette.gates.MeasurementGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-measurement-gate.png");
  });

  test("Drag and drop Bloch Sphere", async ({ page }) => {
    const gate = gatePalette.gates.BlochSphere;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-bloch-sphere.png");
  });

  test("Drag and drop QFT gate", async ({ page }) => {
    const gate = gatePalette.gates.QFTGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-qft-gate.png");
  });

  test("Drag and drop QFT† gate", async ({ page }) => {
    const gate = gatePalette.gates.QFTDaggerGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("drag-and-drop-qft-dagger-gate.png");
  });
});
