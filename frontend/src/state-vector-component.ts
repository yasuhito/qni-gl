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

const QUBIT_CIRCLE_SIZE_MAP: { [key: number]: Size } = {
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

class StateVectorRenderer {
  qubitCircleSize: Size = "xl";

  private cols: number = 2;
  private rows: number = 1;
  private backgroundGraphics: PIXI.Graphics;
  private container: StateVectorComponent;
  private _padding: number = 0;
  private elementsMargin: number = spacingInPx(0.5);
  private currentViewport: PIXI.Rectangle;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;
  private visibleQubitCirclesCache: Map<string, QubitCircle>;

  constructor(container: StateVectorComponent, viewport: PIXI.Rectangle) {
    this.container = container;
    this.currentViewport = viewport;
    this.backgroundGraphics = new PIXI.Graphics();
    this.container.addChildAt(this.backgroundGraphics, 0);
  }

  drawBackground(): void {
    const qubitCircleSize = this.qubitCircleSizeInPx;
    const totalWidth = this.calculateTotalWidth(qubitCircleSize);
    const totalHeight = this.calculateTotalHeight(qubitCircleSize);

    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(Colors["bg-component"], 1);
    this.backgroundGraphics.drawRect(0, 0, totalWidth, totalHeight);
    this.backgroundGraphics.endFill();
  }

  drawQubitCircles(): Set<number> {
    const endIndexX = this.calculateEndIndex(
      this.currentViewport.x,
      this.currentViewport.width,
      this.cols
    );
    const endIndexY = this.calculateEndIndex(
      this.currentViewport.y,
      this.currentViewport.height,
      this.rows
    );

    const { unusedQubitCircles, visibleIndices } = this.updateQubitCircles(
      endIndexX,
      endIndexY
    );

    this.removeUnusedQubitCircles(unusedQubitCircles);

    if (unusedQubitCircles.size > 0) {
      this.container.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        Array.from(visibleIndices)
      );
    }

    return visibleIndices;
  }

  drawQubitCircle(x: number, y: number): QubitCircle {
    const circle = new QubitCircle(this.qubitCircleSize);
    circle.x = x;
    circle.y = y;
    this.container.addChild(circle);
    return circle;
  }

  removeQubitCircle(circle: QubitCircle): void {
    this.container.removeChild(circle);
    circle.destroy();
  }

  updateQubitCircleSize(circle: QubitCircle): void {
    circle.size = this.qubitCircleSize;
  }

  get qubitCircleSizeInPx(): number {
    return Spacing.size.qubitCircle[this.qubitCircleSize];
  }

  getVisibleQubitCirclesMap(): Map<string, QubitCircle> {
    const visibleCircles = new Map<string, QubitCircle>();

    for (let i = 1; i < this.container.children.length; i++) {
      const child = this.container.children[i] as QubitCircle;
      const key = this.circleKeyAt(child.x, child.y);
      visibleCircles.set(key, child);
    }

    this.visibleQubitCirclesCache = visibleCircles;
    return visibleCircles;
  }

  updateQubitCircles(
    endIndexX: number,
    endIndexY: number
  ): {
    unusedQubitCircles: Map<string, QubitCircle>;
    visibleIndices: Set<number>;
  } {
    const unusedQubitCircles = this.getVisibleQubitCirclesMap();
    const visibleIndices = new Set<number>();
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    for (let y = this.visibleQubitCirclesStartIndexY; y < endIndexY; y++) {
      for (let x = this.visibleQubitCirclesStartIndexX; x < endIndexX; x++) {
        const posX = this._padding + x * cellSize;
        const posY = this._padding + y * cellSize;
        const key = this.circleKeyAt(posX, posY);
        const circle = unusedQubitCircles.get(key);

        if (!circle) {
          this.drawQubitCircle(posX, posY);
        } else {
          this.updateQubitCircleSize(circle);
          unusedQubitCircles.delete(key);
        }

        const index = y * this.cols + x;
        visibleIndices.add(index);
      }
    }

    return { unusedQubitCircles, visibleIndices };
  }

  calculateEndIndex(start: number, size: number, max: number): number {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    return Math.min(Math.ceil((start + size - this._padding) / cellSize), max);
  }

  removeUnusedQubitCircles(currentCircles: Map<string, QubitCircle>): void {
    currentCircles.forEach((circle) => {
      this.removeQubitCircle(circle);
    });
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;
    const posX = this._padding + x * cellSize;
    const posY = this._padding + y * cellSize;

    return this.container.children.find(
      (child): child is QubitCircle =>
        child instanceof QubitCircle && child.x === posX && child.y === posY
    );
  }

  calculateTotalWidth(qubitCircleSize: number): number {
    const cellSize = qubitCircleSize + this.elementsMargin;
    const contentWidth = this.cols * cellSize - this.elementsMargin;
    const totalWidth = contentWidth + this._padding * 2;

    return totalWidth;
  }

  calculateTotalHeight(qubitCircleSize: number): number {
    const cellSize = qubitCircleSize + this.elementsMargin;
    const contentHeight = this.rows * cellSize - this.elementsMargin;
    const totalHeight = contentHeight + this._padding * 2;

    return totalHeight;
  }

  calculateVisibleQubitCirclesStartIndex(viewportPosition: number): number {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    return Math.max(
      0,
      Math.floor((viewportPosition - this._padding) / cellSize)
    );
  }

  calculateQubitSettings(qubitCount: number): void {
    this.qubitCircleSize = QUBIT_CIRCLE_SIZE_MAP[qubitCount] || "xs";
    this._padding = this.qubitCircleSizeInPx;
    this.elementsMargin =
      qubitCount <= 8 ? spacingInPx(0.5) : spacingInPx(0.25);
    this.cols = Math.pow(2, Math.ceil(qubitCount / 2));
    this.rows = Math.ceil(Math.pow(2, qubitCount) / this.cols);
    this.visibleQubitCirclesStartIndexX = 0;
    this.visibleQubitCirclesStartIndexY = 0;
  }

  // 表示範囲 (viewport) に基いて表示される QubitCircle を更新
  updateVisibleQubitCircles(viewport: PIXI.Rectangle) {
    const newVisibleQubitCirclesStartIndexX =
      this.calculateVisibleQubitCirclesStartIndex(viewport.x);
    const newVisibleQubitCirclesStartIndexY =
      this.calculateVisibleQubitCirclesStartIndex(viewport.y);

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      // this._visibleQubitCirclesNeedUpdate = true;
      this.visibleQubitCirclesStartIndexX = newVisibleQubitCirclesStartIndexX;
      this.visibleQubitCirclesStartIndexY = newVisibleQubitCirclesStartIndexY;
      this.currentViewport = viewport.clone();
    }
  }

  private circleKeyAt(x: number, y: number): string {
    return `${x},${y}`;
  }
}

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount = 0;
  private maxQubitCount: number;
  private _visibleQubitCircleIndices: Set<number> = new Set();
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
    this.renderer.calculateQubitSettings(this._qubitCount);
    this.draw();
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
    return Array.from(this._visibleQubitCircleIndices);
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

  private draw() {
    const startTime = performance.now();

    this.renderer.drawBackground();
    this._visibleQubitCircleIndices = this.renderer.drawQubitCircles();

    const endTime = performance.now();
    logger.log(`Draw execution time: ${endTime - startTime} ms`);
  }

  // 表示範囲 (viewport) に基いて表示される QubitCircle を更新
  updateVisibleQubitCircles(viewport: PIXI.Rectangle) {
    this.renderer.updateVisibleQubitCircles(viewport);

    this.draw();

    this.emit(
      STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
      Array.from(this._visibleQubitCircleIndices)
    );
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.renderer.qubitCircleAt(index);
  }
}
