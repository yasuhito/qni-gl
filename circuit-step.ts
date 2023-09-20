import * as PIXI from "pixi.js";
import { Dropzone } from "./dropzone";

export class CircuitStep {
  qubitCount: number; // 量子ビットの数
  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;
  padding = 32;
  gapBetweenQubits = 16;
  dropzones: Dropzone[] = [];

  // TODO: レイアウトを自動化 https://github.com/pixijs/layout
  constructor(qubitCount: number, x: number, y: number) {
    this.qubitCount = qubitCount;
    this.x = x;
    this.y = y;

    // ランダムな位置に dropzone を複数作成
    for (let i = 0; i < this.qubitCount; i++) {
      const dropzoneX = this.x + this.padding + (32 + 16) * i + 16;
      const dropzoneY = this.y + 16;
      const dropzone = new Dropzone(dropzoneX, dropzoneY);
      this.dropzones.push(dropzone);
    }

    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(2, 0x11ff11, 1, 0);
    this.graphics.beginFill(0xffffff, 0);
    this.graphics.drawRect(this.x, this.y, this.width, this.height);
    this.graphics.endFill();
  }

  get width(): number {
    return (
      this.qubitCount * 32 +
      (this.qubitCount - 1) * this.gapBetweenQubits +
      this.padding * 2
    );
  }

  // TODO: Dropzone の高さを取得する
  get height(): number {
    return 32;
  }
}
