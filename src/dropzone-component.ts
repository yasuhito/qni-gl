import * as PIXI from "pixi.js";
import { Colors, FULL_OPACITY, WireColor } from "./colors";
import { Container } from "pixi.js";
import { GateComponent } from "./gate-component";
import { Operation } from "./operation";
import { rectIntersect } from "./util";
import { spacingInPx } from "./util";

export enum WireType {
  Quantum = "quantum",
  Classical = "classical",
}

const LINE_ALIGNMENT_MIDDLE = 0.5;

/**
 * @noInheritDoc
 */
export class DropzoneComponent extends Container {
  static size = spacingInPx(8);
  static wireWidth = 2;
  static connectionWidth = 4;

  // operation: Operation | null = null;
  inputWireType: WireType = WireType.Classical;
  outputWireType: WireType = WireType.Classical;

  _connectTop = false;
  _connectBottom = false;

  protected wire: PIXI.Graphics;
  protected connection: PIXI.Graphics;

  get size(): number {
    return DropzoneComponent.size;
  }

  get width(): number {
    return DropzoneComponent.size * 1.5;
  }

  get height(): number {
    return DropzoneComponent.size;
  }

  get operation(): Operation | null {
    for (const each of this.children) {
      if (each instanceof GateComponent) {
        return each as Operation;
      }
    }

    return null;
  }

  isOccupied() {
    return this.operation !== null;
  }

  set connectTop(value) {
    this._connectTop = value;
    this.redrawConnections();
  }

  get connectTop() {
    return this._connectTop;
  }

  set connectBottom(value) {
    this._connectBottom = value;
    this.redrawConnections();
  }

  get connectBottom() {
    return this._connectBottom;
  }

  constructor() {
    super();

    this.wire = new PIXI.Graphics();
    this.addChild(this.wire);

    this.connection = new PIXI.Graphics();
    this.addChild(this.connection);

    this.redrawWires();
    this.redrawConnections();
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
    this.addChild(gate);

    if (this.operation === null) {
      throw new Error("Operation is null");
    }

    this.operation.on("grab", this.emitGrabGateEvent, this);

    this.redrawWires();
    this.emit("snap", this);
  }

  unsnap() {
    if (this.operation === null) {
      throw new Error("Operation is null");
    }

    this.operation.off("grab", this.emitGrabGateEvent, this);
    this.redrawWires();
  }

  private emitGrabGateEvent(gate, globalPosition) {
    this.emit("grabGate", gate, globalPosition);
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

  redrawConnections() {
    this.connection.clear();

    if (this.connectTop) {
      this.drawConnection(this.lowerConnectionStartY, this.lowerConnectionEndY);
    }
    if (this.connectBottom) {
      this.drawConnection(this.upperConnectionStartY, this.upperConnectionEndY);
    }
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
    return ["Write0Gate", "Write1Gate"].some(
      (each) => this.operation?.gateType() === each
    );
  }

  hasMeasurementGate() {
    return this.operation?.gateType() === "MeasurementGate";
  }

  protected drawWire(startX: number, endX: number, color: WireColor) {
    this.wire
      .lineStyle(this.wireWidth, color, this.wireAlpha, this.wireAlignment)
      .moveTo(startX, this.wireY)
      .lineTo(endX, this.wireY);
  }

  protected drawConnection(startY: number, endY: number) {
    this.wire
      .lineStyle(
        this.connectionWidth,
        Colors["bg-brand"],
        this.wireAlpha,
        this.wireAlignment
      )
      .moveTo(this.connectionX, startY)
      .lineTo(this.connectionX, endY);
  }

  protected get wireWidth() {
    return DropzoneComponent.wireWidth;
  }

  protected get connectionWidth() {
    return DropzoneComponent.connectionWidth;
  }

  protected get inputWireColor() {
    if (this.inputWireType === WireType.Quantum) {
      return Colors["text"];
    }

    return Colors["text-inverse"];
  }

  protected get outputWireColor() {
    if (this.outputWireType === WireType.Quantum) {
      return Colors["text"];
    }

    return Colors["text-inverse"];
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

  protected get connectionX() {
    const center = new PIXI.Point(
      DropzoneComponent.size * 0.75,
      DropzoneComponent.size / 2
    );
    return center.x;
  }

  protected get lowerConnectionStartY() {
    return DropzoneComponent.size * -0.25;
  }

  protected get lowerConnectionEndY() {
    return DropzoneComponent.size * 0.5;
  }

  protected get upperConnectionStartY() {
    return DropzoneComponent.size * 0.5;
  }

  protected get upperConnectionEndY() {
    return DropzoneComponent.size * 1.25;
  }

  protected isIconGate(gate: GateComponent | null) {
    if (gate === null) {
      return false;
    }

    return ["Write0Gate", "Write1Gate", "MeasurementGate"].some(
      (type) => gate.gateType() === type
    );
  }
}
