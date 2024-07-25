import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { QubitCircle } from "./qubit-circle";
import { spacingInPx } from "./util";
import { Size } from "./size";
import { Spacing } from "./spacing";

export const STATE_VECTOR_EVENTS = {
  CHANGE: "state-vector:change",
  AMPLITUDES_VISIBLE: "state-vector:amplitudes-visible",
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
  private startIndexX: number = 0;
  private startIndexY: number = 0;
  private elementsMargin: number = spacingInPx(0.5);
  private _padding: number = 0;
  private backgroundGraphics: PIXI.Graphics;
  private _visibleAmplitudes: Set<number> = new Set();
  private currentScrollRect: PIXI.Rectangle;

  set qubitCount(value: number) {
    this._qubitCount = value;

    const sizeMap: { [key: number]: Size } = {
      1: "xl",
      2: "xl",
      3: "xl",
      4: "lg",
      5: "base",
      6: "base",
      7: "base",
      8: "sm",
      9: "xs",
      10: "xs",
      11: "xs",
      12: "xs",
    };

    const colsMap: { [key: number]: number } = {
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

    // 13 qubit 以上の場合のデフォルト値
    this.qubitCircleSize = "xs";
    this.elementsMargin = spacingInPx(0.25);
    this.cols = 64;

    // マッピングに基づいてサイズと列数を設定
    if (value <= 12) {
      this.qubitCircleSize = sizeMap[value];
      this.cols = colsMap[value];
      this.elementsMargin = value <= 8 ? spacingInPx(0.5) : spacingInPx(0.25);
    } else if (value <= this.maxQubitCount) {
      // 13-32 qubit の場合、列数を動的に調整
      this.cols = Math.pow(2, Math.ceil(value / 2));
    }

    this.rows = Math.ceil(this.qubitCircleCount / this.cols);
    this.startIndexX = 0;
    this.startIndexY = 0;

    this.draw();
    this.emit(STATE_VECTOR_EVENTS.CHANGE, this.qubitCount);
  }

  get qubitCount() {
    return this._qubitCount;
  }

  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  get visibleAmplitudes() {
    return Array.from(this._visibleAmplitudes);
  }

  constructor(
    qubitCount: number,
    maxQubitCount: number,
    scrollRect: PIXI.Rectangle
  ) {
    super();

    this.currentScrollRect = scrollRect;
    this.backgroundGraphics = new PIXI.Graphics();
    this.addChild(this.backgroundGraphics);
    this.qubitCount = qubitCount;
    this.maxQubitCount = maxQubitCount;
    this.adjustScroll(scrollRect);
  }

  private draw() {
    const startTime = performance.now();

    this.drawBackground();
    this.drawQubitCircles();

    const endTime = performance.now();
    console.log(`Draw execution time: ${endTime - startTime} ms`);
  }

  private drawBackground() {
    const qubitCircleSize = Spacing.size.qubitCircle[this.qubitCircleSize];
    this._padding = qubitCircleSize;

    const contentWidth =
      this.cols * (qubitCircleSize + this.elementsMargin) - this.elementsMargin;
    const contentHeight =
      this.rows * (qubitCircleSize + this.elementsMargin) - this.elementsMargin;

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

  private drawQubitCircles() {
    const qubitCircleSize = Spacing.size.qubitCircle[this.qubitCircleSize];
    const cellSize = qubitCircleSize + this.elementsMargin;

    // scrollRect を使用して endIndexX と endIndexY を計算
    const endIndexX = Math.min(
      Math.ceil(
        (this.currentScrollRect.x +
          this.currentScrollRect.width -
          this._padding) /
          cellSize
      ),
      this.cols
    );
    const endIndexY = Math.min(
      Math.ceil(
        (this.currentScrollRect.y +
          this.currentScrollRect.height -
          this._padding) /
          cellSize
      ),
      this.rows
    );

    // 現在の QubitCircle をマップに格納
    const currentCircles = new Map<string, QubitCircle>();
    this.children.forEach((child) => {
      if (child instanceof QubitCircle) {
        const key = `${child.x},${child.y}`;
        currentCircles.set(key, child);
      }
    });

    this._visibleAmplitudes.clear();

    // 新しい円を追加または既存の円を更新
    for (let y = this.startIndexY; y < endIndexY; y++) {
      for (let x = this.startIndexX; x < endIndexX; x++) {
        const posX =
          this._padding + x * (qubitCircleSize + this.elementsMargin);
        const posY =
          this._padding + y * (qubitCircleSize + this.elementsMargin);
        const key = `${posX},${posY}`;

        let circle = currentCircles.get(key);
        if (!circle) {
          circle = new QubitCircle(this.qubitCircleSize);
          circle.x = posX;
          circle.y = posY;
          this.addChild(circle);
        } else {
          circle.size = this.qubitCircleSize; // 既存の円のサイズを更新
          currentCircles.delete(key);
        }

        // 振幅のインデックスを計算して追加
        const amplitudeIndex = y * this.cols + x;
        this._visibleAmplitudes.add(amplitudeIndex);
      }
    }

    // 不要な QubitCircle を削除
    currentCircles.forEach((circle) => {
      this.removeChild(circle);
      circle.destroy();
    });

    // 可視振幅が変更されたことをイベントで通知
    this.emit(STATE_VECTOR_EVENTS.AMPLITUDES_VISIBLE, this.visibleAmplitudes);
  }

  adjustScroll(scrollRect: PIXI.Rectangle) {
    const qubitCircleSize = Spacing.size.qubitCircle[this.qubitCircleSize];
    const cellSize = qubitCircleSize + this.elementsMargin;

    const newStartIndexX = Math.max(
      0,
      Math.floor((scrollRect.x - this._padding) / cellSize)
    );
    const newStartIndexY = Math.max(
      0,
      Math.floor((scrollRect.y - this._padding) / cellSize)
    );

    if (
      newStartIndexX !== this.startIndexX ||
      newStartIndexY !== this.startIndexY
    ) {
      this.startIndexX = Math.max(0, newStartIndexX);
      this.startIndexY = Math.max(0, newStartIndexY);
      this.currentScrollRect = scrollRect.clone();

      this.draw();

      // スクロール後に可視振幅が変更されたことをイベントで通知
      this.emit(
        STATE_VECTOR_EVENTS.AMPLITUDES_VISIBLE,
        Array.from(this._visibleAmplitudes)
      );
    }
  }

  getQubitCircleAt(index: number): QubitCircle | undefined {
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const posX =
      this._padding +
      x *
        (Spacing.size.qubitCircle[this.qubitCircleSize] + this.elementsMargin);
    const posY =
      this._padding +
      y *
        (Spacing.size.qubitCircle[this.qubitCircleSize] + this.elementsMargin);

    return this.children.find(
      (child): child is QubitCircle =>
        child instanceof QubitCircle && child.x === posX && child.y === posY
    );
  }
}
