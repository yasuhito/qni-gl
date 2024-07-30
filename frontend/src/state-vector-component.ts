import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { QubitCircle } from "./qubit-circle";
import { Size } from "./size";
import { Spacing } from "./spacing";
import { logger, need, spacingInPx } from "./util";

export const STATE_VECTOR_EVENTS = {
  QUBIT_COUNT_CHANGED: "state-vector:qubit-count-changed",
  VISIBLE_QUBIT_CIRCLES_CHANGED: "state-vector:visible-qubit-circles-changed",
};

class StateVectorLayout {
  private static QUBIT_CIRCLE_SIZE_MAP: { [key: number]: Size } = {
    1: "xl",
    2: "xl",
    3: "xl",
    4: "lg",
    5: "base",
    6: "base",
    7: "base",
    8: "sm",
    9: "sm",
    10: "xs",
    11: "xs",
    12: "xs",
  };

  private _qubitCount: number = 0;
  private _cols: number;
  private _rows: number;
  private _padding: number = 0;
  private _qubitCircleMargin: number = spacingInPx(0.5);
  private _cellSize: number;
  private _width: number;
  private _height: number;

  constructor(qubitCount: number) {
    this._qubitCount = qubitCount;
    this.update();
  }

  get qubitCount(): number {
    return this._qubitCount;
  }

  set qubitCount(newValue: number) {
    need(newValue > 0, "qubitCount must be greater than 0.");

    if (this._qubitCount !== newValue) {
      this._qubitCount = newValue;
      this.update();
    }
  }

  get cols(): number {
    return this._cols;
  }

  get rows(): number {
    return this._rows;
  }

  get padding(): number {
    return this._padding;
  }

  get qubitCircleSize(): Size {
    return StateVectorLayout.QUBIT_CIRCLE_SIZE_MAP[this.qubitCount] || "xs";
  }

  get qubitCircleSizeInPx(): number {
    return Spacing.size.qubitCircle[this.qubitCircleSize];
  }

  get qubitCircleMargin(): number {
    return this._qubitCircleMargin;
  }

  private updateQubitCircleMargin(): void {
    this._qubitCircleMargin =
      this.qubitCount <= 8 ? spacingInPx(0.5) : spacingInPx(0.25);
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  visibleQubitCirclesStartIndex(viewportPosition: number): number {
    return Math.max(
      0,
      Math.floor((viewportPosition - this.padding) / this._cellSize)
    );
  }

  visibleQubitCirclesEndIndex(
    start: number,
    size: number,
    max: number
  ): number {
    return Math.min(
      Math.ceil((start + size - this.padding) / this._cellSize),
      max
    );
  }

  visibleQubitCirclePositions(
    startIndexX: number,
    startIndexY: number,
    endIndexX: number,
    endIndexY: number
  ): { position: PIXI.Point; index: number }[] {
    const circles: { position: PIXI.Point; index: number }[] = [];

    for (let y = startIndexY; y < endIndexY; y++) {
      for (let x = startIndexX; x < endIndexX; x++) {
        const posX = this.padding + x * this._cellSize;
        const posY = this.padding + y * this._cellSize;
        const index = y * this.cols + x;
        circles.push({ position: new PIXI.Point(posX, posY), index });
      }
    }

    return circles;
  }

  qubitCirclePositionAt(index: number): PIXI.Point {
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const posX = this.padding + x * this._cellSize;
    const posY = this.padding + y * this._cellSize;

    return new PIXI.Point(posX, posY);
  }

  private update(): void {
    this._cols = Math.pow(2, Math.ceil(this.qubitCount / 2));
    this._rows = Math.ceil(Math.pow(2, this.qubitCount) / this._cols);
    this._padding = this.qubitCircleSizeInPx;
    this.updateQubitCircleMargin();
    this._cellSize = this.qubitCircleSizeInPx + this._qubitCircleMargin;
    const contentWidth = this._cols * this._cellSize - this._qubitCircleMargin;
    this._width = contentWidth + this._padding * 2;
    const contentHeight = this._rows * this._cellSize - this._qubitCircleMargin;
    this._height = contentHeight + this._padding * 2;
  }
}

class QubitCircleManager {
  private circles: Map<string, QubitCircle> = new Map();
  private layout: StateVectorLayout;
  private container: PIXI.Container;
  private _visibleQubitCircleIndices: Set<number> = new Set();

  constructor(layout: StateVectorLayout, container: PIXI.Container) {
    this.layout = layout;
    this.container = container;
  }

  updateVisibleQubitCircles(
    startIndexX: number,
    startIndexY: number,
    endIndexX: number,
    endIndexY: number
  ): Set<number> {
    const visibleQubitCircleIndices = new Set<number>();
    const unusedCircles = new Set(this.circles.keys());

    this.layout
      .visibleQubitCirclePositions(
        startIndexX,
        startIndexY,
        endIndexX,
        endIndexY
      )
      .forEach(({ position, index }) => {
        const key = this.circleKeyAt(position);
        const circle = this.circles.get(key);

        if (!circle) {
          this.createQubitCircle(position);
        } else {
          this.updateQubitCirclePositionAndSize(circle, position);
          unusedCircles.delete(key);
        }

        visibleQubitCircleIndices.add(index);
      });

    this.removeUnusedQubitCircles(unusedCircles);
    this._visibleQubitCircleIndices = visibleQubitCircleIndices;

    return visibleQubitCircleIndices;
  }

  get visibleQubitCircleIndices(): number[] {
    return Array.from(this._visibleQubitCircleIndices);
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    const position = this.layout.qubitCirclePositionAt(index);
    const key = this.circleKeyAt(position);

    return this.circles.get(key);
  }

  resizeAllQubitCircles(size: Size): void {
    this.circles.forEach((circle) => {
      circle.size = size;
    });
  }

  private createQubitCircle(position: PIXI.Point): void {
    const circle = new QubitCircle(this.layout.qubitCircleSize);
    const key = this.circleKeyAt(position);

    this.circles.set(key, circle);
    circle.position.copyFrom(position);
    this.container.addChild(circle);
  }

  private updateQubitCirclePositionAndSize(
    circle: QubitCircle,
    position: PIXI.Point
  ): void {
    circle.position.copyFrom(position);
    circle.size = this.layout.qubitCircleSize;
  }

  private removeUnusedQubitCircles(qubitCircleKeys: Set<string>): void {
    qubitCircleKeys.forEach((key) => {
      const circle = this.circles.get(key);
      if (circle) {
        this.container.removeChild(circle);
        circle.destroy();
        this.circles.delete(key);
      }
    });
  }

  private circleKeyAt(position: PIXI.Point): string {
    return `${position.x},${position.y}`;
  }
}

class StateVectorRenderer {
  private layout: StateVectorLayout;
  private qubitCircleManager: QubitCircleManager;
  private backgroundGraphics: PIXI.Graphics;
  private container: StateVectorComponent;
  private currentViewport: PIXI.Rectangle;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;

  constructor(container: StateVectorComponent, viewport: PIXI.Rectangle) {
    this.container = container;
    this.layout = new StateVectorLayout(container.qubitCount);
    this.currentViewport = viewport;
    this.backgroundGraphics = new PIXI.Graphics();
    this.container.addChildAt(this.backgroundGraphics, 0);
    this.qubitCircleManager = new QubitCircleManager(
      this.layout,
      this.container
    );
  }

  get visibleQubitCircleIndices(): number[] {
    return this.qubitCircleManager.visibleQubitCircleIndices;
  }

  drawBackground(): void {
    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(Colors["bg-component"], 1);
    this.backgroundGraphics.drawRect(
      0,
      0,
      this.layout.width,
      this.layout.height
    );
    this.backgroundGraphics.endFill();
  }

  drawQubitCircles(): Set<number> {
    const endIndexX = this.layout.visibleQubitCirclesEndIndex(
      this.currentViewport.x,
      this.currentViewport.width,
      this.layout.cols
    );
    const endIndexY = this.layout.visibleQubitCirclesEndIndex(
      this.currentViewport.y,
      this.currentViewport.height,
      this.layout.rows
    );

    return this.qubitCircleManager.updateVisibleQubitCircles(
      this.visibleQubitCirclesStartIndexX,
      this.visibleQubitCirclesStartIndexY,
      endIndexX,
      endIndexY
    );
  }

  updateQubitCircleLayout(qubitCount: number): void {
    this.layout.qubitCount = qubitCount;
    this.visibleQubitCirclesStartIndexX = 0;
    this.visibleQubitCirclesStartIndexY = 0;
    this.qubitCircleManager.resizeAllQubitCircles(this.layout.qubitCircleSize);
  }

  updateVisibleQubitCircles(viewport: PIXI.Rectangle): boolean {
    const newVisibleQubitCirclesStartIndexX =
      this.layout.visibleQubitCirclesStartIndex(viewport.x);
    const newVisibleQubitCirclesStartIndexY =
      this.layout.visibleQubitCirclesStartIndex(viewport.y);

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      this.visibleQubitCirclesStartIndexX = newVisibleQubitCirclesStartIndexX;
      this.visibleQubitCirclesStartIndexY = newVisibleQubitCirclesStartIndexY;
      this.currentViewport = viewport.clone();
      return true;
    }

    return false;
  }

  draw() {
    const startTime = performance.now();

    this.drawBackground();
    const visibleIndices = this.drawQubitCircles();

    if (visibleIndices.size > 0) {
      this.container.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        Array.from(visibleIndices)
      );
    }

    const endTime = performance.now();
    logger.log(`Draw execution time: ${endTime - startTime} ms`);
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.qubitCircleManager.qubitCircleAt(index);
  }
}

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount = 0;
  private maxQubitCount: number;
  private renderer: StateVectorRenderer;

  // 量子ビット数をセット
  set qubitCount(value: number) {
    need(
      value <= this.maxQubitCount,
      "qubitCount must not exceed maxQubitCount. Attempted to set {qubitCount}, but maxQubitCount is {maxQubitCount}.",
      { value, maxQubitCount: this.maxQubitCount }
    );

    if (this._qubitCount === value) return;

    this._qubitCount = value;
    this.renderer.updateQubitCircleLayout(this._qubitCount);
    this.renderer.draw();
    this.emit(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, this.qubitCount);
  }

  // 量子ビット数を返す
  get qubitCount() {
    return this._qubitCount;
  }

  // QubitCircle の総数 (振幅の数) を返す
  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  // 表示されている QubitCircle のインデックスを返す
  get visibleQubitCircleIndices() {
    return this.renderer.visibleQubitCircleIndices;
  }

  constructor(
    qubitCount: number,
    maxQubitCount: number,
    viewport: PIXI.Rectangle
  ) {
    super();

    this.renderer = new StateVectorRenderer(this, viewport);
    this.maxQubitCount = maxQubitCount;
    this.qubitCount = qubitCount;
    this.updateVisibleQubitCircles(viewport);
  }

  // 表示範囲 (viewport) に基いて表示される QubitCircle を更新
  updateVisibleQubitCircles(viewport: PIXI.Rectangle) {
    const visibleQubitCirclesChanged =
      this.renderer.updateVisibleQubitCircles(viewport);

    this.renderer.draw();

    if (visibleQubitCirclesChanged) {
      this.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        this.renderer.visibleQubitCircleIndices
      );
    }
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.renderer.qubitCircleAt(index);
  }
}
