import { Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { DropzoneRenderer } from "./dropzone-renderer";
import { OperationComponent } from "./operation-component";
import { WireType } from "./types";
import { DROPZONE_EVENTS, OPERATION_EVENTS } from "./events";
import { spacingInPx } from "./util";
import { Operation } from "./operation";
import { Spacing } from "./spacing";

export class Dropzone extends Container {
  static readonly sizeInPx = spacingInPx(8);
  static readonly GATE_INSET_OFFSET = Dropzone.sizeInPx / 4;

  inputWireType: WireType = WireType.Classical;
  outputWireType: WireType = WireType.Classical;

  private _connectTop = false;
  private _connectBottom = false;
  private _swapConnectTop = false;
  private _swapConnectBottom = false;
  private _controlConnectTop = false;
  private _controlConnectBottom = false;

  private renderer: DropzoneRenderer;
  private selectionOverlay: Graphics | null = null;

  constructor() {
    super();

    this.renderer = new DropzoneRenderer(this);
    this.redrawWires();
    this.redrawConnections();
    this.eventMode = "static";
    this.on("pointerdown", this.emitSelectedEvent, this);
  }

  get totalSize(): number {
    return this.gateSize * 1.5;
  }

  get gateSize(): number {
    return Dropzone.sizeInPx;
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

  assign(gate: OperationComponent) {
    gate.insertable = false;

    this.addChild(gate);
    // リロード時、ゲートを正しい配置にするためのオフセット
    gate.position.set(Dropzone.GATE_INSET_OFFSET, Dropzone.GATE_INSET_OFFSET);
    if (this.operation === null) {
      throw new Error("Operation is null");
    }
    this.operation.on(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    this.redrawWires();
  }

  snap(gate: OperationComponent) {
    this.addChild(gate);
    if (this.operation === null) {
      throw new Error("Operation is null");
    }
    this.operation.on(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    this.redrawWires();
    this.emit(OPERATION_EVENTS.SNAPPED, this);
  }

  unsnap() {
    if (this.operation === null) {
      throw new Error("Operation is null");
    }
    this.operation.off(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    this.redrawWires();
  }

  /**
   * 指定された配置済みゲートをセルから外し、ドラッグ通知も解除する。
   */
  detach(operation: OperationComponent): void {
    operation.off(OPERATION_EVENTS.GRABBED, this.emitGrabGateEvent, this);
    if (operation.parent === this) {
      this.removeChild(operation);
    }
    this.redrawWires();
  }

  private emitGrabGateEvent(
    gate: OperationComponent,
    globalPosition: Point,
    additiveSelection = false,
  ) {
    if (additiveSelection) {
      this.emit(OPERATION_EVENTS.GRABBED, gate, globalPosition, true);
      return;
    }

    this.emit(OPERATION_EVENTS.GRABBED, gate, globalPosition);
  }

  /**
   * ゲートがないセルもペースト基準として選べるよう、セル選択を通知する。
   */
  private emitSelectedEvent(event: FederatedPointerEvent) {
    if (event.shiftKey) {
      this.emit(DROPZONE_EVENTS.SELECTED, this, true);
      return;
    }

    this.emit(DROPZONE_EVENTS.SELECTED, this);
  }

  /**
   * 空セルがペースト基準として選択されていることを示す枠を表示する。
   */
  applySelectionEmphasis(): void {
    this.clearSelectionEmphasis();
    const borderWidth = Spacing.borderWidth.gate.base;
    const borderOffset = borderWidth / 2;
    this.selectionOverlay = new Graphics()
      .roundRect(
        Dropzone.GATE_INSET_OFFSET + borderOffset,
        Dropzone.GATE_INSET_OFFSET + borderOffset,
        this.gateSize - borderWidth,
        this.gateSize - borderWidth,
        OperationComponent.cornerRadius,
      )
      .stroke({ color: 0x5eead4, width: borderWidth });
    this.addChild(this.selectionOverlay);
  }

  /**
   * 空セルの選択枠を消す。
   */
  clearSelectionEmphasis(): void {
    if (this.selectionOverlay === null) {
      return;
    }

    this.removeChild(this.selectionOverlay);
    this.selectionOverlay.destroy();
    this.selectionOverlay = null;
  }

  redrawWires() {
    this.renderer.updateWires({
      inputWireType: this.inputWireType,
      outputWireType: this.outputWireType,
    });
  }

  redrawConnections() {
    this.renderer.updateConnections({
      connectTop: this.connectTop,
      connectBottom: this.connectBottom,
    });
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
}
