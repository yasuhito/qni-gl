import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { MeasurementGate } from "./measurement-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { rectIntersect } from "./util";
import { HGate } from "./h-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { RnotGate } from "./rnot-gate";
import { SGate } from "./s-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { TGate } from "./t-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { PhaseGate } from "./phase-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SwapGate } from "./swap-gate";
import { ControlGate } from "./control-gate";
import { AntiControlGate } from "./anti-control-gate";
import { BlochSphere } from "./bloch-sphere";
import { QFTGate } from "./qft-gate";
import { QFTDaggerGate } from "./qft-dagger-gate";

export type Operation =
  | HGate
  | XGate
  | YGate
  | ZGate
  | RnotGate
  | SGate
  | SDaggerGate
  | TGate
  | TDaggerGate
  | PhaseGate
  | RxGate
  | RyGate
  | RzGate
  | SwapGate
  | ControlGate
  | AntiControlGate
  | Write0Gate
  | Write1Gate
  | MeasurementGate
  | BlochSphere
  | QFTGate
  | QFTDaggerGate;

/**
 * @noInheritDoc
 */
export class Dropzone extends Container {
  static size = Gate.size;
  static wireWidth = 2;
  static quantumWireColor = tailwindColors.zinc["900"];

  view: Container;
  operation: Operation | null = null;
  protected wire: PIXI.Graphics;

  get size(): number {
    return Dropzone.size;
  }

  get width(): number {
    return Dropzone.size * 1.5;
  }

  get height(): number {
    return Dropzone.size;
  }

  isOccupied() {
    return this.operation !== null;
  }

  constructor() {
    super();

    this.view = new Container();
    this.addChild(this.view);

    this.wire = new PIXI.Graphics();
    this.view.addChild(this.wire);

    this.drawInputWire();
    this.drawOutputWire();
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
    gate: Gate,
    gateCenterX: number,
    gateCenterY: number,
    gateWidth: number,
    gateHeight: number
  ) {
    if (this.operation !== null && this.operation !== gate) {
      return false;
    }

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
    this.operation = gate as
      | HGate
      | XGate
      | YGate
      | ZGate
      | RnotGate
      | SGate
      | SDaggerGate
      | TGate
      | TDaggerGate
      | PhaseGate
      | RxGate
      | RyGate
      | RzGate
      | SwapGate
      | ControlGate
      | AntiControlGate
      | Write0Gate
      | Write1Gate
      | MeasurementGate
      | BlochSphere
      | QFTGate
      | QFTDaggerGate;

    this.wire.clear();
    this.drawInputWire();
    this.drawOutputWire();
  }

  unsnap(_gate: Gate) {
    this.operation = null;

    this.drawInputWire();
    this.drawOutputWire();
  }

  toJSON() {
    const pos = this.getGlobalPosition();

    return {
      x: pos.x,
      y: pos.y,
    };
  }

  toCircuitJSON() {
    if (this.operation === null) {
      return "1";
    }

    return this.operation.toCircuitJSON();
  }

  protected drawInputWire() {
    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(this.inputWireStartX, Dropzone.size / 2)
      .lineTo(this.inputWireEndX, Dropzone.size / 2);
  }

  protected drawOutputWire() {
    this.wire
      .lineStyle(Dropzone.wireWidth, Dropzone.quantumWireColor, 1, 0.5)
      .moveTo(this.outputWireStartX, Dropzone.size / 2)
      .lineTo(this.outputWireEndX, Dropzone.size / 2);
  }

  protected get inputWireStartX() {
    return 0;
  }

  protected get inputWireEndX() {
    if (this.isIconGate(this.operation)) {
      return Dropzone.size / 4;
    }
    return Dropzone.size * 0.75;
  }

  protected get outputWireStartX() {
    if (this.isIconGate(this.operation)) {
      return (Dropzone.size * 5) / 4;
    }
    return Dropzone.size * 0.75;
  }

  protected get outputWireEndX() {
    return Dropzone.size * 1.5;
  }

  protected isIconGate(gate: Gate | null) {
    if (gate === null) {
      return false;
    }

    return [Write0Gate, Write1Gate, MeasurementGate].some(
      (type) => gate instanceof type
    );
  }
}
