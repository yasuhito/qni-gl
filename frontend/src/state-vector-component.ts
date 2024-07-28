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

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  qubitCircleSize: Size = "xl";

  private _qubitCount = 0;
  private maxQubitCount: number;
  private cols: number = 2;
  private rows: number = 1;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;
  private elementsMargin: number = spacingInPx(0.5);
  private _padding: number = 0;
  private backgroundGraphics: PIXI.Graphics;
  private _visibleQubitCircleIndices: Set<number> = new Set();
  private currentViewport: PIXI.Rectangle;
  private _changed: boolean = true;
  private visibleQubitCirclesCache: Map<string, QubitCircle>;

  // 量子ビット数をセット
  set qubitCount(value: number) {
    need(
      value <= this.maxQubitCount,
      "qubitCount must not exceed maxQubitCount. Attempted to set {qubitCount}, but maxQubitCount is {maxQubitCount}.",
      { value, maxQubitCount: this.maxQubitCount }
    );

    if (this._qubitCount === value) return;

    this._changed = true;
    this._qubitCount = value;
    this.updateQubitSettings();
    this.draw();
    this.emit(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, this.qubitCount);
  }

  // 状態ベクトル表示の各種設定を更新
  private updateQubitSettings(): void {
    this.qubitCircleSize = QUBIT_CIRCLE_SIZE_MAP[this._qubitCount] || "xs";
    this.elementsMargin =
      this._qubitCount <= 8 ? spacingInPx(0.5) : spacingInPx(0.25);
    this.cols = Math.pow(2, Math.ceil(this._qubitCount / 2));
    this.rows = Math.ceil(this.qubitCircleCount / this.cols);
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

    this.maxQubitCount = maxQubitCount;
    this.currentViewport = viewport;
    this.backgroundGraphics = new PIXI.Graphics();
    this.addChildAt(this.backgroundGraphics, 0);
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
    const cellSize = qubitCircleSize + this.elementsMargin;
    this._padding = qubitCircleSize;

    const contentWidth = this.cols * cellSize - this.elementsMargin;
    const contentHeight = this.rows * cellSize - this.elementsMargin;

    const totalWidth = contentWidth + this._padding * 2;
    const totalHeight = contentHeight + this._padding * 2;

    if (!this.backgroundGraphics) {
      this.backgroundGraphics = new PIXI.Graphics();
      this.addChildAt(this.backgroundGraphics, 0);
    }

    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(Colors["bg-component"], 1);
    this.backgroundGraphics.drawRect(0, 0, totalWidth, totalHeight);
    this.backgroundGraphics.endFill();
  }

  private drawQubitCircles(): void {
    const unusedQubitCircles = this.updateQubitCircles();
    this.removeUnusedQubitCircles(unusedQubitCircles);

    if (unusedQubitCircles.size === 0) return;

    this._changed = true;
    this.emit(
      STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
      this.visibleQubitCircleIndices
    );
  }

  private calculateEndIndex(start: number, size: number, max: number): number {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    return Math.min(Math.ceil((start + size - this._padding) / cellSize), max);
  }

  private getVisibleQubitCirclesMap(): Map<string, QubitCircle> {
    if (!this._changed && this.visibleQubitCirclesCache) {
      return this.visibleQubitCirclesCache;
    }

    const visibleCircles = new Map<string, QubitCircle>();

    for (let i = 1; i < this.children.length; i++) {
      const child = this.children[i] as QubitCircle;
      const key = this.circleKeyAt(child.x, child.y);
      visibleCircles.set(key, child);
    }

    this.visibleQubitCirclesCache = visibleCircles;
    this._changed = false;

    return visibleCircles;
  }

  private updateQubitCircles(): Map<string, QubitCircle> {
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
    const unusedQubitCircles = this.getVisibleQubitCirclesMap();
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;
    this._visibleQubitCircleIndices.clear();

    for (let y = this.visibleQubitCirclesStartIndexY; y < endIndexY; y++) {
      for (let x = this.visibleQubitCirclesStartIndexX; x < endIndexX; x++) {
        const posX = this._padding + x * cellSize;
        const posY = this._padding + y * cellSize;
        const key = this.circleKeyAt(posX, posY);

        let circle = unusedQubitCircles.get(key);
        if (!circle) {
          circle = new QubitCircle(this.qubitCircleSize);
          circle.x = posX;
          circle.y = posY;
          this.addChild(circle);
        } else {
          circle.size = this.qubitCircleSize;
          unusedQubitCircles.delete(key);
        }

        const index = y * this.cols + x;
        this._visibleQubitCircleIndices.add(index);
      }
    }

    return unusedQubitCircles;
  }

  private circleKeyAt(x: number, y: number): string {
    return `${x},${y}`;
  }

  private removeUnusedQubitCircles(
    currentCircles: Map<string, QubitCircle>
  ): void {
    currentCircles.forEach((each) => {
      this.removeChild(each);
      each.destroy();
    });
  }

  // 表示範囲 (viewport) に基いて表示される QubitCircle を更新
  updateVisibleQubitCircles(viewport: PIXI.Rectangle) {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    const newVisibleQubitCirclesStartIndexX = Math.max(
      0,
      Math.floor((viewport.x - this._padding) / cellSize)
    );
    const newVisibleQubitCirclesStartIndexY = Math.max(
      0,
      Math.floor((viewport.y - this._padding) / cellSize)
    );

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      this._changed = true;
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
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;
    const posX = this._padding + x * cellSize;
    const posY = this._padding + y * cellSize;

    return this.children.find(
      (child): child is QubitCircle =>
        child instanceof QubitCircle && child.x === posX && child.y === posY
    );
  }

  private get qubitCircleSizeInPx(): number {
    return Spacing.size.qubitCircle[this.qubitCircleSize];
  }
}
