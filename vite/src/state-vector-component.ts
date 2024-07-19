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

    if (this.qubitCount == 1) {
      this.qubitCircleSize = "xl";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 2;
    } else if (this.qubitCount == 2) {
      this.qubitCircleSize = "xl";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 4;
    } else if (this.qubitCount == 3) {
      this.qubitCircleSize = "xl";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 4;
    } else if (this.qubitCount == 4) {
      this.qubitCircleSize = "lg";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 8;
    } else if (this.qubitCount == 5) {
      this.qubitCircleSize = "base";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 8;
    } else if (this.qubitCount == 6) {
      this.qubitCircleSize = "base";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 16;
    } else if (this.qubitCount == 7) {
      this.qubitCircleSize = "base";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 16;
    } else if (this.qubitCount == 8) {
      this.qubitCircleSize = "sm";
      this.elementsMargin = spacingInPx(0.5);
      this.cols = 32;
    } else if (this.qubitCount == 9) {
      this.qubitCircleSize = "xs";
      this.cols = 32;
      this.elementsMargin = spacingInPx(0.25);
    } else if (this.qubitCount == 10) {
      this.qubitCircleSize = "xs";
      this.cols = 64;
      this.elementsMargin = spacingInPx(0.25);
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

  constructor(qubitCount: number, scrollRect: PIXI.Rectangle) {
    super();

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

    console.log(`startIndexX: ${this.startIndexX}`);
    console.log(`endIndexX: ${endIndexX}`);
    console.log(`startIndexY: ${this.startIndexY}`);
    console.log(`endIndexY: ${endIndexY}`);

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
          circle = new QubitCircle(0, 0, this.qubitCircleSize);
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
