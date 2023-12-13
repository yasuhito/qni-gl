import * as PIXI from "pixi.js";
import { fail } from "assert";

export async function appData(page) {
  const appEl = await page.locator("#app");
  const dataApp = await appEl.getAttribute("data-app");

  if (dataApp === null) {
    fail("data-app is null");
  }

  return JSON.parse(dataApp);
}

export function centerPosition(gate) {
  return new PIXI.Point(gate.x + gate.width / 2, gate.y + gate.height / 2);
}
