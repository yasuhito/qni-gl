import * as PIXI from "pixi.js";
import { HGate } from "./h-gate";

export class Dropzone {
  x: number;
  y: number;
  width = 32;
  height = 32;
  graphics: PIXI.Graphics;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(2, 0x1111ff, 1, 0);
    this.graphics.beginFill(0xffffff, 0);
    this.graphics.drawRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    this.graphics.endFill();
  }

  isSnappable(x: number, y: number, width: number, height: number) {
    const snapRatio = 0.5;

    return this.rectIntersect(
      x - width / 2,
      y - height / 2,
      width,
      height,
      this.x - (this.width * snapRatio) / 2,
      this.y - (this.height * snapRatio) / 2,
      this.width * snapRatio,
      this.height * snapRatio
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
