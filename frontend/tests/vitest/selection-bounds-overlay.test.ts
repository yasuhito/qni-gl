import { describe, expect, it } from "vitest";
import { Circuit, CircuitCellPosition } from "../../src/circuit";
import {
  SelectionBoundsOverlay,
  periodicDashSegments,
  selectionOutlineEdges,
} from "../../src/selection-bounds-overlay";

const controllableGateLabels = [
  "H",
  "X",
  "Y",
  "Z",
  "S",
  "S†",
  "T",
  "T†",
  "X^½",
];
const connectedStructureCases: Array<[string, (string | number)[][]]> = [
  ...controllableGateLabels.flatMap((targetLabel) =>
    [1, 2, 3].map(
      (controlCount): [string, (string | number)[][]] => [
        `${"C".repeat(controlCount)}${targetLabel}`,
        [[...Array<string>(controlCount).fill("•"), targetLabel]],
      ],
    ),
  ),
  ["SWAP", [["Swap", 1, "Swap"]]],
];

describe("SelectionBoundsOverlay", () => {
  it.each(connectedStructureCases)(
    "treats one connected %s structure as one operation",
    (_name, cols) => {
      const circuit = new Circuit({ minWireCount: 1, stepCount: 1 });
      circuit.fromJSON(JSON.stringify({ cols }), true);
      const selectedGates = new Set(
        circuit.fetchStep(0).dropzones.flatMap((dropzone) =>
          dropzone.operation === null ? [] : [dropzone.operation],
        ),
      );
      const overlay = new SelectionBoundsOverlay(circuit);

      overlay.sync(selectedGates);

      expect(overlay.context.instructions).toHaveLength(0);
    },
  );

  it("draws an outline when two connected operations are selected", () => {
    const circuit = new Circuit({ minWireCount: 1, stepCount: 1 });
    circuit.fromJSON(
      '{"cols":[["•",1,"X"],["•",1,"X"]]}',
      true,
    );
    const selectedGates = new Set(
      circuit.steps.flatMap((step) =>
        step.dropzones.flatMap((dropzone) =>
          dropzone.operation === null ? [] : [dropzone.operation],
        ),
      ),
    );
    const overlay = new SelectionBoundsOverlay(circuit);

    overlay.sync(selectedGates);

    expect(overlay.context.instructions.length).toBeGreaterThan(0);
  });
});

describe("selectionOutlineEdges", () => {
  it("follows an L-shaped selection instead of drawing its bounding box", () => {
    const cells: CircuitCellPosition[] = [
      { stepIndex: 0, qubitIndex: 0 },
      { stepIndex: 1, qubitIndex: 0 },
      { stepIndex: 0, qubitIndex: 1 },
    ];

    expect(selectionOutlineEdges(cells)).toHaveLength(8);
  });

  it("keeps an inner outline around an unselected enclosed cell", () => {
    const cells: CircuitCellPosition[] = [];
    for (let stepIndex = 0; stepIndex < 3; stepIndex++) {
      for (let qubitIndex = 0; qubitIndex < 3; qubitIndex++) {
        if (stepIndex !== 1 || qubitIndex !== 1) {
          cells.push({ stepIndex, qubitIndex });
        }
      }
    }

    const edges = selectionOutlineEdges(cells);

    expect(edges).toHaveLength(16);
    expect(edges).toEqual(
      expect.arrayContaining([
        { cell: { stepIndex: 1, qubitIndex: 0 }, side: "bottom" },
        { cell: { stepIndex: 0, qubitIndex: 1 }, side: "right" },
        { cell: { stepIndex: 2, qubitIndex: 1 }, side: "left" },
        { cell: { stepIndex: 1, qubitIndex: 2 }, side: "top" },
      ]),
    );
  });
});

describe("periodicDashSegments", () => {
  it("uses half dashes at both ends so adjacent edges form one normal dash", () => {
    const totalLength = 36;
    const segments = periodicDashSegments(totalLength, 4, 2);
    const firstSegment = segments[0];
    const lastSegment = segments.at(-1);

    expect(firstSegment).toEqual({ offset: 0, length: 2 });
    expect(lastSegment).toEqual({ offset: 34, length: 2 });
  });

  it("keeps the four-pixel dash and two-pixel gap cycle within an edge", () => {
    expect(periodicDashSegments(12, 4, 2)).toEqual([
      { offset: 0, length: 2 },
      { offset: 4, length: 4 },
      { offset: 10, length: 2 },
    ]);
  });
});
