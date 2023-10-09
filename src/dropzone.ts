import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { MeasurementGate } from "../measurement-gate";
import { Runner } from "@pixi/runner";
import { Write0Gate } from "../write0-gate";
import { Write1Gate } from "../write1-gate";

export class Dropzone extends Container {
  static size = Gate.size;
  static wireWidth = 2;
  static quantumWireColor = tailwindColors.zinc["900"];

  view: Container;
  snapRunner: Runner;
  protected wire: PIXI.Graphics;

  get size(): number {
    return Dropzone.size;
  }

  get height(): number {
    return Dropzone.size;
  }

  get width(): number {
    return Dropzone.size * 1.5;
  }

  constructor() {
    super();

    this.snapRunner = new Runner("snap");

    this.view = new Container();
    this.addChild(this.view);

    this.wire = new PIXI.Graphics();
    this.view.addChild(this.wire);

    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(0, Dropzone.size / 2)
      .lineTo(Dropzone.size * 1.5, Dropzone.size / 2);
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

  snap(gate: Gate) {
    if (
      gate instanceof Write0Gate ||
      gate instanceof Write1Gate ||
      gate instanceof MeasurementGate
    ) {
      this.wire.clear();

      // インプットワイヤを描く
      this.wire
        .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
        .moveTo(this.x, this.y - Dropzone.size * 0.75)
        .lineTo(this.x, this.y - Dropzone.size * 0.5);

      // アウトプットワイヤを描く
      this.wire
        .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
        .moveTo(this.x, this.y + Dropzone.size * 0.5)
        .lineTo(this.x, this.y + Dropzone.size * 0.75);
    }
  }

  unsnap(gate: Gate) {
    // 関数にまとめる (constructor() でも使っている)
    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(this.x, this.y - Dropzone.size * 0.75)
      .lineTo(this.x, this.y + Dropzone.size * 0.75);
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    };
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
