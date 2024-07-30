import * as PIXI from "pixi.js";
import { Colors } from "./colors";

const FrameDividerConfig = {
  DIVIDER_HEIGHT: 2,
  CURSOR_STYLE: "ns-resize",
  DEFAULT_CURSOR: "default",
};

/**
 * 量子回路フレームと状態ベクトルフレーム間のドラッグ可能な分割線を表すクラス。
 */
export class FrameDivider extends PIXI.Graphics {
  private static instance: FrameDivider | null = null;

  app: PIXI.Application;
  dragging = false;
  dragStartY = 0;

  static initialize(app: PIXI.Application, initialY: number): void {
    if (this.instance === null) {
      this.instance = new FrameDivider(app, initialY);
    } else {
      console.warn("FrameDivider is already initialized");
    }
  }

  static getInstance(): FrameDivider {
    if (this.instance === null) {
      throw new Error(
        "FrameDivider is not initialized. Call initialize() first."
      );
    }
    return this.instance;
  }

  private constructor(app: PIXI.Application, initialY: number) {
    super();

    this.app = app;
    this.y = initialY;
    this.drawDivider();
    this.interactive = true;
    this.cursor = FrameDividerConfig.CURSOR_STYLE;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.on("pointerdown", this.startDragging);
    this.on("pointerup", this.endDragging);
    this.on("pointerupoutside", this.endDragging);
  }

  private drawDivider() {
    this.clear();
    this.beginFill(Colors["border-component"]);
    this.drawRect(
      0,
      0,
      this.app.screen.width,
      FrameDividerConfig.DIVIDER_HEIGHT
    );
    this.endFill();
  }

  // 新しく追加するメソッド
  public updateWidth() {
    this.drawDivider();
  }

  private startDragging(event: PIXI.FederatedPointerEvent) {
    this.dragging = true;
    this.dragStartY = event.global.y - this.y;
    this.app.stage.cursor = FrameDividerConfig.CURSOR_STYLE;
  }

  private endDragging() {
    if (!this.dragging) return;

    this.dragging = false;
    this.app.stage.cursor = FrameDividerConfig.DEFAULT_CURSOR;
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
