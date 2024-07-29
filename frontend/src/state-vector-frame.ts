import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import {
  STATE_VECTOR_EVENTS,
  StateVectorComponent,
} from "./state-vector-component";
import { throttle } from "lodash";

/**
 * スクロール機能つきフレーム。状態ベクトルを表示する。
 */
export class StateVectorFrame extends PIXI.Container {
  private static instance: StateVectorFrame | null = null;
  private static readonly PADDING_MULTIPLIER: number = 2;

  readonly stateVector: StateVectorComponent;

  private frameWidth: number;
  private frameHeight: number;
  private readonly background: PIXI.Graphics;
  private maskGraphics: PIXI.Graphics;
  private scrollContainer: PIXI.Container;

  /**
   * インスタンスを取得
   */
  static getInstance(
    width: number,
    height: number,
    maxQubitCount: number
  ): StateVectorFrame {
    if (this.instance === null) {
      this.instance = new StateVectorFrame(width, height, maxQubitCount);
    }
    return this.instance;
  }

  private constructor(width: number, height: number, maxQubitCount: number) {
    super();

    this.frameWidth = width;
    this.frameHeight = height;
    this.background = new PIXI.Graphics();
    this.stateVector = new StateVectorComponent(
      1,
      maxQubitCount,
      new PIXI.Rectangle(0, 0, width, height)
    );
    this.maskGraphics = new PIXI.Graphics();
    this.scrollContainer = new PIXI.Container();

    this.initializeBackground();
    this.updateMask();
    this.initStateVector();

    this.addChildAt(this.background, 0);
    this.addChild(this.scrollContainer);
    this.scrollContainer.addChild(this.stateVector);
    this.addChild(this.maskGraphics);
    this.scrollContainer.mask = this.maskGraphics;

    // StateVectorComponentにスクロール位置を伝える
    const scrollRect = new PIXI.Rectangle(
      -this.scrollContainer.x,
      -this.scrollContainer.y,
      this.frameWidth,
      this.frameHeight
    );
    this.stateVector.updateVisibleQubitCircles(scrollRect);

    this.updateStateVectorPosition();
    this.initializeScrollEvents();
  }

  private initializeBackground() {
    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.frameWidth, this.frameHeight);
    this.background.endFill();
  }

  private updateMask(): void {
    this.maskGraphics.clear();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(0, 0, this.frameWidth, this.frameHeight);
    this.maskGraphics.endFill();
  }

  private initStateVector() {
    this.stateVector.on(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, () => {
      this.updateStateVectorPosition();
    });
  }

  /**
   * 状態ベクトルの位置とサイズを更新する
   */
  repositionAndResize(y: number, width: number, height: number) {
    this.y = y;
    this.frameWidth = width;
    this.frameHeight = height;

    this.background.clear();
    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.frameWidth, this.frameHeight);
    this.background.endFill();

    this.updateStateVectorPosition();
    this.updateMask();
  }

  private updateStateVectorPosition() {
    if (
      this.stateVector.width > this.width ||
      this.stateVector.height > this.height
    ) {
      this.scrollContainer.x = 0;
      this.scrollContainer.y = 0;
    } else {
      this.scrollContainer.x = (this.width - this.stateVector.width) / 2;
      this.scrollContainer.y = (this.height - this.stateVector.height) / 2;
    }
  }

  /**
   * スクロールイベントの初期化
   */
  private initializeScrollEvents(): void {
    this.interactive = true;
    this.on("wheel", throttle(this.adjustScrollPosition, 100), this);
  }

  /**
   * スクロール処理
   */
  private adjustScrollPosition(event: WheelEvent): void {
    this.adjustScrollPositionXY(
      "y",
      event.deltaY,
      this.stateVector.height,
      this.height
    );
    this.adjustScrollPositionXY(
      "x",
      event.deltaX,
      this.stateVector.width,
      this.width
    );
  }

  /**
   * 指定された方向にスクロール位置を調整する
   */
  private adjustScrollPositionXY(
    scrollDirection: "x" | "y",
    delta: number,
    stateVectorSize: number,
    frameSize: number
  ): void {
    if (!this.isScrollingNeeded(stateVectorSize, frameSize)) return;

    // スクロールの方向:
    // - vertical: 上方向へのスクロールでdeltaが正、下方向で負
    // - horizontal: 左方向へのスクロールでdeltaが正、右方向で負
    this.scrollContainer[scrollDirection] -= delta;

    const scrollableDistance = this.calculateScrollableDistance(
      stateVectorSize,
      frameSize
    );

    this.scrollContainer[scrollDirection] = this.limitScrollPosition(
      this.scrollContainer[scrollDirection],
      scrollableDistance
    );

    // StateVectorComponentにスクロール位置を伝える
    const scrollRect = new PIXI.Rectangle(
      -this.scrollContainer.x,
      -this.scrollContainer.y,
      this.frameWidth,
      this.frameHeight
    );
    this.stateVector.updateVisibleQubitCircles(scrollRect);
  }

  /**
   * 状態ベクトルとフレームのサイズに基づいてスクロールが必要かどうかを返す
   */
  private isScrollingNeeded(
    stateVectorSize: number,
    frameSize: number
  ): boolean {
    return stateVectorSize > frameSize;
  }

  /**
   * フレーム内のスクロール可能な距離を計算する
   */
  private calculateScrollableDistance(
    stateVectorSize: number,
    frameSize: number
  ): number {
    // scrollableDistance が正の値の場合、その値だけスクロール可能
    // 0の場合、スクロールは不要（stateVectorがフレーム内に収まっている）
    return Math.max(0, stateVectorSize - frameSize);
  }

  /**
   * 許容範囲内でスクロール位置を制限する
   */
  private limitScrollPosition(
    position: number,
    scrollableDistance: number
  ): number {
    // 上端または左端の制限
    if (position > 0) {
      return 0;
    }
    // 下端または右端の制限
    if (position < -scrollableDistance) {
      return -scrollableDistance;
    }
    return position;
  }
}