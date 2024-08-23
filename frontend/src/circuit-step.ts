import { CIRCUIT_STEP_EVENTS, DROPZONE_EVENTS } from "./events";
import { CircuitStepDropzones } from "./circuit-step-dropzones";
import { CircuitStepState } from "./circuit-step-state";
import { Container, Graphics } from "pixi.js";
import { ControlGate } from "./control-gate";
import { Dropzone } from "./dropzone";
import { Operation } from "./operation";
import { SwapGate } from "./swap-gate";
import { XGate } from "./x-gate";
import { groupBy } from "./util";

export class CircuitStep extends Container {
  static readonly PADDING = Dropzone.sizeInPx / 2;

  private _body: Graphics;
  private _dropzones: CircuitStepDropzones;
  private _state: CircuitStepState;

  /**
   * ステップ内のワイヤ数 (ビット数) を返す
   */
  get wireCount() {
    return this._dropzones.size;
  }

  get isEmpty(): boolean {
    return this.dropzones.every((each) => each.operation === null);
  }

  /**
   * Gets the qubit count in use.
   * If no gate is placed in any {@link Dropzone}, returns 0.
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
   * ステップ内のすべての {@link Dropzone} を返す
   */
  get dropzones(): Dropzone[] {
    return this._dropzones.all;
  }

  /**
   * ステップ内のすべての {@link Dropzone} のうち、ゲートが置かれたものを返す
   */
  private get occupiedDropzones() {
    return this._dropzones.occupied;
  }

  private get operations(): Operation[] {
    return this.occupiedDropzones
      .map((each) => each.operation)
      .filter((each): each is NonNullable<Operation> => each !== null);
  }

  fetchDropzoneByIndex(index: number) {
    return this._dropzones.fetch(index);
  }

  /**
   * 指定した量子ビットにゲートが置かれているかどうかを返す
   */
  hasGateAt(qubitIndex: number) {
    const dropzone = this.fetchDropzoneByIndex(qubitIndex);
    if (!dropzone) {
      throw new Error(`Dropzone not found at index ${qubitIndex}`);
    }
    return dropzone.isOccupied();
  }

  /**
   * Dropzone を末尾に追加する
   */
  appendNewDropzone() {
    const dropzone = this._dropzones.append();

    this.updateSize();

    dropzone.on(DROPZONE_EVENTS.GATE_SNAPPED, this.onDropzoneSnap, this);
    dropzone.on(DROPZONE_EVENTS.GATE_GRABBED, (gate, globalPosition) => {
      this.emit(CIRCUIT_STEP_EVENTS.GATE_GRABBED, gate, globalPosition);
    });
  }

  private onDropzoneSnap(dropzone: Dropzone) {
    this.emit(CIRCUIT_STEP_EVENTS.GATE_SNAPPED, this, dropzone);
  }

  /**
   * 末尾の Dropzone を削除する
   */
  deleteLastDropzone() {
    this._dropzones.removeLast();
    this.updateSize();
  }

  constructor(wireCount: number) {
    super();

    this._body = new Graphics({ alpha: 0 });
    this._state = new CircuitStepState();
    this._dropzones = new CircuitStepDropzones({
      padding: CircuitStep.PADDING,
    });

    this.addChildAt(this._body, 0);
    this.addChildAt(this._dropzones, 1);

    for (let i = 0; i < wireCount; i++) {
      this.appendNewDropzone();
    }

    this.on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);

    this.eventMode = "static";
  }

  bit(dropzone: Dropzone): number {
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

  private updateSize() {
    const height = this._dropzones.height + CircuitStep.PADDING * 2;

    this._body.clear().rect(0, 0, this.width, height).fill(0x0000ff);
    this.removeChild(this._body);
    this.addChildAt(this._body, 0);
  }

  private updateConnections(): void {
    for (const dropzone of this.dropzones) {
      dropzone.connectTop =
        dropzone.swapConnectTop || dropzone.controlConnectTop;
      dropzone.connectBottom =
        dropzone.swapConnectBottom || dropzone.controlConnectBottom;
    }
  }

  private controllableDropzones(): Dropzone[] {
    return this._dropzones.filterByOperationType(XGate);
  }

  isHovered(): boolean {
    return this._state.isHover();
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
      const targetBits = gates.map((each) => this._dropzones.findIndexOf(each));
      const gateInstance = gates[0];
      const serializedGate =
        gateInstance instanceof XGate
          ? gateInstance.serialize(targetBits, controlBits)
          : gateInstance.serialize(targetBits);

      result.push(serializedGate);
    }

    return result;
  }

  toJSON() {
    const jsons = this.dropzones.map((each) => each.toJSON());
    return `[${jsons.join(",")}]`;
  }

  activate() {
    if (this.isActive()) {
      return;
    }

    this._state.setActive();
    this.emit(CIRCUIT_STEP_EVENTS.ACTIVATED, this);
  }

  deactivate() {
    this._state.setIdle();
  }

  private onPointerOver() {
    if (this._state.isIdle()) {
      this._state.setHover();
    }
    this.emit(CIRCUIT_STEP_EVENTS.HOVERED, this);
  }

  private onPointerOut() {
    if (this._state.isHover()) {
      this._state.setIdle();
    }
  }

  private onPointerDown() {
    if (!this.isActive()) {
      this.activate();
    }
  }
}
