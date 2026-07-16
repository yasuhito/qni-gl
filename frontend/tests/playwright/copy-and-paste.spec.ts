import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("Copy and paste", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(
    "copies, pastes, undoes, and redoes a gate insertion",
    async ({ page, circuitInfo }) => {
      await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
        step: 0,
        bit: 0,
      });
      await dragAndDrop(page, circuitInfo.gatePalette.xGate, {
        step: 1,
        bit: 0,
      });
      await page.mouse.click(
        circuitInfo.steps[0][0].x,
        circuitInfo.steps[0][0].y
      );
      await page.keyboard.press("Control+c");

      await page.keyboard.press("Control+v");

      await expect
        .poll(() => circuitJson(page))
        .toBe('{"cols":[["H",1],["H",1],["X",1]]}');

      await page.keyboard.press("Control+z");

      await expect
        .poll(() => circuitJson(page))
        .toBe('{"cols":[["H",1],["X",1]]}');

      await page.keyboard.press("Control+Shift+z");

      await expect
        .poll(() => circuitJson(page))
        .toBe('{"cols":[["H",1],["H",1],["X",1]]}');
    }
  );
});

async function circuitJson(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const circuit = window.pixiApp?.circuitFrame?.circuit;
    if (circuit === undefined) {
      throw new Error("Circuit is not initialized");
    }

    return circuit.toJSON();
  });
}
