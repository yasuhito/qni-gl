import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { ControlGate } from "./control-gate";
import { DropzoneComponent } from "./dropzone-component";
import { Operation } from "./operation";
import { SwapGate } from "./swap-gate";
import { XGate } from "./x-gate";
import { groupBy, spacingInPx } from "./util";
import { Colors } from "./colors";
import { CIRCUIT_STEP_EVENTS, DROPZONE_EVENTS } from "./events";
import { CircuitStepState } from "./circuit-step-state";
import { CircuitStepDropzones } from "./circuit-step-dropzones";

/**
 * @noInheritDoc
 */
export class CircuitStepComponent extends Container {
  static currentStepMarkerWidth = spacingInPx(1);
  static hoverLineColor = Colors["bg-brand-hover"];
  static activeLineColor = Colors["bg-brand"];

  private _dropzones: CircuitStepDropzones;
  private _state: CircuitStepState;
  private _currentStepMarker: PIXI.Graphics;

  static get gapBetweenGates(): number {
    return DropzoneComponent.size / 2;
  }

  static get paddingX(): number {
    return DropzoneComponent.size;
  }

  static get paddingY(): number {
    return DropzoneComponent.size;
  }

  /**
   * ステップ内のワイヤ数 (ビット数) を返す
   */
  get wireCount() {
    return this._dropzones.length;
  }

  get isEmpty(): boolean {
    return this.dropzones.every((each) => each.operation === null);
  }

  /**
   * Gets the qubit count in use.
   * If no gate is placed in any {@link DropzoneComponent}, returns 0.
   */
  get qubitCountInUse() {
    let count = 0;

    this.dropzones.forEach((each, dropzoneIndex) => {
      if (each.isOccupied()) {
        count = dropzoneIndex + 1;
      }
    });

    return count;
  }

  /**
   * ステップ内のすべての {@link DropzoneComponent} を返す
   */
  get dropzones(): DropzoneComponent[] {
    return this._dropzones.all;
  }

  /**
   * ステップ内のすべての {@link DropzoneComponent} のうち、ゲートが置かれたものを返す
   */
  private get occupiedDropzones() {
    return this._dropzones.occupied;
  }

  private get operations(): Operation[] {
    return this.occupiedDropzones
      .map((each) => each.operation)
      .filter((each): each is NonNullable<Operation> => each !== null);
  }

  dropzoneAt(index: number) {
    return this._dropzones.at(index);
  }

  /**
   * 指定した量子ビットにゲートが置かれているかどうかを返す
   */
  hasGateAt(qubitIndex: number) {
    return this.dropzoneAt(qubitIndex).isOccupied();
  }

  /**
   * Dropzone を末尾に追加する
   */
  appendNewDropzone() {
    const dropzone = this._dropzones.append();
    dropzone.on(DROPZONE_EVENTS.GATE_SNAPPED, this.onDropzoneSnap, this);
    dropzone.on(DROPZONE_EVENTS.GATE_GRABBED, (gate, globalPosition) => {
      this.emit(CIRCUIT_STEP_EVENTS.GATE_GRABBED, gate, globalPosition);
    });

    if (this._currentStepMarker) {
      this.redrawLine();
    }

    this.updateHitArea();
  }

  protected onDropzoneSnap(dropzone: DropzoneComponent) {
    this.emit(CIRCUIT_STEP_EVENTS.GATE_SNAPPED, this, dropzone);
  }

  /**
   * 末尾の Dropzone を削除する
   */
  deleteLastDropzone() {
    this._dropzones.deleteLast();
    this.redrawLine();
    this.updateHitArea();
  }

  constructor(qubitCount: number) {
    super();

    this._state = new CircuitStepState();

    this._dropzones = new CircuitStepDropzones();

    this.addChild(this._dropzones.container);

    for (let i = 0; i < qubitCount; i++) {
      this.appendNewDropzone();
    }

    this.on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);

    // enable the step to be interactive...
    // this will allow it to respond to mouse and touch events
    this.eventMode = "static";

    this.updateHitArea();

    this._currentStepMarker = new PIXI.Graphics();
    this.drawCurrentStepMarker(0x000000, 0);
    this.addChild(this._currentStepMarker);
  }

  updateHitArea() {
    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.componentWidth,
      this.componentHeight
    );
  }

  bit(dropzone: DropzoneComponent): number {
    const bit = this.dropzones.indexOf(dropzone);
    // Util.need(bit !== -1, 'circuit-dropzone not found.')

    return bit;
  }

  updateSwapConnections(): void {
    const swapDropzones = this._dropzones.filterByOperationType(SwapGate);
    const swapBits = swapDropzones.map((each) => this.bit(each));

    if (swapDropzones.length !== 2) {
      for (const dropzone of this.dropzones) {
        dropzone.swapConnectTop = false;
        dropzone.swapConnectBottom = false;
      }
    } else {
      const [minBit, maxBit] = [Math.min(...swapBits), Math.max(...swapBits)];

      for (const dropzone of this.dropzones) {
        const bit = this.bit(dropzone);
        dropzone.swapConnectTop = bit > minBit && bit <= maxBit;
        dropzone.swapConnectBottom = bit >= minBit && bit < maxBit;
      }
    }

    this.updateConnections();
  }

  updateControlledUConnections(): void {
    const controllableDropzones = this.controllableDropzones();
    const controlDropzones = this._dropzones.filterByOperationType(ControlGate);
    const allControlBits = controlDropzones.map((dz) => this.bit(dz));

    const activeControlBits = allControlBits.slice(0, controlDropzones.length);
    const controllableBits = controllableDropzones.map((dz) => this.bit(dz));
    const activeOperationBits = activeControlBits.concat(controllableBits);

    if (activeOperationBits.length > 0) {
      const [minBit, maxBit] = [
        Math.min(...activeOperationBits),
        Math.max(...activeOperationBits),
      ];

      for (const dropzone of this.dropzones) {
        const bit = this.bit(dropzone);
        dropzone.controlConnectTop = bit > minBit && bit <= maxBit;
        dropzone.controlConnectBottom = bit >= minBit && bit < maxBit;
      }

      // Set controls for XGates
      for (const each of controllableDropzones) {
        if (each.operation instanceof XGate) {
          each.operation.controls = allControlBits;
        }
      }
    } else {
      for (const dropzone of this.dropzones) {
        dropzone.controlConnectTop = false;
        dropzone.controlConnectBottom = false;
      }
    }

    this.updateConnections();
  }

  private updateConnections(): void {
    for (const dropzone of this.dropzones) {
      dropzone.connectTop =
        dropzone.swapConnectTop || dropzone.controlConnectTop;
      dropzone.connectBottom =
        dropzone.swapConnectBottom || dropzone.controlConnectBottom;
    }
  }

  private controllableDropzones(): DropzoneComponent[] {
    return this._dropzones.filterByOperationType(XGate);
  }

  private get componentWidth(): number {
    return this._dropzones.width;
  }

  private get componentHeight(): number {
    return this._dropzones.height;
  }

  isActive(): boolean {
    return this._state.isActive();
  }

  serialize() {
    const result: { type: string; targets: number[]; controls?: number[] }[] =
      [];
    const controlBits = this._dropzones
      .filterByOperationType(ControlGate)
      .map((each) => this.bit(each));

    for (const [GateClass, sameOps] of groupBy(
      this.operations,
      (op) => op.constructor
    )) {
      if (
        GateClass === ControlGate &&
        this.operations.some((op) => op instanceof XGate)
      ) {
        continue; // X ゲートがある場合は ControlGate をスキップ
      }

      const gates = sameOps as Operation[];
      const targetBits = gates.map((each) => this.indexOf(each));
      const gateInstance = gates[0];

      if (
        "serialize" in GateClass &&
        typeof GateClass["serialize"] === "function"
      ) {
        const serializeMethod = GateClass["serialize"];
        const serializedGate =
          gateInstance instanceof XGate
            ? serializeMethod(targetBits, controlBits)
            : serializeMethod(targetBits);
        result.push(serializedGate);
      } else {
        console.warn(
          `Serialization method not found for gate type: ${gateInstance.constructor.name}`
        );
      }
    }

    return result;
  }

  indexOf(operation: Operation) {
    for (let i = 0; i < this.dropzones.length; i++) {
      if (this.dropzoneAt(i).operation === operation) {
        return i;
      }
    }

    // ???: -1 ではなく例外を投げる?
    return -1;
  }

  toJSON() {
    const pos = this.getGlobalPosition();

    return {
      x: pos.x + this.width / 2,
      y: pos.y + this.height / 2,
      dropzones: this.dropzones,
    };
  }

  toCircuitJSON() {
    const jsons = this.dropzones.map((each) => each.toCircuitJSON());
    return `[${jsons.join(",")}]`;
  }

  activate() {
    if (this.isActive()) {
      return;
    }

    this._state.setActive();
    this.redrawLine();
    this.emit(CIRCUIT_STEP_EVENTS.ACTIVATED, this);
  }

  deactivate() {
    this._state.setIdle();

    this.hideCurrentStepMarker();
  }

  protected onPointerOver() {
    if (this._state.isIdle()) {
      this.emit(CIRCUIT_STEP_EVENTS.HOVERED, this);
      this._state.setHover();
      this.redrawLine();
    }
  }

  protected onPointerOut() {
    if (this._state.isHover()) {
      this._state.setIdle();

      this.hideCurrentStepMarker();
    }
  }

  protected onPointerDown() {
    if (!this.isActive()) {
      this.activate();
    }
  }

  protected redrawLine() {
    if (this._state.isHover()) {
      this.showCurrentStepMarker();
      this.drawHoverLine();
    } else if (this.isActive()) {
      this.showCurrentStepMarker();
      this.drawActiveLine();
    }
  }

  protected showCurrentStepMarker() {
    this._currentStepMarker.alpha = 1;
  }

  protected hideCurrentStepMarker() {
    this._currentStepMarker.alpha = 0;
  }

  protected drawCurrentStepMarker(color: PIXI.ColorSource, alpha = 1) {
    this._currentStepMarker.clear();

    this._currentStepMarker.beginFill(color);
    this._currentStepMarker.drawRect(
      this.componentWidth - CircuitStepComponent.currentStepMarkerWidth / 2,
      0,
      CircuitStepComponent.currentStepMarkerWidth,
      this.componentHeight
    );
    this._currentStepMarker.endFill();

    // this._currentStepMarker.beginFill(color, 0) と最初から alpha = 0 で描画すると、
    // 必要な幅が確保されない。なので endFill() した後であらためて alpha を指定する。
    this._currentStepMarker.alpha = alpha;
  }

  protected drawHoverLine() {
    this.drawCurrentStepMarker(CircuitStepComponent.hoverLineColor);
  }

  protected drawActiveLine() {
    this.drawCurrentStepMarker(CircuitStepComponent.activeLineColor);
  }
}
