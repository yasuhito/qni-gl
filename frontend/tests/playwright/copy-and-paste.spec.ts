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

  test("deletes the selected gate with Delete", async ({
    page,
    circuitInfo,
  }) => {
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

    await page.keyboard.press("Delete");

    await expect
      .poll(() => circuitJson(page))
      .toBe('{"cols":[["X",1]]}');
  });

  test("deletes rectangle-selected gates with Backspace", async ({
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

    await page.keyboard.press("Backspace");

    await expect.poll(() => circuitJson(page)).toBe('{"cols":[]}');
  });

  test("keeps selected gates when Delete is typed in an input", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.value = "text";
      document.body.appendChild(input);
      input.focus();
    });

    await page.keyboard.press("Delete");

    await expect.poll(() => circuitJson(page)).toBe('{"cols":[["H",1]]}');
  });

  test("keeps selected gates with modifier Delete shortcuts", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await page.keyboard.press("Control+Backspace");

    await expect.poll(() => circuitJson(page)).toBe('{"cols":[["H",1]]}');
  });

  test("separates empty paste anchor clicks from step marker clicks", async ({
    page,
    circuitInfo,
  }) => {
    await page.mouse.click(
      circuitInfo.steps[1][0].x,
      circuitInfo.steps[1][0].y
    );

    await expect.poll(() => activeStepIndex(page)).toBe(0);
    await expect.poll(() => activeCell(page)).toEqual({
      stepIndex: 1,
      qubitIndex: 0,
    });

    await page.mouse.click(
      circuitInfo.steps[1][0].x + circuitInfo.steps[1][0].size / 2 - 2,
      circuitInfo.steps[1][0].y
    );

    await expect.poll(() => activeStepIndex(page)).toBe(1);
  });

  test("does not start rectangle selection while resizing the state vector frame", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    const divider = await page.evaluate(() => {
      const app = window.pixiApp as
        | {
            frameDivider: {
              getBounds(): { x: number; y: number; width: number };
            };
          }
        | undefined;
      const bounds = app?.frameDivider.getBounds();
      if (bounds === undefined) {
        throw new Error("Frame divider is not initialized");
      }

      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + 1,
      };
    });

    await page.mouse.move(divider.x, divider.y);
    await page.mouse.down();
    await page.mouse.move(divider.x, divider.y + 40, { steps: 5 });

    await expect.poll(() => rectangleSelectionIsActive(page)).toBe(false);

    await page.mouse.up();
  });

  test("does not update step marker candidates during rectangle selection", async ({
    page,
    circuitInfo,
  }) => {
    await page.mouse.move(
      circuitInfo.steps[3][0].x,
      circuitInfo.steps[3][0].y
    );
    await page.mouse.down();
    await page.mouse.move(
      circuitInfo.steps[1][1].x,
      circuitInfo.steps[1][1].y,
      { steps: 5 }
    );

    await expect.poll(() => hoveredStepIndexes(page)).toEqual([]);

    await page.mouse.up();
  });

  test("keeps selected gates when an empty cell becomes the paste anchor", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await page.mouse.click(
      circuitInfo.steps[2][1].x,
      circuitInfo.steps[2][1].y
    );

    await expect.poll(() => selectedGateTypes(page)).toEqual(["HGate"]);
    await expect.poll(() => activeCell(page)).toEqual({
      stepIndex: 2,
      qubitIndex: 1,
    });
  });

  test("removes an empty step after it stops being the paste anchor", async ({
    page,
    circuitInfo,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      const circuit = window.pixiApp?.circuitFrame?.circuit;
      if (circuit === undefined) {
        throw new Error("Circuit is not initialized");
      }

      circuit.fromJSON('{"cols":[["H",1],[1,1],["X",1]]}', true);
    });

    await page.mouse.click(
      circuitInfo.steps[1][1].x,
      circuitInfo.steps[1][1].y
    );

    await expect.poll(() => activeCell(page)).toEqual({
      stepIndex: 1,
      qubitIndex: 1,
    });

    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "XGate" },
    ]);
  });

  test("clears gate selection on a background click without clearing the clipboard", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );
    await page.keyboard.press("Control+c");

    await page.mouse.click(
      circuitInfo.steps[2][1].x,
      circuitInfo.steps[2][1].y
    );

    await page.mouse.click(
      circuitInfo.steps[2][0].x,
      circuitInfo.steps[0][0].y - circuitInfo.gatePalette.hGate.size * 2
    );

    await expect.poll(() => selectedGateTypes(page)).toEqual([]);
    await expect.poll(() => activeCell(page)).toEqual({
      stepIndex: 2,
      qubitIndex: 1,
    });

    await page.keyboard.press("Control+v");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 1, operationType: "HGate" },
    ]);
  });

  test("selects a controlled structure with one click and one gate with a double click", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.controlGate, {
      step: 0,
      bit: 0,
    });
    await dragAndDrop(page, circuitInfo.gatePalette.xGate, {
      step: 0,
      bit: 1,
    });

    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual(["ControlGate", "XGate"]);

    await page.mouse.dblclick(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual(["ControlGate"]);
  });

  test("keeps the clipboard when copying without selected gates", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );
    await page.keyboard.press("Control+c");
    await page.evaluate(() => {
      const app = window.pixiApp as
        | { selectedGates: Set<unknown> }
        | undefined;

      app?.selectedGates.clear();
    });

    await page.keyboard.press("Control+c");
    await page.mouse.click(
      circuitInfo.steps[2][0].x,
      circuitInfo.steps[2][0].y
    );
    await page.keyboard.press("Control+v");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "HGate" },
    ]);
  });

  test("uses the same paste anchor for consecutive pastes", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );
    await page.keyboard.press("Control+c");

    await page.keyboard.press("Control+v");
    await page.keyboard.press("Control+v");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "HGate" },
    ]);
  });

  test("preserves empty steps through paste, undo, and redo", async ({ page }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);

    await page.evaluate(() => {
      const app = window.pixiApp as
        | {
            circuitFrame: NonNullable<typeof window.pixiApp>["circuitFrame"];
            selectedGates: Set<unknown>;
          }
        | undefined;
      const circuit = app?.circuitFrame?.circuit;
      if (app === undefined || circuit === undefined) {
        throw new Error("App is not initialized");
      }

      circuit.fromJSON('{"cols":[["H",1],[1,1],["T",1]]}', true);

      const hGate = circuit.fetchStep(0).fetchDropzone(0).operation;
      const tGate = circuit.fetchStep(2).fetchDropzone(0).operation;
      if (hGate === null || tGate === null) {
        throw new Error("Test gates are not initialized");
      }

      app.selectedGates = new Set([hGate, tGate]);
    });
    await page.keyboard.press("Control+c");

    await page.keyboard.press("Control+v");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "TGate" },
      { stepIndex: 3, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 5, qubitIndex: 0, operationType: "TGate" },
    ]);

    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+Shift+z");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "TGate" },
      { stepIndex: 3, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 5, qubitIndex: 0, operationType: "TGate" },
    ]);
  });

  test("updates temporary selections as gates enter and leave the rectangle", async ({
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
    const updatedCircuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      updatedCircuitInfo.steps[2][0].x,
      updatedCircuitInfo.steps[0][0].y -
        updatedCircuitInfo.gatePalette.hGate.size * 2
    );
    await expect.poll(() => selectedGateTypes(page)).toEqual([]);

    const xGateCell = updatedCircuitInfo.steps[1][1];
    const selectionMargin = xGateCell.size;
    const start = {
      x: xGateCell.x + selectionMargin,
      y: xGateCell.y + selectionMargin,
    };
    const end = {
      x: xGateCell.x - selectionMargin,
      y: xGateCell.y - selectionMargin,
    };

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 5 });

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual(["HGate", "XGate"]);

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

async function activeCell(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const app = window.pixiApp as
      | {
          activeCell: { stepIndex: number; qubitIndex: number } | null;
        }
      | undefined;

    return app?.activeCell ?? null;
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

async function occupiedCells(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const steps = window.pixiApp?.circuitFrame?.circuit.steps ?? [];

    return steps.flatMap((step, stepIndex) =>
      step.dropzones.flatMap((dropzone, qubitIndex) => {
        const operation = dropzone.operation;

        return operation === null
          ? []
          : [{ stepIndex, qubitIndex, operationType: operation.operationType }];
      })
    );
  });
}

async function rectangleSelectionIsActive(
  page: import("@playwright/test").Page
) {
  return page.evaluate(() => {
    const app = window.pixiApp as
      | { rectangleSelectionBase: Set<unknown> | null }
      | undefined;

    return app?.rectangleSelectionBase != null;
  });
}

async function hoveredStepIndexes(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const steps = window.pixiApp?.circuitFrame?.circuit.steps ?? [];

    return steps.flatMap((step, index) => (step.isHovered ? [index] : []));
  });
}
