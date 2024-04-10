import { DropzoneComponent } from "../../src/dropzone-component";
import { GatePaletteComponent } from "../../src/gate-palette-component";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Dropzone", () => {
  let gatePalette: GatePaletteComponent;
  let firstDropzone: DropzoneComponent;
  let running: Locator;
  let idle: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const app = await appData(page);
    gatePalette = app.gatePalette;
    firstDropzone = app.circuit.steps[0].dropzones[0];
    running = page.locator('#app[data-state="running"]');
    idle = page.locator('#app[data-state="idle"]');
  });

  test("Drag and drop H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-h-gate.png");
  });

  test("Drag and drop X gate", async ({ page }) => {
    const gate = gatePalette.gates.XGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-x-gate.png");
  });

  test("Drag and drop Y gate", async ({ page }) => {
    const gate = gatePalette.gates.YGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-y-gate.png");
  });

  test("Drag and drop Z gate", async ({ page }) => {
    const gate = gatePalette.gates.ZGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-z-gate.png");
  });

  test("Drag and drop √X gate", async ({ page }) => {
    const gate = gatePalette.gates.RnotGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-rnot-gate.png");
  });

  test("Drag and drop S gate", async ({ page }) => {
    const gate = gatePalette.gates.SGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-s-gate.png");
  });

  test("Drag and drop S† gate", async ({ page }) => {
    const gate = gatePalette.gates.SDaggerGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-s-dagger-gate.png");
  });

  test("Drag and drop T gate", async ({ page }) => {
    const gate = gatePalette.gates.TGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-t-gate.png");
  });

  test("Drag and drop T† gate", async ({ page }) => {
    const gate = gatePalette.gates.TDaggerGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-t-dagger-gate.png");
  });

  test("Drag and drop Swap gate", async ({ page }) => {
    const gate = gatePalette.gates.SwapGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-swap-gate.png");
  });

  test("Drag and drop Control gate", async ({ page }) => {
    const gate = gatePalette.gates.ControlGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-control-gate.png");
  });

  test("Drag and drop |0> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write0Gate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-write0-gate.png");
  });

  test("Drag and drop |1> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write1Gate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-write1-gate.png");
  });

  test("Drag and drop Measurement gate", async ({ page }) => {
    const gate = gatePalette.gates.MeasurementGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-measurement-gate.png");
  });

  test("Drag and drop Bloch Sphere", async ({ page }) => {
    const gate = gatePalette.gates.BlochSphere;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-bloch-sphere.png");
  });

  test("Drag and drop QFT gate", async ({ page }) => {
    const gate = gatePalette.gates.QFTGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-qft-gate.png");
  });

  test("Drag and drop QFT† gate", async ({ page }) => {
    const gate = gatePalette.gates.QFTDaggerGate;

    await idle.waitFor();

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();

    await running.waitFor();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-qft-dagger-gate.png");
  });
});
