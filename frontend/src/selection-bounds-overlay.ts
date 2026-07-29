import { Graphics, Point } from "pixi.js";
import { Colors } from "./colors";
import { OperationComponent } from "./operation-component";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type LocalBounds = {
  topLeft: Point;
  bottomRight: Point;
};

type DashLineDirection = "horizontal" | "vertical";

/**
 * 複数選択されたゲート群のまとまりを、外接する点線枠で表示する。
 * 実際の選択状態は各ゲートの選択枠を正とし、この枠は範囲把握の補助表示に留める。
 */
export class SelectionBoundsOverlay extends Graphics {
  private static readonly PADDING = spacingInPx(1);
  private static readonly DASH_LENGTH = spacingInPx(2);
  private static readonly GAP_LENGTH = spacingInPx(1.5);
  private static readonly LINE_WIDTH = Spacing.borderWidth.gate.lg;

  constructor() {
    super();

    this.eventMode = "none";
  }

  sync(selectedGates: Set<OperationComponent>): void {
    this.clear();

    if (selectedGates.size < 2) {
      return;
    }

    const bounds = this.selectedGateBounds(selectedGates);
    if (bounds === null) {
      return;
    }

    this.drawDashedBounds(bounds);
  }

  /**
   * 選択中ゲートの外接矩形を、画面上の座標で求める。
   */
  private selectedGateBounds(
    selectedGates: Set<OperationComponent>,
  ): Bounds | null {
    const selectedOperations = Array.from(selectedGates);
    if (selectedOperations.length === 0) {
      return null;
    }

    const firstBounds = selectedOperations[0].getBounds();
    const bounds = {
      left: firstBounds.left,
      top: firstBounds.top,
      right: firstBounds.right,
      bottom: firstBounds.bottom,
    };

    for (const operation of selectedOperations.slice(1)) {
      const operationBounds = operation.getBounds();

      bounds.left = Math.min(bounds.left, operationBounds.left);
      bounds.top = Math.min(bounds.top, operationBounds.top);
      bounds.right = Math.max(bounds.right, operationBounds.right);
      bounds.bottom = Math.max(bounds.bottom, operationBounds.bottom);
    }

    return bounds;
  }

  private drawDashedBounds({ left, top, right, bottom }: Bounds): void {
    const { topLeft, bottomRight } = this.paddedLocalBounds({
      left,
      top,
      right,
      bottom,
    });

    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    this.drawDashedLine(topLeft.x, topLeft.y, width, "horizontal");
    this.drawDashedLine(topLeft.x, bottomRight.y, width, "horizontal");
    this.drawDashedLine(topLeft.x, topLeft.y, height, "vertical");
    this.drawDashedLine(bottomRight.x, topLeft.y, height, "vertical");
  }

  private paddedLocalBounds({ left, top, right, bottom }: Bounds): LocalBounds {
    return {
      topLeft: this.toLocal(
        new Point(
          left - SelectionBoundsOverlay.PADDING,
          top - SelectionBoundsOverlay.PADDING,
        ),
      ),
      bottomRight: this.toLocal(
        new Point(
          right + SelectionBoundsOverlay.PADDING,
          bottom + SelectionBoundsOverlay.PADDING,
        ),
      ),
    };
  }

  /**
   * Pixi Graphics には破線strokeがないため、短い矩形を並べて点線枠を作る。
   */
  private drawDashedLine(
    x: number,
    y: number,
    length: number,
    direction: DashLineDirection,
  ): void {
    const step =
      SelectionBoundsOverlay.DASH_LENGTH + SelectionBoundsOverlay.GAP_LENGTH;

    for (let offset = 0; offset < length; offset += step) {
      const segmentLength = Math.min(
        SelectionBoundsOverlay.DASH_LENGTH,
        length - offset,
      );

      const segment = this.dashSegmentRect(
        x,
        y,
        offset,
        segmentLength,
        direction,
      );

      this.rect(segment.x, segment.y, segment.width, segment.height).fill(
        Colors["border-component-strong"],
      );
    }
  }

  private dashSegmentRect(
    x: number,
    y: number,
    offset: number,
    length: number,
    direction: DashLineDirection,
  ): { x: number; y: number; width: number; height: number } {
    if (direction === "horizontal") {
      return {
        x: x + offset,
        y: y - SelectionBoundsOverlay.LINE_WIDTH / 2,
        width: length,
        height: SelectionBoundsOverlay.LINE_WIDTH,
      };
    }

    return {
      x: x - SelectionBoundsOverlay.LINE_WIDTH / 2,
      y: y + offset,
      width: SelectionBoundsOverlay.LINE_WIDTH,
      height: length,
    };
  }
}
