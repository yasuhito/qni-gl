import * as PIXI from "pixi.js";
import { AntiControlGate } from "./anti-control-gate";
import { BlochSphere } from "./bloch-sphere";
import { Colors, FULL_OPACITY, WireColor } from "./colors";
import { Container } from "pixi.js";
import { ControlGate } from "./control-gate";
import { Gate } from "./gate";
import { HGate } from "./h-gate";
import { MeasurementGate } from "./measurement-gate";
import { PhaseGate } from "./phase-gate";
import { QFTDaggerGate } from "./qft-dagger-gate";
import { QFTGate } from "./qft-gate";
import { RnotGate } from "./rnot-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { SGate } from "./s-gate";
import { Signal } from "typed-signals";
import { SwapGate } from "./swap-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { TGate } from "./t-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { rectIntersect } from "./util";

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

export enum WireType {
  Quantum = "quantum",
  Classical = "classical",
}

const LINE_ALIGNMENT_MIDDLE = 0.5;

/**
 * @noInheritDoc
 */
export class Dropzone extends Container {
  static size = Gate.size;
  static wireWidth = 2;

  view: Container;
  operation: Operation | null = null;
  inputWireType: WireType = WireType.Classical;
  outputWireType: WireType = WireType.Classical;

  onSnap: Signal<(dropzone: Dropzone) => void>;

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

    this.onSnap = new Signal();

    this.wire = new PIXI.Graphics();
    this.addChild(this.wire);

    this.redrawWires();
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

    this.redrawWires();

    this.onSnap.emit(this);
  }

  unsnap(_gate: Gate) {
    this.operation = null;
    this.redrawWires();
  }

  // TODO: 使える場所ではこのメソッドを使う
  redrawWires() {
    this.wire.clear();
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
    let inputWireColor: WireColor = Colors.bg.wire.classical;
    if (this.inputWireType === WireType.Quantum) {
      inputWireColor = Colors.bg.wire.quantum;
    }

    this.wire
      .lineStyle(
        Dropzone.wireWidth,
        inputWireColor,
        FULL_OPACITY,
        LINE_ALIGNMENT_MIDDLE
      )
      .moveTo(this.inputWireStartX, Dropzone.size / 2)
      .lineTo(this.inputWireEndX, Dropzone.size / 2);
  }

  protected drawOutputWire() {
    let outputWireColor: WireColor = Colors.bg.wire.classical;
    if (this.outputWireType === WireType.Quantum) {
      outputWireColor = Colors.bg.wire.quantum;
    }

    this.wire
      .lineStyle(
        Dropzone.wireWidth,
        outputWireColor,
        FULL_OPACITY,
        LINE_ALIGNMENT_MIDDLE
      )
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
