import * as PIXI from "pixi.js";
import { Colors } from "./colors";

const FrameDividerConfig = {
  DIVIDER_HEIGHT: 2,
  CURSOR_STYLE: "ns-resize",
  DEFAULT_CURSOR: "default",
} as const;

/**
 * 量子回路フレームと状態ベクトルフレーム間のドラッグ可能な分割線を表すクラス。
 *
 * @noInheritDoc
 */
export class FrameDivider extends PIXI.Graphics {
  private static instance: FrameDivider | null = null;

  private readonly app: PIXI.Application;
  private _isDragging = false;
  private dragStartY = 0;

  static initialize(app: PIXI.Application, initialY: number): FrameDivider {
    if (!this.instance) {
      this.instance = new FrameDivider(app, initialY);
    }
    return this.instance;
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
    this.on("pointerdown", this.startDragging, this);
    this.app.stage.on("pointermove", this.move, this);
    this.app.stage.on("pointerup", this.endDragging, this);
    this.app.stage.on("pointerupoutside", this.endDragging, this);
  }

  private drawDivider(): void {
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

  public updateWidth(): void {
    this.drawDivider();
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  private startDragging(event: PIXI.FederatedPointerEvent): void {
    this._isDragging = true;
    this.dragStartY = event.global.y - this.y;
    this.app.stage.cursor = FrameDividerConfig.CURSOR_STYLE;
  }

  private endDragging(): void {
    if (!this.isDragging) return;

    this._isDragging = false;
    this.app.stage.cursor = FrameDividerConfig.DEFAULT_CURSOR;
  }

  private move(event: PIXI.FederatedPointerEvent): void {
    if (!this.isDragging) return;

    const newPosition = event.global.y - this.dragStartY;
    this.y = this.clampPosition(newPosition);
  }

  private clampPosition(position: number): number {
    const minPosition = 0;
    const maxPosition =
      this.app.screen.height - FrameDividerConfig.DIVIDER_HEIGHT;

    return Math.max(minPosition, Math.min(position, maxPosition));
  }
}
