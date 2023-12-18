import { appData, centerPosition } from "./test-helpers";
import { test, expect } from "@playwright/test";

test.describe("Discard gates", () => {
  let gatePalette;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const app = await appData(page);
    gatePalette = app.gatePalette;
  });

  test("Discard H gate", async ({ page }) => {
    const gate = gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(gate).x, centerPosition(gate).y);
    await page.mouse.down();
    await page.mouse.up();

    await expect(page).toHaveScreenshot("discard-h-gate.png");
  });
});
