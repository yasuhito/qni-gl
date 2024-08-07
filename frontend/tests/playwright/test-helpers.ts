import * as PIXI from "pixi.js";
import { fail } from "assert";
import { Page } from "playwright/test";
import { GateComponent } from "../../src";

export async function appData(page: Page) {
  const appEl = await page.locator("#app");
  const dataApp = await appEl.getAttribute("data-app");

  if (dataApp === null) {
    fail("data-app is null");
  }

  return JSON.parse(dataApp);
}

export function centerPosition(gate: GateComponent) {
  return new PIXI.Point(gate.x + gate.width / 2, gate.y + gate.height / 2);
}
