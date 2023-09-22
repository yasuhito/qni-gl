import * as PIXI from "pixi.js";

export class GatePalette {
  static cornerRadius = 12;

  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;

  constructor(x: number, y: number) {
    const klass = this.constructor as typeof GatePalette;

    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    this.graphics.lineStyle(1, 0xffffff, 1, 0);
    this.graphics.beginFill(0xffffff, 1);
    this.graphics.drawRoundedRect(
      this.x,
      this.y,
      this.width,
      this.height,
      klass.cornerRadius
    );
    this.graphics.endFill();
  }

  get width(): number {
    return 560;
  }

  get height(): number {
    return 104;
  }
}
