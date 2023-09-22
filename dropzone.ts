import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class Dropzone {
  static size = Gate.size;

  x: number; // 中心の x 座標
  y: number; // 中心の y 座標
  graphics: PIXI.Graphics;

  get size(): number {
    const klass = this.constructor as typeof Gate;
    return klass.size;
  }

  // x, y は Dropzone の中心座標
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(1, 0x1111ff, 1, 0);
    this.graphics.drawRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  isSnappable(x: number, y: number, width: number, height: number) {
    const snapRatio = 0.5;

    return this.rectIntersect(
      x - width / 2,
      y - height / 2,
      width,
      height,
      this.x - (this.size * snapRatio) / 2,
      this.y - (this.size * snapRatio) / 2,
      this.size * snapRatio,
      this.size * snapRatio
    );
  }

  private rectIntersect(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }
    return true;
  }
}
