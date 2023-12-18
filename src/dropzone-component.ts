import * as PIXI from "pixi.js";
import { Colors, FULL_OPACITY, WireColor } from "./colors";
import { Container } from "pixi.js";
import { GateComponent } from "./gate-component";
import { MeasurementGate } from "./measurement-gate";
import { Operation } from "./operation";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { rectIntersect } from "./util";

export enum WireType {
  Quantum = "quantum",
  Classical = "classical",
}

const LINE_ALIGNMENT_MIDDLE = 0.5;

/**
 * @noInheritDoc
 */
export class DropzoneComponent extends Container {
  static size = GateComponent.size;
  static wireWidth = 2;

  view: Container;
  operation: Operation | null = null;
  inputWireType: WireType = WireType.Classical;
  outputWireType: WireType = WireType.Classical;

  protected wire: PIXI.Graphics;

  get size(): number {
    return DropzoneComponent.size;
  }

  get width(): number {
    return DropzoneComponent.size * 1.5;
  }

  get height(): number {
    return DropzoneComponent.size;
  }

  isOccupied() {
    return this.operation !== null;
  }

  constructor() {
    super();

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
    gate: GateComponent,
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

  snap(gate: GateComponent) {
    this.operation = gate as Operation;
    this.redrawWires();
    this.emit("snap", this);
  }

  unsnap() {
    this.operation = null;
    this.redrawWires();
  }

  redrawWires() {
    this.wire.clear();

    this.drawWire(
      this.inputWireStartX,
      this.inputWireEndX,
      this.inputWireColor
    );
    this.drawWire(
      this.outputWireStartX,
      this.outputWireEndX,
      this.outputWireColor
    );
  }

  toJSON() {
    const pos = this.getGlobalPosition();

    return {
      x: pos.x + this.width / 2,
      y: pos.y + this.height / 2,
    };
  }

  toCircuitJSON() {
    if (this.operation === null) {
      return "1";
    }

    return this.operation.toCircuitJSON();
  }

  hasWriteGate() {
    return [Write0Gate, Write1Gate].some(
      (each) => this.operation instanceof each
    );
  }

  hasMeasurementGate() {
    return this.operation instanceof MeasurementGate;
  }

  protected drawWire(startX: number, endX: number, color: WireColor) {
    this.wire
      .lineStyle(this.wireWidth, color, this.wireAlpha, this.wireAlignment)
      .moveTo(startX, this.wireY)
      .lineTo(endX, this.wireY);
  }

  protected get wireWidth() {
    return DropzoneComponent.wireWidth;
  }

  protected get inputWireColor() {
    if (this.inputWireType === WireType.Quantum) {
      return Colors.bg.wire.quantum;
    }

    return Colors.bg.wire.classical;
  }

  protected get outputWireColor() {
    if (this.outputWireType === WireType.Quantum) {
      return Colors.bg.wire.quantum;
    }

    return Colors.bg.wire.classical;
  }

  protected get inputWireStartX() {
    return 0;
  }

  protected get inputWireEndX() {
    if (this.isIconGate(this.operation)) {
      return DropzoneComponent.size / 4;
    }
    return DropzoneComponent.size * 0.75;
  }

  protected get outputWireStartX() {
    if (this.isIconGate(this.operation)) {
      return (DropzoneComponent.size * 5) / 4;
    }
    return DropzoneComponent.size * 0.75;
  }

  protected get outputWireEndX() {
    return DropzoneComponent.size * 1.5;
  }

  protected get wireY() {
    const center = new PIXI.Point(
      DropzoneComponent.size / 2,
      DropzoneComponent.size / 2
    );
    return center.y;
  }

  protected get wireAlpha() {
    return FULL_OPACITY;
  }

  protected get wireAlignment() {
    return LINE_ALIGNMENT_MIDDLE;
  }

  protected isIconGate(gate: GateComponent | null) {
    if (gate === null) {
      return false;
    }

    return [Write0Gate, Write1Gate, MeasurementGate].some(
      (type) => gate instanceof type
    );
  }
}
