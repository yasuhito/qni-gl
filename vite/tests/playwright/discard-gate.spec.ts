import { GatePaletteComponent } from "../../src/gate-palette-component";
import { appData, centerPosition } from "./test-helpers";
import { test, expect, Locator } from "@playwright/test";

test.describe("Discard gates", () => {
  let gatePalette: GatePaletteComponent;
  let idle: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const app = await appData(page);
    gatePalette = app.circuitFrame.gatePalette;
    idle = page.locator('#app[data-state="idle"]');
  });

  test("Discard H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.up();
    await idle.waitFor();

    await expect(page).toHaveScreenshot("discard-h-gate.png");
  });
});
