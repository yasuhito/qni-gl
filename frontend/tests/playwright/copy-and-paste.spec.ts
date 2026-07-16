import { expect, test } from "./fixtures";
import { dragAndDrop, getCircuitInfo } from "./test-helpers";

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

  test("selects multiple gates by dragging a rectangle", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await dragAndDrop(page, circuitInfo.gatePalette.xGate, {
      step: 1,
      bit: 1,
    });

    await page.mouse.move(
      circuitInfo.steps[0][1].x,
      circuitInfo.steps[0][1].y
    );
    await page.mouse.down();
    await page.mouse.move(
      circuitInfo.steps[1][0].x,
      circuitInfo.steps[1][0].y,
      { steps: 5 }
    );
    await page.mouse.up();

    await page.keyboard.press("Control+c");
    await page.keyboard.press("Control+v");

    await expect
      .poll(() => circuitJson(page))
      .toBe('{"cols":[["H",1],[1,"X"],["H",1],[1,"X"]]}');
  });

  test("keeps empty-cell clicks working without starting a rectangle", async ({
    page,
    circuitInfo,
  }) => {
    await page.mouse.click(
      circuitInfo.steps[1][0].x,
      circuitInfo.steps[1][0].y
    );

    await expect.poll(() => activeStepIndex(page)).toBe(1);
  });

  test("updates temporary selections as gates enter and leave the rectangle", async ({
    page,
  }) => {
    await page.evaluate(() => {
      window.pixiApp?.circuitFrame?.circuit.fromJSON(
        '{"cols":[["H",1],[1,"X"]]}'
      );
    });
    await page.waitForFunction(() => {
      const steps = window.pixiApp?.circuitFrame?.circuit.steps ?? [];

      return steps.every((step) =>
        step.dropzones.every((dropzone) => {
          const operation = dropzone.operation;

          return operation === null || operation.sprite?.width > 0;
        })
      );
    });

    const circuitInfo = await getCircuitInfo(page);

    const start = {
      x: circuitInfo.steps[3][0].x,
      y: circuitInfo.steps[3][0].y,
    };
    const end = {
      x: circuitInfo.steps[1][1].x,
      y: circuitInfo.steps[1][1].y,
    };

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 5 });

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual(["XGate"]);

    await page.mouse.move(start.x, start.y, { steps: 5 });

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual([]);

    await page.mouse.up();
  });
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

async function activeStepIndex(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const circuit = window.pixiApp?.circuitFrame?.circuit;
    if (circuit === undefined) {
      throw new Error("Circuit is not initialized");
    }

    return circuit.activeStepIndex;
  });
}

async function selectedGateTypes(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const app = window.pixiApp as
      | {
          selectedGates: Set<{ operationType: string }>;
        }
      | undefined;
    if (app === undefined) {
      throw new Error("App is not initialized");
    }

    return Array.from(app.selectedGates, (gate) => gate.operationType).sort();
  });
}
