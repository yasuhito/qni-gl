import * as PIXI from "pixi.js";
import { Colors, FULL_OPACITY, WireColor } from "./colors";
import { Container } from "pixi.js";
import { GateComponent } from "./gate-component";
import { Operation } from "./operation";
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

    this.drawWireSegment(
      this.inputWireStartX,
      this.inputWireEndX,
      this.inputWireColor,
      this.inputWireType
    );
    this.drawWireSegment(
      this.outputWireStartX,
      this.outputWireEndX,
      this.outputWireColor,
      this.outputWireType
    );
  }

  private drawWireSegment(
    startX: number,
    endX: number,
    color: WireColor,
    wireType: WireType
  ) {
    this.wire
      .lineStyle(this.wireWidth, color, this.wireAlpha, this.wireAlignment)
      .moveTo(startX, this.wireY)
      .lineTo(endX, this.wireY);

    // Add any additional styling for quantum wires if needed
    if (wireType === WireType.Quantum) {
      // For example, you could add a dashed line effect for quantum wires
      // This is just a placeholder - implement as needed
      // this.drawQuantumWireEffect(startX, endX);
    }
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
    this.connection
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
    return this.getWireColor(this.inputWireType);
  }

  protected get outputWireColor() {
    return this.getWireColor(this.outputWireType);
  }

  private getWireColor(wireType: WireType): WireColor {
    return wireType === WireType.Quantum
      ? Colors["text"]
      : Colors["text-inverse"];
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
