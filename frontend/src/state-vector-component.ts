import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { QubitCircle } from "./qubit-circle";
import { spacingInPx } from "./util";
import { Size } from "./size";
import { Spacing } from "./spacing";
import { need, logger } from "./util";

// StateVectorComponent が発生させるイベント
export const STATE_VECTOR_EVENTS = {
  QUBIT_COUNT_CHANGED: "state-vector:qubit-count-changed",
  VISIBLE_QUBIT_CIRCLES_CHANGED: "state-vector:visible-qubit-circles-changed",
};

// 量子ビット数に応じた QubitCircle のサイズ
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

// 量子ビット数に応じた列数
const STATE_VECTOR_COLS_MAP: { [key: number]: number } = {
  1: 2,
  2: 2,
  3: 4,
  4: 4,
  5: 8,
  6: 8,
  7: 16,
  8: 16,
  9: 32,
  10: 32,
  11: 64,
  12: 64,
};

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  qubitCircleSize: Size = "xl";

  private _qubitCount = 1;
  private maxQubitCount: number;
  private cols: number = 2;
  private rows: number = 1;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;
  private elementsMargin: number = spacingInPx(0.5);
  private _padding: number = 0;
  private backgroundGraphics: PIXI.Graphics;
  private _visibleQubitCircleIndices: Set<number> = new Set();
  private currentScrollRect: PIXI.Rectangle;

  // 量子ビット数をセット
  set qubitCount(value: number) {
    need(
      value <= this.maxQubitCount,
      "qubitCount must not exceed maxQubitCount. Attempted to set {qubitCount}, but maxQubitCount is {maxQubitCount}.",
      { value, maxQubitCount: this.maxQubitCount }
    );

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
    this.cols =
      STATE_VECTOR_COLS_MAP[this._qubitCount] ||
      Math.pow(2, Math.ceil(this._qubitCount / 2));
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
    scrollRect: PIXI.Rectangle
  ) {
    super();

    this.maxQubitCount = maxQubitCount;
    this.currentScrollRect = scrollRect;
    this.backgroundGraphics = new PIXI.Graphics();
    this.addChild(this.backgroundGraphics);
    this.qubitCount = qubitCount;
    this.adjustScroll(scrollRect);
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
    this.backgroundGraphics.beginFill(0xffffff, 1);
    this.backgroundGraphics.drawRect(0, 0, totalWidth, totalHeight);
    this.backgroundGraphics.endFill();
  }

  private drawQubitCircles(): void {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;
    const endIndexX = this.calculateEndIndex(
      this.currentScrollRect.x,
      this.currentScrollRect.width,
      cellSize,
      this.cols
    );
    const endIndexY = this.calculateEndIndex(
      this.currentScrollRect.y,
      this.currentScrollRect.height,
      cellSize,
      this.rows
    );

    const currentCircles = this.mapCurrentQubitCircles();

    this._visibleQubitCircleIndices.clear();

    this.updateQubitCircles(endIndexX, endIndexY, cellSize, currentCircles);

    this.removeUnusedQubitCircles(currentCircles);

    this.emit(
      STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
      this.visibleQubitCircleIndices
    );
  }

  private calculateEndIndex(
    start: number,
    size: number,
    cellSize: number,
    max: number
  ): number {
    return Math.min(Math.ceil((start + size - this._padding) / cellSize), max);
  }

  private mapCurrentQubitCircles(): Map<string, QubitCircle> {
    const currentCircles = new Map<string, QubitCircle>();
    this.children.forEach((each) => {
      if (each instanceof QubitCircle) {
        const key = `${each.x},${each.y}`;
        currentCircles.set(key, each);
      }
    });
    return currentCircles;
  }

  private updateQubitCircles(
    endIndexX: number,
    endIndexY: number,
    cellSize: number,
    currentCircles: Map<string, QubitCircle>
  ): void {
    for (let y = this.visibleQubitCirclesStartIndexY; y < endIndexY; y++) {
      for (let x = this.visibleQubitCirclesStartIndexX; x < endIndexX; x++) {
        const posX = this._padding + x * cellSize;
        const posY = this._padding + y * cellSize;
        const key = `${posX},${posY}`;

        let circle = currentCircles.get(key);
        if (!circle) {
          circle = new QubitCircle(this.qubitCircleSize);
          circle.x = posX;
          circle.y = posY;
          this.addChild(circle);
        } else {
          circle.size = this.qubitCircleSize;
          currentCircles.delete(key);
        }

        const amplitudeIndex = y * this.cols + x;
        this._visibleQubitCircleIndices.add(amplitudeIndex);
      }
    }
  }

  private removeUnusedQubitCircles(
    currentCircles: Map<string, QubitCircle>
  ): void {
    currentCircles.forEach((each) => {
      this.removeChild(each);
      each.destroy();
    });
  }

  private get qubitCircleSizeInPx(): number {
    return Spacing.size.qubitCircle[this.qubitCircleSize];
  }

  // スクロール位置 (scrollRect) に基いて表示される QubitCircle を調整
  adjustScroll(scrollRect: PIXI.Rectangle) {
    const cellSize = this.qubitCircleSizeInPx + this.elementsMargin;

    const newVisibleQubitCirclesStartIndexX = Math.max(
      0,
      Math.floor((scrollRect.x - this._padding) / cellSize)
    );
    const newVisibleQubitCirclesStartIndexY = Math.max(
      0,
      Math.floor((scrollRect.y - this._padding) / cellSize)
    );

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      this.visibleQubitCirclesStartIndexX = newVisibleQubitCirclesStartIndexX;
      this.visibleQubitCirclesStartIndexY = newVisibleQubitCirclesStartIndexY;
      this.currentScrollRect = scrollRect.clone();

      this.draw();

      this.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        Array.from(this._visibleQubitCircleIndices)
      );
    }
  }

  getQubitCircleAt(index: number): QubitCircle | undefined {
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
}
