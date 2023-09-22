import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

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

    this.graphics.lineStyle(1, 0xd4d4d8, 1, 0); // Zinc/300 https://tailwindcss.com/docs/customizing-colors
    this.graphics.beginFill(0xffffff, 1);
    this.graphics.drawRoundedRect(
      this.x,
      this.y,
      this.width,
      this.height,
      klass.cornerRadius
    );
    this.graphics.endFill();

    // TODO: dropshadow の定義を別ファイルに移動
    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  get width(): number {
    return 560;
  }

  get height(): number {
    return 104;
  }
}
