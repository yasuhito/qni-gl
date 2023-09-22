import * as PIXI from "pixi.js";
import { Dropzone } from "./dropzone";

export class CircuitStep {
  qubitCount: number; // 量子ビットの数
  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;
  dropzones: Dropzone[] = [];

  static get height(): number {
    return Dropzone.size + this.paddingY * 2;
  }

  static get gapBetweenGates(): number {
    return Dropzone.size / 2;
  }

  static get paddingX(): number {
    return Dropzone.size;
  }

  static get paddingY(): number {
    return Dropzone.size / 4;
  }

  constructor(qubitCount: number, x: number, y: number) {
    this.qubitCount = qubitCount;
    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    for (let i = 0; i < this.qubitCount; i++) {
      const dropzoneX = this.x + this.paddingX + (32 + 16) * i + 16;
      const dropzoneY = this.y + this.paddingY + Dropzone.size / 2;
      const dropzone = new Dropzone(dropzoneX, dropzoneY);
      this.dropzones.push(dropzone);
      this.graphics.addChild(dropzone.graphics);
    }

    this.graphics.lineStyle(1, 0xeeeeee, 1, 0);
    this.graphics.drawRect(this.x, this.y, this.width, this.height);
  }

  get width(): number {
    const klass = this.constructor as typeof CircuitStep;

    return (
      this.qubitCount * 32 +
      (this.qubitCount - 1) * klass.gapBetweenGates +
      this.paddingX * 2
    );
  }

  get height(): number {
    const klass = this.constructor as typeof CircuitStep;
    return klass.height;
  }

  get paddingX(): number {
    const klass = this.constructor as typeof CircuitStep;
    return klass.paddingX;
  }

  get paddingY(): number {
    const klass = this.constructor as typeof CircuitStep;
    return klass.paddingY;
  }
}
