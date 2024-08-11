import { GateComponent } from "../../src";
import { DropzoneComponent } from "../../src/dropzone-component";
import { GatePaletteComponent } from "../../src/gate-palette-component";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Dropzone", () => {
  let gatePalette: GatePaletteComponent;
  let firstDropzone: DropzoneComponent;
  let idle: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const app = await appData(page);
    gatePalette = app.gatePalette;
    firstDropzone = app.circuit.steps[0].dropzones[0];
    idle = page.locator('#app[data-state="idle"]');

    await idle.waitFor();
  });

  test.only("Drag and drop H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-h-gate.png");
  });

  test("Drag and drop X gate", async ({ page }) => {
    const gate = gatePalette.gates.XGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-x-gate.png");
  });

  test("Drag and drop Y gate", async ({ page }) => {
    const gate = gatePalette.gates.YGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-y-gate.png");
  });

  test("Drag and drop Z gate", async ({ page }) => {
    const gate = gatePalette.gates.ZGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-z-gate.png");
  });

  test("Drag and drop √X gate", async ({ page }) => {
    const gate = gatePalette.gates.RnotGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-rnot-gate.png");
  });

  test("Drag and drop S gate", async ({ page }) => {
    const gate = gatePalette.gates.SGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-s-gate.png");
  });

  test("Drag and drop S† gate", async ({ page }) => {
    const gate = gatePalette.gates.SDaggerGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-s-dagger-gate.png");
  });

  test("Drag and drop T gate", async ({ page }) => {
    const gate = gatePalette.gates.TGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-t-gate.png");
  });

  test("Drag and drop T† gate", async ({ page }) => {
    const gate = gatePalette.gates.TDaggerGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-t-dagger-gate.png");
  });

  test("Drag and drop Swap gate", async ({ page }) => {
    const gate = gatePalette.gates.SwapGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-swap-gate.png");
  });

  test("Drag and drop Control gate", async ({ page }) => {
    const gate = gatePalette.gates.ControlGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-control-gate.png");
  });

  test("Drag and drop |0> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write0Gate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-write0-gate.png");
  });

  test("Drag and drop |1> gate", async ({ page }) => {
    const gate = gatePalette.gates.Write1Gate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-write1-gate.png");
  });

  test("Drag and drop Measurement gate", async ({ page }) => {
    const gate = gatePalette.gates.MeasurementGate as GateComponent;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.move(firstDropzone.x, firstDropzone.y);
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("drag-and-drop-measurement-gate.png");
  });
});
