import * as PIXI from "pixi.js";
import { Colors } from "./colors";

/**
 * 量子回路フレームと状態ベクトルフレーム間のドラッグ可能な分割線を表すクラス。
 */
export class FrameDivider extends PIXI.Graphics {
  app: PIXI.Application;
  dragging = false;
  dragStartY = 0;

  constructor(app: PIXI.Application, initialY: number) {
    super();

    this.app = app;
    this.y = initialY;
    this.beginFill(Colors["border-component"]);
    this.drawRect(0, 0, this.app.screen.width, 2);
    this.endFill();
    this.interactive = true;
    this.cursor = "ns-resize";

    this.on("pointerdown", this.startDragging.bind(this));
    this.on("pointerup", this.endDragging.bind(this));
    this.on("pointerupoutside", this.endDragging.bind(this));
  }

  private startDragging(event: PIXI.FederatedPointerEvent) {
    this.dragging = true;
    this.dragStartY = event.global.y - this.y;
    this.app.stage.cursor = "ns-resize";
  }

  private endDragging() {
    if (!this.dragging) return;

    this.dragging = false;
    this.app.stage.cursor = "default";
  }

  move(event: PIXI.FederatedPointerEvent) {
    if (!this.dragging) return;

    let borderPosition = event.global.y - this.dragStartY;

    if (borderPosition < 0) borderPosition = 0;
    if (borderPosition > this.app.screen.height)
      borderPosition = this.app.screen.height;

    this.y = borderPosition;
  }
}
