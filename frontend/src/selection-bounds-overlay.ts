import { Graphics } from "pixi.js";
import { Circuit, CircuitCellPosition } from "./circuit";
import { Colors } from "./colors";
import { Dropzone } from "./dropzone";
import { OperationComponent } from "./operation-component";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";

type DashLineDirection = "horizontal" | "vertical";
export type SelectionOutlineSide = "top" | "right" | "bottom" | "left";

export type SelectionOutlineEdge = {
  cell: CircuitCellPosition;
  side: SelectionOutlineSide;
};

export type DashSegment = {
  offset: number;
  length: number;
};

type LogicalSelection = {
  selectedOperations: OperationComponent[];
  connectedOperations: OperationComponent[];
};

type CellBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const NEIGHBOR_BY_SIDE: Record<
  SelectionOutlineSide,
  Pick<CircuitCellPosition, "stepIndex" | "qubitIndex">
> = {
  top: { stepIndex: 0, qubitIndex: -1 },
  right: { stepIndex: 1, qubitIndex: 0 },
  bottom: { stepIndex: 0, qubitIndex: 1 },
  left: { stepIndex: -1, qubitIndex: 0 },
};

/**
 * 選択セル群の外周を返す。セルに穴があれば、その穴の周囲も外周に含める。
 */
export function selectionOutlineEdges(
  cells: CircuitCellPosition[],
): SelectionOutlineEdge[] {
  const uniqueCells = new Map(
    cells.map((cell) => [cellKey(cell), cell] as const),
  );
  const edges: SelectionOutlineEdge[] = [];

  for (const cell of uniqueCells.values()) {
    for (const side of Object.keys(NEIGHBOR_BY_SIDE) as SelectionOutlineSide[]) {
      const neighbor = NEIGHBOR_BY_SIDE[side];
      const neighborKey = cellKey({
        stepIndex: cell.stepIndex + neighbor.stepIndex,
        qubitIndex: cell.qubitIndex + neighbor.qubitIndex,
      });

      if (!uniqueCells.has(neighborKey)) {
        edges.push({ cell, side });
      }
    }
  }

  return edges;
}

/**
 * 角を周期の基準点として、線と空白を一定周期で配置する。
 * 辺の両端は線の半分にし、隣の辺と合わさったとき通常の線幅になる。
 */
export function periodicDashSegments(
  totalLength: number,
  dashLength: number,
  gapLength: number,
): DashSegment[] {
  if (totalLength <= 0) {
    return [];
  }

  const period = dashLength + gapLength;
  const halfDashLength = dashLength / 2;
  const centers: number[] = [];
  for (let center = 0; center <= totalLength; center += period) {
    centers.push(center);
  }

  if (centers.at(-1) !== totalLength) {
    centers.push(totalLength);
  }

  return centers.map((center) => {
    const start = Math.max(0, center - halfDashLength);
    const end = Math.min(totalLength, center + halfDashLength);
    return { offset: start, length: end - start };
  });
}

function cellKey({ stepIndex, qubitIndex }: CircuitCellPosition): string {
  return `${stepIndex}:${qubitIndex}`;
}

/**
 * 複数の論理操作を選択したとき、選択セルの形に沿った点線外周を表示する。
 * 接続情報上ひとつの制御ゲート構造やSWAPだけなら点線は表示しない。
 */
export class SelectionBoundsOverlay extends Graphics {
  private static readonly OUTLINE_GAP = spacingInPx(0.5);
  private static readonly DASH_LENGTH = spacingInPx(1);
  private static readonly GAP_LENGTH = spacingInPx(0.5);
  private static readonly LINE_WIDTH = Spacing.borderWidth.gate.sm;

  constructor(private readonly circuit: Circuit) {
    super();

    this.eventMode = "none";
  }

  sync(selectedGates: Set<OperationComponent>): void {
    this.clear();

    const logicalSelections = this.logicalSelections(selectedGates);
    if (logicalSelections.length < 2) {
      return;
    }

    const selectedCells = this.selectedCells(logicalSelections, selectedGates);
    const selectedCellKeys = new Set(selectedCells.map(cellKey));
    for (const edge of selectionOutlineEdges(selectedCells)) {
      this.drawOutlineEdge(edge, selectedCellKeys);
    }
  }

  /**
   * 回路データ上で縦線接続されたゲート群を、ひとつの論理操作にまとめる。
   */
  private logicalSelections(
    selectedGates: Set<OperationComponent>,
  ): LogicalSelection[] {
    const remaining = new Set(selectedGates);
    const selections: LogicalSelection[] = [];

    while (remaining.size > 0) {
      const operation = remaining.values().next().value as OperationComponent;
      const connectedOperations = this.connectedStructureFor(operation);
      const selectedOperations = connectedOperations.filter((candidate) =>
        selectedGates.has(candidate),
      );

      if (!selectedOperations.includes(operation)) {
        selectedOperations.push(operation);
      }

      selectedOperations.forEach((candidate) => remaining.delete(candidate));
      selections.push({ selectedOperations, connectedOperations });
    }

    return selections;
  }

  /**
   * connectedOperationsForの結果を、実際の縦線接続でも検証する。
   */
  private connectedStructureFor(
    operation: OperationComponent,
  ): OperationComponent[] {
    const connectedOperations = Array.from(
      new Set(this.circuit.connectedOperationsFor(operation)),
    );
    const positions = connectedOperations.flatMap((candidate) => {
      const position = this.circuit.findOperationPosition(candidate);
      return position === null ? [] : [position];
    });

    if (
      connectedOperations.length < 2 ||
      positions.length !== connectedOperations.length ||
      positions.some(
        (position) => position.stepIndex !== positions[0].stepIndex,
      )
    ) {
      return [operation];
    }

    const step = this.circuit.fetchStep(positions[0].stepIndex);
    const minQubitIndex = Math.min(
      ...positions.map((position) => position.qubitIndex),
    );
    const maxQubitIndex = Math.max(
      ...positions.map((position) => position.qubitIndex),
    );

    for (
      let qubitIndex = minQubitIndex;
      qubitIndex < maxQubitIndex;
      qubitIndex++
    ) {
      const upperDropzone = step.fetchDropzone(qubitIndex);
      const lowerDropzone = step.fetchDropzone(qubitIndex + 1);
      if (!upperDropzone.connectBottom || !lowerDropzone.connectTop) {
        return [operation];
      }
    }

    return connectedOperations;
  }

  /**
   * 完全に選択された接続構造は、縦線が通る中間セルも形の一部にする。
   */
  private selectedCells(
    selections: LogicalSelection[],
    selectedGates: Set<OperationComponent>,
  ): CircuitCellPosition[] {
    const cells = new Map<string, CircuitCellPosition>();

    for (const selection of selections) {
      const selectedPositions = selection.selectedOperations.flatMap(
        (operation) => {
          const position = this.circuit.findOperationPosition(operation);
          return position === null ? [] : [position];
        },
      );
      selectedPositions.forEach((position) =>
        cells.set(cellKey(position), position),
      );

      const isCompleteConnectedStructure =
        selection.connectedOperations.length > 1 &&
        selection.connectedOperations.every((operation) =>
          selectedGates.has(operation),
        );
      if (!isCompleteConnectedStructure || selectedPositions.length === 0) {
        continue;
      }

      const stepIndex = selectedPositions[0].stepIndex;
      const minQubitIndex = Math.min(
        ...selectedPositions.map((position) => position.qubitIndex),
      );
      const maxQubitIndex = Math.max(
        ...selectedPositions.map((position) => position.qubitIndex),
      );
      for (
        let qubitIndex = minQubitIndex;
        qubitIndex <= maxQubitIndex;
        qubitIndex++
      ) {
        const position = { stepIndex, qubitIndex };
        cells.set(cellKey(position), position);
      }
    }

    return Array.from(cells.values());
  }

  private drawOutlineEdge(
    { cell, side }: SelectionOutlineEdge,
    selectedCellKeys: Set<string>,
  ): void {
    const bounds = this.cellBounds(cell);
    if (bounds === null) {
      return;
    }

    const horizontalBridgeLength =
      this.stepPitch() - (bounds.right - bounds.left);
    const verticalBridgeLength =
      this.qubitPitch() - (bounds.bottom - bounds.top);
    const hasNeighbor = (neighborSide: SelectionOutlineSide) => {
      const neighbor = NEIGHBOR_BY_SIDE[neighborSide];
      return selectedCellKeys.has(
        cellKey({
          stepIndex: cell.stepIndex + neighbor.stepIndex,
          qubitIndex: cell.qubitIndex + neighbor.qubitIndex,
        }),
      );
    };

    switch (side) {
      case "top": {
        const leftExtension = hasNeighbor("left")
          ? horizontalBridgeLength
          : 0;
        const rightExtension = hasNeighbor("right")
          ? horizontalBridgeLength
          : 0;
        this.drawDashedLine(
          bounds.left - leftExtension,
          bounds.top,
          bounds.right - bounds.left + leftExtension + rightExtension,
          "horizontal",
        );
        break;
      }
      case "right": {
        const topExtension = hasNeighbor("top") ? verticalBridgeLength : 0;
        const bottomExtension = hasNeighbor("bottom")
          ? verticalBridgeLength
          : 0;
        this.drawDashedLine(
          bounds.right,
          bounds.top - topExtension,
          bounds.bottom - bounds.top + topExtension + bottomExtension,
          "vertical",
        );
        break;
      }
      case "bottom": {
        const leftExtension = hasNeighbor("left")
          ? horizontalBridgeLength
          : 0;
        const rightExtension = hasNeighbor("right")
          ? horizontalBridgeLength
          : 0;
        this.drawDashedLine(
          bounds.left - leftExtension,
          bounds.bottom,
          bounds.right - bounds.left + leftExtension + rightExtension,
          "horizontal",
        );
        break;
      }
      case "left": {
        const topExtension = hasNeighbor("top") ? verticalBridgeLength : 0;
        const bottomExtension = hasNeighbor("bottom")
          ? verticalBridgeLength
          : 0;
        this.drawDashedLine(
          bounds.left,
          bounds.top - topExtension,
          bounds.bottom - bounds.top + topExtension + bottomExtension,
          "vertical",
        );
        break;
      }
    }
  }

  private cellBounds(position: CircuitCellPosition): CellBounds | null {
    const step = this.circuit.steps[position.stepIndex];
    const dropzone = step?.dropzones[position.qubitIndex];
    if (dropzone === undefined) {
      return null;
    }

    const topLeft = this.toLocal(dropzone.getGlobalPosition());
    const inset =
      Dropzone.GATE_INSET_OFFSET - SelectionBoundsOverlay.OUTLINE_GAP;
    const outlineSize =
      Dropzone.sizeInPx + SelectionBoundsOverlay.OUTLINE_GAP * 2;
    return {
      left: topLeft.x + inset,
      top: topLeft.y + inset,
      right: topLeft.x + inset + outlineSize,
      bottom: topLeft.y + inset + outlineSize,
    };
  }

  private stepPitch(): number {
    return this.circuit.steps[0]?.dropzones[0]?.totalSize ?? Dropzone.sizeInPx;
  }

  private qubitPitch(): number {
    const dropzones = this.circuit.steps[0]?.dropzones;
    if (dropzones !== undefined && dropzones.length >= 2) {
      return (
        dropzones[1].getGlobalPosition().y -
        dropzones[0].getGlobalPosition().y
      );
    }

    return this.circuit.steps[0]?.dropzones[0]?.totalSize ?? Dropzone.sizeInPx;
  }

  /**
   * Pixi Graphicsには破線strokeがないため、短い矩形を並べて点線を描く。
   */
  private drawDashedLine(
    x: number,
    y: number,
    length: number,
    direction: DashLineDirection,
  ): void {
    const segments = periodicDashSegments(
      length,
      SelectionBoundsOverlay.DASH_LENGTH,
      SelectionBoundsOverlay.GAP_LENGTH,
    );

    for (const segment of segments) {
      const isHorizontal = direction === "horizontal";

      this.rect(
        isHorizontal
          ? x + segment.offset
          : x - SelectionBoundsOverlay.LINE_WIDTH / 2,
        isHorizontal
          ? y - SelectionBoundsOverlay.LINE_WIDTH / 2
          : y + segment.offset,
        isHorizontal ? segment.length : SelectionBoundsOverlay.LINE_WIDTH,
        isHorizontal ? SelectionBoundsOverlay.LINE_WIDTH : segment.length,
      ).fill(Colors["border-component-strong"]);
    }
  }
}
