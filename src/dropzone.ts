import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { MeasurementGate } from "./measurement-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { rectIntersect } from "./util";

/**
 * @noInheritDoc
 */
export class Dropzone extends Container {
  static size = Gate.size;
  static wireWidth = 2;
  static quantumWireColor = tailwindColors.zinc["900"];

  view: Container;
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

    this.view = new Container();
    this.addChild(this.view);

    this.wire = new PIXI.Graphics();
    this.view.addChild(this.wire);

    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(0, Dropzone.size / 2)
      .lineTo(Dropzone.size * 1.5, Dropzone.size / 2);
  }

  /**
   * 指定したゲートがこのドロップゾーンにスナップできるかどうかを返す。
   *
   *        x+size/4+((1-snapRatio)*size)/2,
   *        y+size/4+((1-snapRatio)*size)/2
   *                  │
   *        x+size/4  │
   *              │   │
   *     x,y      ▼   │
   *       ┌──────┬───┼──────────────────────────┬──────┐  ┬
   *       │      │   ▼                          │      │  │
   *       │      │   ┏━━━━━━━━━━━━━━━━━━━━━━━┓  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃       snapzone        ┃  │      │  │  size
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┗━━━━━━━━━━━━━━━━━━━━━━━┛  │      │  │
   *       │      │                              │      │  │
   *       └──────┴──────────────────────────────┴──────┘  ┴
   *
   *              ├──────────────────────────────┤
   *                            size
   *
   * @param gateCenterX ゲート中心の x 座標
   * @param gateCenterY ゲート中心の y 座標
   * @param gateWidth ゲートの幅
   * @param gateHeight ゲートの高さ
   */
  isSnappable(
    gateCenterX: number,
    gateCenterY: number,
    gateWidth: number,
    gateHeight: number
  ) {
    const snapRatio = 0.5;
    const gateX = gateCenterX - gateWidth / 2;
    const gateY = gateCenterY - gateHeight / 2;
    const dropboxPosition = this.getGlobalPosition();
    const snapzoneX =
      dropboxPosition.x + this.size / 4 + ((1 - snapRatio) * this.size) / 2;
    const snapzoneY = dropboxPosition.y + ((1 - snapRatio) * this.size) / 2;
    const snapzoneWidth = this.size * snapRatio;
    const snapzoneHeight = this.size * snapRatio;

    return rectIntersect(
      gateX,
      gateY,
      gateWidth,
      gateHeight,
      snapzoneX,
      snapzoneY,
      snapzoneWidth,
      snapzoneHeight
    );
  }

  snap(gate: Gate) {
    if (
      gate instanceof Write0Gate ||
      gate instanceof Write1Gate ||
      gate instanceof MeasurementGate
    ) {
      this.wire.clear();

      this.wire.lineStyle(
        Dropzone.wireWidth,
        Dropzone.quantumWireColor,
        1,
        0.5
      );

      // インプットワイヤを描く
      this.wire
        .moveTo(0, Dropzone.size * 0.5)
        .lineTo(Dropzone.size / 4, Dropzone.size * 0.5);

      // アウトプットワイヤを描く
      this.wire
        .moveTo((Dropzone.size * 5) / 4, Dropzone.size * 0.5)
        .lineTo((Dropzone.size * 6) / 4, Dropzone.size * 0.5);
    }
  }

  unsnap(gate: Gate) {
    // TODO: 関数にまとめる (constructor() でも使っている)
    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(0, Dropzone.size / 2)
      .lineTo(Dropzone.size * 1.5, Dropzone.size / 2);
  }

  toJSON() {
    const pos = this.getGlobalPosition();

    return {
      x: pos.x,
      y: pos.y,
    };
  }
}
