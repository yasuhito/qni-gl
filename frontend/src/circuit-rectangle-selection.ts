import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Point,
  Rectangle,
} from "pixi.js";
import { Circuit } from "./circuit";
import { CircuitStep } from "./circuit-step";
import { Colors } from "./colors";
import { Dropzone } from "./dropzone";
import { CIRCUIT_FRAME_EVENTS, DROPZONE_EVENTS } from "./events";
import { OperationComponent } from "./operation-component";
import { OperationPalette } from "./operation-palette";

type RectangleBounds = Pick<Rectangle, "left" | "right" | "top" | "bottom">;

/**
 * 矩形の描画と、矩形に触れたゲートの検出を管理する。
 */
export class CircuitRectangleSelection {
  private static readonly DRAG_THRESHOLD = 4;
  private static readonly FILL_ALPHA = 0.35;
  private static readonly BORDER_WIDTH = 1;

  private readonly rectangle = new Graphics();
  private start: Point | null = null;
  private startDropzone: Dropzone | null = null;
  private startStep: CircuitStep | null = null;
  private isDragging = false;

  constructor(
    private readonly stage: Container,
    private readonly circuit: Circuit,
    private readonly operationPalette: OperationPalette,
  ) {
    this.rectangle.eventMode = "none";
    this.stage.addChild(this.rectangle);

    this.stage
      .on("pointerdowncapture", this.startSelection, this)
      .on("globalpointermove", this.updateSelection, this)
      .on("pointerup", this.finishSelection, this)
      .on("pointerupoutside", this.finishSelection, this);
  }

  private startSelection(event: FederatedPointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    // 既存のゲート操作とパレットからのドラッグを優先する。
    if (
      this.findAncestor(event.target, OperationComponent) !== null ||
      this.findAncestor(event.target, OperationPalette) !== null ||
      this.operationPalette
        .getBounds()
        .containsPoint(event.global.x, event.global.y)
    ) {
      return;
    }

    const dropzone = this.findAncestor(event.target, Dropzone);
    if (dropzone !== null && dropzone.operation !== null) {
      return;
    }

    const step = this.findAncestor(event.target, CircuitStep);
    if (step !== null) {
      // 矩形選択中にステップバーを移動させない。
      event.stopPropagation();
    }

    this.start = event.global.clone();
    this.startDropzone = dropzone;
    this.startStep = step;
    this.isDragging = false;

    this.stage.emit(CIRCUIT_FRAME_EVENTS.RECTANGLE_SELECTION_STARTED);
  }

  private updateSelection(event: FederatedPointerEvent): void {
    if (this.start === null) {
      return;
    }

    const bounds = this.selectionBounds(this.start, event.global);

    if (
      !this.isDragging &&
      Math.hypot(bounds.width, bounds.height) <
        CircuitRectangleSelection.DRAG_THRESHOLD
    ) {
      return;
    }

    this.isDragging = true;

    this.drawRectangle(bounds);
    this.emitSelection(bounds);
  }

  private finishSelection(event: FederatedPointerEvent): void {
    if (this.start === null) {
      return;
    }

    if (!this.isDragging) {
      this.finishEmptyCellClick(event.shiftKey);
      return;
    }

    const bounds = this.selectionBounds(this.start, event.global);

    this.emitSelection(bounds);
    this.stage.emit(CIRCUIT_FRAME_EVENTS.RECTANGLE_SELECTION_FINISHED);

    this.reset();
  }

  private emitSelection(bounds: Rectangle): void {
    const selectedOperations = this.circuit.steps.flatMap((step) =>
      step.dropzones.flatMap((dropzone) => {
        const operation = dropzone.operation;
        return operation !== null &&
          this.rectanglesIntersect(bounds, operation.getBounds())
          ? [operation]
          : [];
      }),
    );

    this.stage.emit(
      CIRCUIT_FRAME_EVENTS.RECTANGLE_SELECTION_UPDATED,
      selectedOperations,
    );
  }

  private finishEmptyCellClick(additiveSelection: boolean): void {
    // ドラッグでなければ、従来の空セルクリックとして処理する。
    this.startStep?.activate();

    if (this.startDropzone !== null) {
      this.startDropzone.emit(
        DROPZONE_EVENTS.SELECTED,
        this.startDropzone,
        additiveSelection,
      );
    }

    this.stage.emit(CIRCUIT_FRAME_EVENTS.RECTANGLE_SELECTION_FINISHED);

    this.reset();
  }

  private selectionBounds(start: Point, end: Point): Rectangle {
    return new Rectangle(
      Math.min(start.x, end.x),
      Math.min(start.y, end.y),
      Math.abs(end.x - start.x),
      Math.abs(end.y - start.y),
    );
  }

  private drawRectangle(bounds: Rectangle): void {
    const topLeft = this.stage.toLocal(new Point(bounds.x, bounds.y));

    this.rectangle
      .clear()
      .rect(topLeft.x, topLeft.y, bounds.width, bounds.height)
      .fill({
        color: Colors["border-component"],
        alpha: CircuitRectangleSelection.FILL_ALPHA,
      })
      .stroke({
        color: Colors["border-component"],
        width: CircuitRectangleSelection.BORDER_WIDTH,
      });
  }

  private reset(): void {
    this.rectangle.clear();

    this.start = null;
    this.startDropzone = null;
    this.startStep = null;
    this.isDragging = false;
  }

  private rectanglesIntersect(
    a: RectangleBounds,
    b: RectangleBounds,
  ): boolean {
    return (
      a.left <= b.right &&
      a.right >= b.left &&
      a.top <= b.bottom &&
      a.bottom >= b.top
    );
  }

  private findAncestor<T extends Container>(
    target: EventTarget | null,
    constructor: new (...args: never[]) => T,
  ): T | null {
    let current = target;

    while (current instanceof Container) {
      if (current instanceof constructor) {
        return current;
      }

      current = current.parent;
    }

    return null;
  }
}
