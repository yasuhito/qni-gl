import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import {
  STATE_VECTOR_EVENTS,
  StateVectorComponent,
} from "./state-vector-component";
import { throttle } from "lodash";
import { Spacing } from "./spacing";

export class StateVectorFrame extends PIXI.Container {
  private static instance: StateVectorFrame | null = null;
  private static readonly PADDING_MULTIPLIER: number = 2;

  frameWidth: number;
  frameHeight: number;
  readonly background: PIXI.Graphics;
  readonly stateVector: StateVectorComponent;
  private maskGraphics: PIXI.Graphics; // マスク用のグラフィックを追加
  private scrollContainer: PIXI.Container; // スクロール用のコンテナを追加

  /**
   * インスタンスを取得するメソッド
   * @param width - 初期のフレーム幅
   * @param height - 初期のフレーム高さ
   */
  static getInstance(width: number, height: number): StateVectorFrame {
    if (this.instance === null) {
      this.instance = new StateVectorFrame(width, height);
    }
    return this.instance;
  }

  private constructor(width: number, height: number) {
    super();

    this.frameWidth = width;
    this.frameHeight = height;
    this.background = new PIXI.Graphics();
    this.stateVector = new StateVectorComponent(1);
    this.maskGraphics = new PIXI.Graphics();
    this.scrollContainer = new PIXI.Container();

    this.initBackground();
    this.updateMask();
    this.initStateVector();

    this.addChildAt(this.background, 0);
    this.addChild(this.scrollContainer);
    this.scrollContainer.addChild(this.stateVector);
    this.addChild(this.maskGraphics);
    this.scrollContainer.mask = this.maskGraphics;

    this.updateStateVectorPosition();
    this.initScrollEvents();
  }

  private initBackground() {
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
    this.stateVector.on(STATE_VECTOR_EVENTS.CHANGE, () => {
      this.updateStateVectorPosition();
    });
  }

  updateSizeAndPosition(y: number, height: number) {
    this.y = y;
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
      this.scrollContainer.x = (this.width - this.stateVector.bodyWidth) / 2;
      this.scrollContainer.y = (this.height - this.stateVector.bodyHeight) / 2;
    }
  }

  /**
   * スクロールイベントの初期化
   */
  private initScrollEvents(): void {
    this.interactive = true;
    this.on("wheel", throttle(this.adjustScrollPosition, 100), this);
  }

  /**
   * スクロール処理
   * @param event - ホイールイベント
   */
  private adjustScrollPosition(event: WheelEvent): void {
    const qubitCircleSize: number =
      Spacing.size.qubitCircle[this.stateVector.qubitCircleSize];
    const padding: number = qubitCircleSize;

    this.adjustScrollPositionXY(
      "y",
      event.deltaY,
      this.stateVector.height,
      this.height,
      padding
    );
    this.adjustScrollPositionXY(
      "x",
      event.deltaX,
      this.stateVector.width,
      this.width,
      padding
    );
  }

  private adjustScrollPositionXY(
    scrollDirection: "x" | "y",
    delta: number,
    stateVectorSize: number,
    frameSize: number,
    padding: number
  ): void {
    if (this.isScrollingNeeded(stateVectorSize, frameSize)) {
      // スクロールの方向:
      // - vertical: 上方向へのスクロールでdeltaが正、下方向で負
      // - horizontal: 左方向へのスクロールでdeltaが正、右方向で負
      this.scrollContainer[scrollDirection] -= delta;

      const scrollableDistance = this.calculateScrollableDistance(
        stateVectorSize,
        frameSize,
        padding
      );

      this.scrollContainer[scrollDirection] = this.limitScrollPosition(
        this.scrollContainer[scrollDirection],
        scrollableDistance
      );
    }
  }

  private isScrollingNeeded(
    stateVectorSize: number,
    frameSize: number
  ): boolean {
    return stateVectorSize > frameSize;
  }

  private calculateScrollableDistance(
    stateVectorSize: number,
    frameSize: number,
    padding: number
  ): number {
    // scrollableDistance が正の値の場合、その値だけスクロール可能
    // 0の場合、スクロールは不要（stateVectorがフレーム内に収まっている）
    return Math.max(
      0,
      stateVectorSize +
        padding * StateVectorFrame.PADDING_MULTIPLIER -
        frameSize
    );
  }

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
