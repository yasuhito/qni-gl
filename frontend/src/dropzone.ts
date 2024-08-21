import { Container, Point } from "pixi.js";
import { DropzoneRenderer } from "./dropzone-renderer";
import { OperationComponent } from "./operation-component";
import { Operation } from "./operation";
import { WireType } from "./types";
import { spacingInPx } from "./util";
import { DROPZONE_EVENTS, OPERATION_EVENTS } from "./events";

export class Dropzone extends Container {
  static size = spacingInPx(8);

  inputWireType: WireType = WireType.Classical;
  outputWireType: WireType = WireType.Classical;

  private _connectTop = false;
  private _connectBottom = false;
  private _swapConnectTop = false;
  private _swapConnectBottom = false;
  private _controlConnectTop = false;
  private _controlConnectBottom = false;

  private renderer: DropzoneRenderer;

  constructor() {
    super();
    this.renderer = new DropzoneRenderer(this, this.size);
    this.redrawWires();
    this.redrawConnections();
  }

  get size(): number {
    return Dropzone.size;
  }

  slotWidth(): number {
    return Dropzone.size * 1.5;
  }

  get operation(): Operation | null {
    for (const each of this.children) {
      if (each instanceof OperationComponent) {
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

  set swapConnectTop(value) {
    this._swapConnectTop = value;
  }

  get swapConnectTop() {
    return this._swapConnectTop;
  }

  set swapConnectBottom(value) {
    this._swapConnectBottom = value;
  }

  get swapConnectBottom() {
    return this._swapConnectBottom;
  }

  set controlConnectTop(value) {
    this._controlConnectTop = value;
  }

  get controlConnectTop() {
    return this._controlConnectTop;
  }

  set controlConnectBottom(value) {
    this._controlConnectBottom = value;
  }

  get controlConnectBottom() {
    return this._controlConnectBottom;
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

  snap(gate: OperationComponent) {
    this.addChild(gate);
    if (this.operation === null) {
      throw new Error("Operation is null");
    }
    this.operation.on(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    this.redrawWires();
    this.emit(DROPZONE_EVENTS.GATE_SNAPPED, this);
  }

  unsnap() {
    if (this.operation === null) {
      throw new Error("Operation is null");
    }
    this.operation.off(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    this.redrawWires();
  }

  private emitGrabGateEvent(gate: OperationComponent, globalPosition: Point) {
    this.emit(DROPZONE_EVENTS.GATE_GRABBED, gate, globalPosition);
  }

  redrawWires() {
    this.renderer.updateWires(
      this.inputWireType,
      this.outputWireType,
      this.isIconGate(this.operation)
    );
  }

  redrawConnections() {
    this.renderer.updateConnections(this.connectTop, this.connectBottom);
  }

  toJSON() {
    if (this.operation === null) {
      return "1";
    }
    return this.operation.toJSON();
  }

  hasWriteGate() {
    return ["Write0Gate", "Write1Gate"].some(
      (each) => this.operation?.operationType === each
    );
  }

  hasMeasurementGate() {
    return this.operation?.operationType === "MeasurementGate";
  }

  private isIconGate(gate: OperationComponent | null) {
    if (gate === null) {
      return false;
    }
    return ["Write0Gate", "Write1Gate", "MeasurementGate"].some(
      (type) => gate.operationType === type
    );
  }
}
