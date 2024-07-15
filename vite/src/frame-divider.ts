import * as PIXI from "pixi.js";
import { Colors } from "./colors";

export const EVENT_TYPES = {
  START_DRAGGING: "frame-divider:start-dragging",
  END_DRAGGING: "frame-divider:end-dragging",
};

/**
 * 量子回路フレームと状態ベクトルフレーム間のドラッグ可能な分割線を表すクラス。
 * ドラッグ操作によって分割線の位置を調整し、カスタムイベントを発生させる。
 */
export class FrameDivider extends PIXI.Graphics {
  dragging = false;
  dragStartY = 0;

  /**
   * コンストラクタ
   * @param width - Divider の幅
   * @param y - Divider の初期位置（y座標）
   */
  constructor(width: number, y: number) {
    super();

    this.y = y;
    this.beginFill(Colors["border-component"]);
    this.drawRect(0, 0, width, 2);
    this.endFill();
    this.interactive = true;
    this.cursor = "ns-resize";

    this.on("pointerdown", this.startDragging.bind(this));
    this.on("pointerup", this.endDragging.bind(this));
    this.on("pointerupoutside", this.endDragging.bind(this));
  }

  /**
   * ドラッグ開始時の処理
   * @param event - ポインターイベント
   */
  startDragging(event: PIXI.FederatedPointerEvent) {
    this.dragging = true;
    this.dragStartY = event.global.y - this.y;
    this.emit(EVENT_TYPES.START_DRAGGING, this);
  }

  /**
   * ドラッグ終了時の処理
   */
  endDragging() {
    if (!this.dragging) return;

    this.dragging = false;
    this.emit(EVENT_TYPES.END_DRAGGING, this);
  }

  /**
   * ドラッグ中の位置更新
   * @param event - ポインターイベント
   * @param app - PIXI アプリケーションインスタンス
   */
  move(event: PIXI.FederatedPointerEvent, app: PIXI.Application) {
    if (!this.dragging) return;

    let borderPosition = event.global.y - this.dragStartY;

    if (borderPosition < 0) borderPosition = 0;
    if (borderPosition > app.screen.height) borderPosition = app.screen.height;

    this.y = borderPosition;
  }
}
