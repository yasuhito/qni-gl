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

  test("undoes a drag placement without reverting the previous paste", async ({
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

    const updatedCircuitInfo = await getCircuitInfo(page);
    await dragAndDrop(page, updatedCircuitInfo.gatePalette.yGate, {
      step: 2,
      bit: 1,
    });

    await page.keyboard.press("Control+z");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "HGate" },
    ]);
  });

  test("undoes a deletion without reverting the previous paste", async ({
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

    const updatedCircuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      updatedCircuitInfo.steps[1][0].x,
      updatedCircuitInfo.steps[1][0].y
    );
    await page.keyboard.press("Delete");
    await page.keyboard.press("Control+z");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "HGate" },
    ]);
  });

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

  test("replaces the previous selection with a plain rectangle selection", async ({
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
    await dragAndDrop(page, circuitInfo.gatePalette.tGate, {
      step: 2,
      bit: 1,
    });
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await page.mouse.move(
      circuitInfo.steps[1][1].x,
      circuitInfo.steps[1][1].y
    );
    await page.mouse.down();
    await page.mouse.move(
      circuitInfo.steps[2][0].x,
      circuitInfo.steps[2][0].y,
      { steps: 5 }
    );
    await page.mouse.up();

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "TGate",
      "XGate",
    ]);
  });

  test("keeps the previous selection with a Shift rectangle selection", async ({
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
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y
    );

    await page.keyboard.down("Shift");
    await page.mouse.move(
      circuitInfo.steps[1][1].x + circuitInfo.steps[1][1].size,
      circuitInfo.steps[1][1].y + circuitInfo.steps[1][1].size
    );
    await page.mouse.down();
    await page.mouse.move(
      circuitInfo.steps[1][1].x - circuitInfo.steps[1][1].size,
      circuitInfo.steps[1][1].y - circuitInfo.steps[1][1].size,
      { steps: 5 }
    );
    await page.mouse.up();
    await page.keyboard.up("Shift");

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "HGate",
      "XGate",
    ]);
  });

  test("keeps selected gate borders visible while gates are hovered", async ({
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
    await dragAndDrop(page, circuitInfo.gatePalette.tGate, {
      step: 2,
      bit: 0,
    });

    await page.mouse.click(circuitInfo.steps[0][0].x, circuitInfo.steps[0][0].y);
    await page.keyboard.down("Shift");
    await page.mouse.click(circuitInfo.steps[1][0].x, circuitInfo.steps[1][0].y);
    await page.keyboard.up("Shift");

    await expect.poll(() => selectedGateEmphasis(page)).toEqual({
      HGate: true,
      TGate: false,
      XGate: true,
    });

    await page.mouse.move(circuitInfo.steps[2][0].x, circuitInfo.steps[2][0].y);
    await expect.poll(() => selectedGateEmphasis(page)).toEqual({
      HGate: true,
      TGate: false,
      XGate: true,
    });

    await page.mouse.move(circuitInfo.steps[0][0].x, circuitInfo.steps[0][0].y);
    await expect.poll(() => selectedGateEmphasis(page)).toEqual({
      HGate: true,
      TGate: false,
      XGate: true,
    });

    await page.mouse.move(circuitInfo.steps[4][1].x, circuitInfo.steps[4][1].y);
    await expect.poll(() => selectedGateEmphasis(page)).toEqual({
      HGate: true,
      TGate: false,
      XGate: true,
    });
    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "HGate",
      "XGate",
    ]);

    await page.keyboard.press("Escape");
    await expect.poll(() => selectedGateEmphasis(page)).toEqual({
      HGate: false,
      TGate: false,
      XGate: false,
    });
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

  test("selects all gates, cuts them, and redoes the cut with Ctrl+Y", async ({
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

    await page.keyboard.press("Control+a");
    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "HGate",
      "XGate",
    ]);

    await page.keyboard.press("Control+x");
    await expect.poll(() => occupiedCells(page)).toEqual([]);

    await page.keyboard.press("Control+z");
    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 1, operationType: "XGate" },
    ]);

    await page.keyboard.press("Control+y");
    await expect.poll(() => occupiedCells(page)).toEqual([]);
  });

  test("keeps a gapped CNOT available for paste after Ctrl+X", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.waitForSelector('#app[data-state="idle"]');
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON('{"cols":[["•",1,"X"]]}', true);
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.keyboard.press("Control+x");
    await expect.poll(() => occupiedCells(page)).toEqual([]);

    await page.keyboard.press("Control+v");
    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "ControlGate" },
      { stepIndex: 0, qubitIndex: 2, operationType: "XGate" },
    ]);
  });

  test("does not draw a dashed outline around one connected operation", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["•",1,"X"]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(circuitInfo.steps[0][0].x, circuitInfo.steps[0][0].y);

    const outlineInstructionCount = await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        selectionBoundsOverlay: {
          context: { instructions: unknown[] };
        };
      };
      return app.selectionBoundsOverlay.context.instructions.length;
    });
    expect(outlineInstructionCount).toBe(0);
  });

  test("draws a dashed outline when two connected operations are selected", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["•",1,"X"],["•",1,"X"]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(circuitInfo.steps[0][0].x, circuitInfo.steps[0][0].y);
    await page.keyboard.down("Shift");
    await page.mouse.click(circuitInfo.steps[1][0].x, circuitInfo.steps[1][0].y);
    await page.keyboard.up("Shift");

    const outlineInstructionCount = await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        selectionBoundsOverlay: {
          context: { instructions: unknown[] };
        };
      };
      return app.selectionBoundsOverlay.context.instructions.length;
    });
    expect(outlineInstructionCount).toBeGreaterThan(0);
  });

  test("compacts cut steps and pastes noncontiguous selections without gaps", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.waitForSelector('#app[data-state="idle"]');
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["H",1],["X",1],["Z",1]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.keyboard.down("Shift");
    await page.mouse.click(
      circuitInfo.steps[2][0].x,
      circuitInfo.steps[2][0].y,
    );
    await page.keyboard.up("Shift");

    await page.keyboard.press("Control+x");
    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "XGate" },
    ]);

    await page.keyboard.press("Control+v");
    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "XGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "ZGate" },
    ]);
  });

  test("shows keyboard shortcuts from the menu", async ({ page }) => {
    await page.locator("#menu-button").click();
    await page.locator("#menu-item-shortcuts").click();

    const help = page.locator("#shortcut-help-dialog");
    await expect(help).toBeVisible();
    await expect(help.getByRole("row", { name: "Select all Ctrl+A ⌘A" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Cut Ctrl+X ⌘X" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Copy Ctrl+C ⌘C" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Paste Ctrl+V ⌘V" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Undo Ctrl+Z ⌘Z" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Redo Ctrl+Y ⌘Y" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Ctrl+Shift+Z ⇧⌘Z" })).toBeVisible();
    await expect(help.getByRole("row", { name: "Delete Delete ⌫" })).toBeVisible();
    await expect(
      help.getByRole("row", { name: "Clear selection / marker Esc Esc" }),
    ).toBeVisible();

    const separatorXPositions = await help
      .locator("[data-shortcut-separator]")
      .evaluateAll((separators) =>
        separators.map((separator) => separator.getBoundingClientRect().x),
      );
    expect(new Set(separatorXPositions).size).toBe(1);

    await page.getByLabel("Close keyboard shortcuts").click();
    await expect(help).not.toBeVisible();
  });

  test("adds interactive wires required by the paste anchor", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.waitForSelector('#app[data-state="idle"]');
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["•",1,"X"],[1,1,1]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.keyboard.press("Control+c");
    await page.mouse.click(
      circuitInfo.steps[1][2].x,
      circuitInfo.steps[1][2].y,
    );

    const preview = await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        circuit: {
          steps: Array<{ height: number }>;
          markerManager: {
            children: Array<{ getBounds(): { height: number } }>;
          };
        };
        pasteAnchorPreview: {
          container: {
            children: Array<{
              getBounds(): { x: number; y: number; width: number; height: number };
            }>;
          };
        };
      };

      const circuit = app.circuit;

      return {
        placementChildCount:
          app.pasteAnchorPreview.container.children.length,
        stepHeight: circuit.steps[0].height,
        markerHeight: circuit.markerManager.children[0].getBounds().height,
      };
    });

    const previewCircuitInfo = await getCircuitInfo(page);
    expect(preview.placementChildCount).toBe(2);
    expect(preview.markerHeight).toBeGreaterThanOrEqual(preview.stepHeight);
    expect(preview.markerHeight - preview.stepHeight).toBeLessThanOrEqual(4);
    previewCircuitInfo.steps.forEach((step) => expect(step).toHaveLength(5));
    await dragAndDrop(page, previewCircuitInfo.gatePalette.hGate, {
      step: 1,
      bit: 3,
    });
    await expect.poll(() => occupiedCells(page)).toContainEqual({
      stepIndex: 1,
      qubitIndex: 3,
      operationType: "HGate",
    });
  });

  test("removes the unused third wire after closing a CNOT gap", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.controlGate, {
      step: 0,
      bit: 0,
    });
    await dragAndDrop(page, circuitInfo.gatePalette.xGate, {
      step: 0,
      bit: 2,
    });

    const expandedCircuitInfo = await getCircuitInfo(page);
    expect(expandedCircuitInfo.steps[0]).toHaveLength(3);

    await dragAndDrop(page, expandedCircuitInfo.steps[0][2], {
      step: 0,
      bit: 1,
    });

    const compactCircuitInfo = await getCircuitInfo(page);
    expect(compactCircuitInfo.steps[0]).toHaveLength(2);
    const selectionBottom = await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        selectionBoundsOverlay: { getBounds(): { bottom: number } };
      };
      return app.selectionBoundsOverlay.getBounds().bottom;
    });
    expect(selectionBottom).toBeLessThan(
      expandedCircuitInfo.steps[0][2].y,
    );
    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "ControlGate" },
      { stepIndex: 0, qubitIndex: 1, operationType: "XGate" },
    ]);
  });

  test("clears the selection and paste anchor with Escape", async ({
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

    await page.keyboard.press("Escape");

    await expect.poll(() => selectedGateTypes(page)).toEqual([]);
    await expect.poll(() => pasteAnchorCell(page)).toBeNull();
  });

  test("clears stale selection state when the circuit is cleared", async ({
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

    await page.keyboard.down("Shift");
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.mouse.click(
      circuitInfo.steps[1][1].x,
      circuitInfo.steps[1][1].y,
    );
    await page.keyboard.up("Shift");

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "HGate",
      "XGate",
    ]);

    await page.locator("#menu-button").click();
    await page.locator("#menu-item-clear-circuit").click();

    await expect.poll(() => selectedGateTypes(page)).toEqual([]);
    await expect.poll(() => pasteAnchorCell(page)).toBeNull();
    await expect.poll(() => occupiedCells(page)).toEqual([]);
  });

  test("undoes Clear circuit as the latest edit", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });

    await page.locator("#menu-button").click();
    await page.locator("#menu-item-clear-circuit").click();
    await expect.poll(() => occupiedCells(page)).toEqual([]);

    await page.keyboard.press("Control+z");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
    ]);
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
    await expect.poll(() => pasteAnchorCell(page)).toEqual({
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
    await expect.poll(() => pasteAnchorCell(page)).toEqual({
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

    await expect.poll(() => pasteAnchorCell(page)).toEqual({
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

  test("clears the selection and paste anchor on a background click", async ({
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
    await expect.poll(() => pasteAnchorCell(page)).toBeNull();

    await page.mouse.click(
      circuitInfo.steps[2][1].x,
      circuitInfo.steps[2][1].y
    );

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

  test("selects a whole CCNOT with an ordinary click", async ({ page }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["H",1,1],["•","•","X"]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      circuitInfo.steps[1][2].x,
      circuitInfo.steps[1][2].y,
    );

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "ControlGate",
      "ControlGate",
      "XGate",
    ]);

    await page.keyboard.press("Escape");
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.keyboard.down("Shift");
    await page.mouse.click(
      circuitInfo.steps[1][2].x,
      circuitInfo.steps[1][2].y,
    );
    await page.keyboard.up("Shift");

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "ControlGate",
      "ControlGate",
      "HGate",
      "XGate",
    ]);
  });

  test("adds connected gate parts individually with Shift double clicks", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      window.pixiApp?.circuit.fromJSON(
        '{"cols":[["H",1,1],[1,1,"T"],["•","•","X"]]}',
        true,
      );
    });

    const circuitInfo = await getCircuitInfo(page);
    await page.mouse.click(
      circuitInfo.steps[0][0].x,
      circuitInfo.steps[0][0].y,
    );
    await page.keyboard.down("Shift");
    await page.mouse.click(
      circuitInfo.steps[1][2].x,
      circuitInfo.steps[1][2].y,
    );
    await page.mouse.dblclick(
      circuitInfo.steps[2][2].x,
      circuitInfo.steps[2][2].y,
    );
    await page.keyboard.up("Shift");

    await expect
      .poll(() => selectedGateTypes(page))
      .toEqual(["HGate", "TGate", "XGate"]);

    await page.keyboard.down("Shift");
    await page.mouse.dblclick(
      circuitInfo.steps[2][0].x,
      circuitInfo.steps[2][0].y,
    );
    await page.mouse.dblclick(
      circuitInfo.steps[2][1].x,
      circuitInfo.steps[2][1].y,
    );
    await page.keyboard.up("Shift");

    await expect.poll(() => selectedGateTypes(page)).toEqual([
      "ControlGate",
      "ControlGate",
      "HGate",
      "TGate",
      "XGate",
    ]);
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

  test("shows immediate feedback after copying", async ({
    page,
    circuitInfo,
  }) => {
    await dragAndDrop(page, circuitInfo.gatePalette.hGate, {
      step: 0,
      bit: 0,
    });
    await page.mouse.click(circuitInfo.steps[0][0].x, circuitInfo.steps[0][0].y);

    await page.keyboard.press("Control+c");

    const feedbackAlpha = await page.evaluate(() => {
      const gate = window.pixiApp?.circuit.fetchStep(0).fetchDropzone(0)
        .operation as unknown as {
          emphasisOverlay: { alpha: number } | null;
        };
      return gate.emphasisOverlay?.alpha ?? 0;
    });
    expect(feedbackAlpha).toBeGreaterThan(0);
  });

  test("rejects an over-limit paste without changing circuit or history", async ({
    page,
  }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        circuit: NonNullable<typeof window.pixiApp>["circuit"];
        selectedGates: Set<unknown>;
        pasteAnchorCell: { stepIndex: number; qubitIndex: number } | null;
        updatePasteAnchorPreview(): void;
      };
      const emptyWires = Array(32).fill(1);
      const cnotWires: Array<string | number> = Array(32).fill(1);
      cnotWires[0] = "•";
      cnotWires[1] = "X";
      app.circuit.fromJSON(
        JSON.stringify({ cols: [cnotWires, emptyWires] }),
        true,
      );
      app.selectedGates = new Set(
        app.circuit.connectedOperationsFor(
          app.circuit.fetchStep(0).fetchDropzone(0).operation!,
        ),
      );
    });
    await page.keyboard.press("Control+c");
    await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        pasteAnchorCell: { stepIndex: number; qubitIndex: number } | null;
        updatePasteAnchorPreview(): void;
      };
      app.pasteAnchorCell = { stepIndex: 1, qubitIndex: 31 };
      app.updatePasteAnchorPreview();
    });

    const before = await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        circuit: NonNullable<typeof window.pixiApp>["circuit"];
        editUndoStack: string[];
      };
      return {
        json: app.circuit.toJSON(true),
        wireCount: app.circuit.wireCount,
        undoCount: app.editUndoStack.length,
      };
    });
    await page.keyboard.press("Control+v");

    await expect.poll(async () =>
      page.evaluate(() => {
        const app = window.pixiApp as unknown as {
          circuit: NonNullable<typeof window.pixiApp>["circuit"];
          editUndoStack: string[];
        };
        return {
          json: app.circuit.toJSON(true),
          wireCount: app.circuit.wireCount,
          undoCount: app.editUndoStack.length,
        };
      }),
    ).toEqual(before);
  });

  test("keeps internal empty steps after a URL reload", async ({ page }) => {
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      const app = window.pixiApp;
      app?.circuit.fromJSON(
        '{"cols":[["H",1],[1,1],["X",1]]}',
        true,
      );
      app?.updateUrlWithCircuit();
    });

    const savedCircuit = await page.evaluate(() =>
      JSON.parse(decodeURIComponent(location.hash.slice("#circuit=".length))),
    );
    expect(savedCircuit.cols).toEqual([["H", 1], [1, 1], ["X", 1]]);

    await page.reload();
    await page.waitForFunction(() => window.pixiApp !== undefined);

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "XGate" },
    ]);
  });

  test("scrolls the pasted range into view", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.waitForFunction(() => window.pixiApp !== undefined);
    await page.evaluate(() => {
      const app = window.pixiApp as unknown as {
        circuit: NonNullable<typeof window.pixiApp>["circuit"];
        selectedGates: Set<unknown>;
      };
      app.circuit.fromJSON(
        JSON.stringify({ cols: Array(30).fill(["H", 1]) }),
        true,
      );
      app.selectedGates = new Set([
        app.circuit.fetchStep(29).fetchDropzone(0).operation!,
      ]);
    });
    await page.waitForFunction(() =>
      (window.pixiApp?.circuit.steps ?? []).every((step) =>
        step.dropzones.every(
          (dropzone) =>
            dropzone.operation === null || dropzone.operation.sprite !== undefined,
        ),
      ),
    );

    await page.keyboard.press("Control+c");
    await page.keyboard.press("Control+v");

    expect(pageErrors).toEqual([]);

    await expect.poll(async () =>
      page.evaluate(() => {
        const app = window.pixiApp as unknown as {
          circuitFrame: { scrollContainer: { x: number } };
        };
        return app.circuitFrame.scrollContainer.x;
      }),
    ).toBeLessThan(0);
    await expect.poll(async () =>
      page.evaluate(() => {
        const app = window.pixiApp as unknown as {
          circuit: NonNullable<typeof window.pixiApp>["circuit"];
          circuitFrame: {
            maskSprite: { width: number };
            getGlobalPosition(): { x: number };
          };
        };
        const viewportRight =
          app.circuitFrame.getGlobalPosition().x +
          app.circuitFrame.maskSprite.width;
        return app.circuit.fetchStep(30).getBounds().right <= viewportRight;
      }),
    ).toBe(true);
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

  test("keeps compact pasted steps through undo and redo", async ({ page }) => {
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

      circuit.fromJSON(
        '{"cols":[["H",1],["X",1],["T",1]]}',
        true,
      );

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
      { stepIndex: 1, qubitIndex: 0, operationType: "XGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "TGate" },
      { stepIndex: 3, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 4, qubitIndex: 0, operationType: "TGate" },
    ]);

    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+Shift+z");

    await expect.poll(() => occupiedCells(page)).toEqual([
      { stepIndex: 0, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 1, qubitIndex: 0, operationType: "XGate" },
      { stepIndex: 2, qubitIndex: 0, operationType: "TGate" },
      { stepIndex: 3, qubitIndex: 0, operationType: "HGate" },
      { stepIndex: 4, qubitIndex: 0, operationType: "TGate" },
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

async function pasteAnchorCell(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const app = window.pixiApp as
      | {
          pasteAnchorCell: { stepIndex: number; qubitIndex: number } | null;
        }
      | undefined;

    return app?.pasteAnchorCell ?? null;
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

async function selectedGateEmphasis(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const steps = window.pixiApp?.circuit.steps ?? [];

    return Object.fromEntries(
      steps.flatMap((step) =>
        step.dropzones.flatMap((dropzone) => {
          const operation = dropzone.operation as
            | (NonNullable<typeof dropzone.operation> & {
                selectionEmphasisOverlay: unknown | null;
              })
            | null;

          return operation === null
            ? []
            : [
                [
                  operation.operationType,
                  operation.selectionEmphasisOverlay !== null,
                ],
              ];
        }),
      ),
    );
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
