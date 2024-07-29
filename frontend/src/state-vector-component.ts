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
  private cols: number = 2;
  private rows: number = 1;
  private backgroundGraphics: PIXI.Graphics;
  private container: StateVectorComponent;
  private visibleQubitCirclesCache: Map<string, QubitCircle>;

  constructor(container: StateVectorComponent) {
    this.container = container;
    this.backgroundGraphics = new PIXI.Graphics();
    this.container.addChildAt(this.backgroundGraphics, 0);
  }

  drawBackground(width: number, height: number): void {
    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(Colors["bg-component"], 1);
    this.backgroundGraphics.drawRect(0, 0, width, height);
    this.backgroundGraphics.endFill();
  }

  drawQubitCircles(
    currentViewport: PIXI.Rectangle,
    visibleQubitCirclesStartIndexX: number,
    visibleQubitCirclesStartIndexY: number,
    padding: number,
    qubitCircleSize: Size,
    qubitCircleSizeInPx: number,
    elementsMargin: number
  ): Set<number> {
    const cellSize = qubitCircleSizeInPx + elementsMargin;

    const endIndexX = this.calculateEndIndex(
      currentViewport.x,
      currentViewport.width,
      this.cols,
      cellSize,
      padding
    );
    const endIndexY = this.calculateEndIndex(
      currentViewport.y,
      currentViewport.height,
      this.rows,
      cellSize,
      padding
    );

    const { unusedQubitCircles, visibleIndices } = this.updateQubitCircles(
      visibleQubitCirclesStartIndexX,
      visibleQubitCirclesStartIndexY,
      endIndexX,
      endIndexY,
      padding,
      cellSize,
      qubitCircleSize
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

  drawQubitCircle(x: number, y: number, size: Size): QubitCircle {
    const circle = new QubitCircle(size);
    circle.x = x;
    circle.y = y;
    this.container.addChild(circle);
    return circle;
  }

  removeQubitCircle(circle: QubitCircle): void {
    this.container.removeChild(circle);
    circle.destroy();
  }

  updateQubitCircleSize(circle: QubitCircle, size: Size): void {
    circle.size = size;
  }

  qubitCircleSizeInPx(size: Size): number {
    return Spacing.size.qubitCircle[size];
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
    startIndexX: number,
    startIndexY: number,
    endIndexX: number,
    endIndexY: number,
    padding: number,
    cellSize: number,
    qubitCircleSize: Size
  ): {
    unusedQubitCircles: Map<string, QubitCircle>;
    visibleIndices: Set<number>;
  } {
    const unusedQubitCircles = this.getVisibleQubitCirclesMap();
    const visibleIndices = new Set<number>();

    for (let y = startIndexY; y < endIndexY; y++) {
      for (let x = startIndexX; x < endIndexX; x++) {
        const posX = padding + x * cellSize;
        const posY = padding + y * cellSize;
        const key = this.circleKeyAt(posX, posY);
        const circle = unusedQubitCircles.get(key);

        if (!circle) {
          this.drawQubitCircle(posX, posY, qubitCircleSize);
        } else {
          this.updateQubitCircleSize(circle, qubitCircleSize);
          unusedQubitCircles.delete(key);
        }

        const index = y * this.cols + x;
        visibleIndices.add(index);
      }
    }

    return { unusedQubitCircles, visibleIndices };
  }

  calculateEndIndex(
    start: number,
    size: number,
    max: number,
    cellSize: number,
    padding: number
  ): number {
    return Math.min(Math.ceil((start + size - padding) / cellSize), max);
  }

  removeUnusedQubitCircles(currentCircles: Map<string, QubitCircle>): void {
    currentCircles.forEach((circle) => {
      this.removeQubitCircle(circle);
    });
  }

  qubitCircleAt(
    index: number,
    padding: number,
    cellSize: number
  ): QubitCircle | undefined {
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const posX = padding + x * cellSize;
    const posY = padding + y * cellSize;

    return this.container.children.find(
      (child): child is QubitCircle =>
        child instanceof QubitCircle && child.x === posX && child.y === posY
    );
  }

  calculateTotalWidth(qubitCircleSize: number, elementsMargin: number): number {
    const cellSize = qubitCircleSize + elementsMargin;
    const padding = qubitCircleSize;
    const contentWidth = this.cols * cellSize - elementsMargin;
    const totalWidth = contentWidth + padding * 2;

    return totalWidth;
  }

  calculateTotalHeight(
    qubitCircleSize: number,
    elementsMargin: number
  ): number {
    const cellSize = qubitCircleSize + elementsMargin;
    const padding = qubitCircleSize;
    const contentHeight = this.rows * cellSize - elementsMargin;
    const totalHeight = contentHeight + padding * 2;

    return totalHeight;
  }

  calculateVisibleQubitCirclesStartIndex(
    viewportPosition: number,
    padding: number,
    cellSize: number
  ): number {
    return Math.max(0, Math.floor((viewportPosition - padding) / cellSize));
  }

  calculateQubitSettings(qubitCount: number): {
    qubitCircleSize: Size;
    elementsMargin: number;
  } {
    const qubitCircleSize = QUBIT_CIRCLE_SIZE_MAP[qubitCount] || "xs";
    const elementsMargin =
      qubitCount <= 8 ? spacingInPx(0.5) : spacingInPx(0.25);
    this.cols = Math.pow(2, Math.ceil(qubitCount / 2));
    this.rows = Math.ceil(Math.pow(2, qubitCount) / this.cols);

    return { qubitCircleSize, elementsMargin };
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
  qubitCircleSize: Size = "xl";

  private _qubitCount = 0;
  private maxQubitCount: number;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;
  private elementsMargin: number = spacingInPx(0.5);
  private _padding: number = 0;
  private _visibleQubitCircleIndices: Set<number> = new Set();
  private currentViewport: PIXI.Rectangle;
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
    this.updateQubitSettings();
    this.draw();
    this.emit(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, this.qubitCount);
  }

  // 状態ベクトル表示の各種設定を更新
  private updateQubitSettings(): void {
    const { qubitCircleSize, elementsMargin } =
      this.renderer.calculateQubitSettings(this._qubitCount);

    this.qubitCircleSize = qubitCircleSize;
    this.elementsMargin = elementsMargin;

    this.visibleQubitCirclesStartIndexX = 0;
    this.visibleQubitCirclesStartIndexY = 0;
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

    this.renderer = new StateVectorRenderer(this);
    this.maxQubitCount = maxQubitCount;
    this.currentViewport = viewport;
    this.qubitCount = qubitCount;
    this.updateVisibleQubitCircles(viewport);
  }

  private draw() {
    const startTime = performance.now();

    this.drawBackground();
    this.drawQubitCircles();

    const endTime = performance.now();
    logger.log(`Draw execution time: ${endTime - startTime} ms`);
  }

  private drawBackground() {
    const qubitCircleSize = this.qubitCircleSizeInPx;
    const totalWidth = this.renderer.calculateTotalWidth(
      qubitCircleSize,
      this.elementsMargin
    );
    const totalHeight = this.renderer.calculateTotalHeight(
      qubitCircleSize,
      this.elementsMargin
    );
    this._padding = qubitCircleSize;
    this.renderer.drawBackground(totalWidth, totalHeight);
  }

  private drawQubitCircles(): void {
    this._visibleQubitCircleIndices = this.renderer.drawQubitCircles(
      this.currentViewport,
      this.visibleQubitCirclesStartIndexX,
      this.visibleQubitCirclesStartIndexY,
      this._padding,
      this.qubitCircleSize,
      this.qubitCircleSizeInPx,
      this.elementsMargin
    );
  }

  // 表示範囲 (viewport) に基いて表示される QubitCircle を更新
  updateVisibleQubitCircles(viewport: PIXI.Rectangle) {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    const newVisibleQubitCirclesStartIndexX =
      this.renderer.calculateVisibleQubitCirclesStartIndex(
        viewport.x,
        this._padding,
        cellSize
      );
    const newVisibleQubitCirclesStartIndexY =
      this.renderer.calculateVisibleQubitCirclesStartIndex(
        viewport.y,
        this._padding,
        cellSize
      );

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      // this._visibleQubitCirclesNeedUpdate = true;
      this.visibleQubitCirclesStartIndexX = newVisibleQubitCirclesStartIndexX;
      this.visibleQubitCirclesStartIndexY = newVisibleQubitCirclesStartIndexY;
      this.currentViewport = viewport.clone();

      this.draw();

      this.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        Array.from(this._visibleQubitCircleIndices)
      );
    }
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    return this.renderer.qubitCircleAt(index, this._padding, cellSize);
  }

  private get qubitCircleSizeInPx(): number {
    return this.renderer.qubitCircleSizeInPx(this.qubitCircleSize);
  }
}
