import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { ControlGate } from "./control-gate";
import { DropzoneComponent } from "./dropzone-component";
import { GateComponent } from "./gate-component";
import { HGate } from "./h-gate";
import { List } from "@pixi/ui";
import { MeasurementGate } from "./measurement-gate";
import { Operation } from "./operation";
import { RnotGate } from "./rnot-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { SGate } from "./s-gate";
import { SwapGate } from "./swap-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { TGate } from "./t-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { groupBy, spacingInPx } from "./util";
import { Colors } from "./colors";

/**
 * @noInheritDoc
 */
export class CircuitStepComponent extends Container {
  static currentStepMarkerWidth = spacingInPx(1);
  static hoverLineColor = Colors["bg-brand-hover"];
  static activeLineColor = Colors["bg-brand"];

  private _dropzones: List;
  private _state: "idle" | "hover" | "active" = "idle";
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
    return this.dropzones.length;
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
    return this._dropzones.children as DropzoneComponent[];
  }

  /**
   * ステップ内のすべての {@link DropzoneComponent} のうち、ゲートが置かれたものを返す
   */
  get occupiedDropzones() {
    return this.dropzones.filter((each) => {
      return each.isOccupied();
    });
  }

  get freeDropzones() {
    return this.dropzones.filter((each) => {
      return !each.isOccupied();
    });
  }

  private get operations(): Operation[] {
    return this.occupiedDropzones
      .map((each) => each.operation)
      .filter((each): each is NonNullable<Operation> => each !== null);
  }

  dropzoneAt(index: number) {
    return this.dropzones[index];
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
    const dropzone = new DropzoneComponent();
    dropzone.on("snap", this.onDropzoneSnap, this);
    dropzone.on("grabGate", (gate, globalPosition) => {
      this.emit("grabGate", gate, globalPosition);
    });
    this._dropzones.addChild(dropzone);

    if (this._currentStepMarker) {
      this.redrawLine();
    }

    this.updateHitArea();
  }

  protected onDropzoneSnap(dropzone: DropzoneComponent) {
    this.emit("gateSnapToDropzone", this, dropzone);
  }

  /**
   * 末尾の Dropzone を削除する
   */
  deleteLastDropzone() {
    const dropzone = this._dropzones.getChildAt(
      this._dropzones.children.length - 1
    ) as DropzoneComponent;
    this._dropzones.removeChildAt(this._dropzones.children.length - 1);
    dropzone.destroy();

    this.redrawLine();
    this.updateHitArea();
  }

  constructor(qubitCount: number) {
    super();

    this._dropzones = new List({
      type: "vertical",
      elementsMargin: DropzoneComponent.size / 2,
      vertPadding: CircuitStepComponent.paddingY,
    });

    this._dropzones.x = 0;
    this._dropzones.y = 0;
    this.addChild(this._dropzones);
    this._dropzones.eventMode = "static";

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
    const swapDropzones = this.swapGateDropzones;
    const swapBits = swapDropzones.map((each) => this.bit(each));

    if (swapDropzones.length !== 2) {
      for (const dropzone of this.dropzones) {
        const minBit = Math.min(...swapBits);
        const maxBit = Math.max(...swapBits);

        if (minBit <= this.bit(dropzone) && this.bit(dropzone) <= maxBit) {
          dropzone.connectTop = false;
          dropzone.connectBottom = false;
        }
      }
    } else {
      for (const swap of swapDropzones) {
        // TODO: つながっていない Swap ゲートは disabled (灰色表示) にする
        // const swapGate = swap.operation as SwapGate
        // swapGate.enable()
        swap.connectTop = swapDropzones.some(
          (each) => this.bit(each) < this.bit(swap)
        );
        swap.connectBottom = swapDropzones.some(
          (each) => this.bit(each) > this.bit(swap)
        );
      }

      for (const dropzone of this.freeDropzones) {
        const minBit = Math.min(...swapBits);
        const maxBit = Math.max(...swapBits);
        if (minBit < this.bit(dropzone) && this.bit(dropzone) < maxBit) {
          dropzone.connectTop = true;
          dropzone.connectBottom = true;
        }
      }
    }
  }

  updateControlledUConnections(): void {
    const controllableDropzones = this.controllableDropzones();
    const controlDropzones = this.controlGateDropzones();
    const allControlBits = controlDropzones.map((dz) => this.bit(dz));

    // すべての • のうち、有効なゲートのビット配列
    const activeControlBits =
      controlDropzones.length == 0
        ? allControlBits
        : allControlBits.slice(0, controlDropzones.length);
    const controllableBits = controllableDropzones.map((dz) => this.bit(dz));
    const activeOperationBits = activeControlBits.concat(controllableBits);

    // コントロールゲートの上下接続をセット
    controlDropzones.forEach((each) => {
      each.connectBottom = activeOperationBits.some((other) => {
        return this.bit(each) < other;
      });
      each.connectTop = activeOperationBits.some((other) => {
        return this.bit(each) > other;
      });
    });

    // コントロールされるゲートの上下接続をセット
    for (const each of controllableDropzones) {
      if (!(each.operation instanceof XGate)) {
        throw new Error(`${each.operation} isn't controllable.`);
      }

      each.operation.controls = allControlBits;

      each.connectTop = activeOperationBits.some((other) => {
        return other < this.bit(each);
      });
      each.connectBottom = activeOperationBits.some((other) => {
        return other > this.bit(each);
      });
    }
  }

  updateFreeDropzoneConnections(): void {
    const controllableDropzones = this.controllableDropzones();
    const activeControlBits = this.controlGateDropzones().map((each) =>
      this.bit(each)
    );
    const controllableBits = controllableDropzones.map((dz) => this.bit(dz));
    const activeOperationBits = activeControlBits.concat(controllableBits);
    const minBit =
      activeOperationBits.length == 0 ? 0 : Math.min(...activeOperationBits);
    const maxBit =
      activeOperationBits.length == 0 ? 0 : Math.max(...activeOperationBits);

    for (const each of this.freeDropzones) {
      if (minBit < this.bit(each) && this.bit(each) < maxBit) {
        each.connectTop = true;
        each.connectBottom = true;
      } else {
        each.connectTop = false;
        each.connectBottom = false;
      }
    }
  }

  private controllableDropzones(): DropzoneComponent[] {
    return this.occupiedDropzones.filter((each) => {
      if (each.operation instanceof XGate) {
        return true;
      }

      return false;
    });
  }

  private controlGateDropzones(): DropzoneComponent[] {
    return this.occupiedDropzones.filter(
      (each) => each.operation instanceof ControlGate
    );
  }

  private get swapGateDropzones(): DropzoneComponent[] {
    return this.occupiedDropzones.filter(
      (each) => each.operation instanceof SwapGate
    );
  }

  private get componentWidth(): number {
    return GateComponent.sizeInPx.base * 1.5;
  }

  private get componentHeight(): number {
    return (
      GateComponent.sizeInPx.base * this._dropzones.children.length +
      (this._dropzones.children.length - 1) *
        (GateComponent.sizeInPx.base / 2) +
      CircuitStepComponent.paddingY * 2
    );
  }

  isIdle(): boolean {
    return this._state === "idle";
  }

  isHover(): boolean {
    return this._state === "hover";
  }

  isActive(): boolean {
    return this._state === "active";
  }

  serialize() {
    const result: { type: string; targets: number[] }[] = [];

    for (const [klass, sameOps] of groupBy(
      this.operations,
      (op) => op.constructor
    )) {
      switch (klass) {
        case HGate: {
          const hGates = sameOps as HGate[];
          const targetBits = hGates.map((each) => this.indexOf(each));
          const serializedGate = HGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case XGate: {
          const xGates = sameOps as XGate[];
          const targetBits = xGates.map((each) => this.indexOf(each));
          const controlBits = this.controlGateDropzones().map((each) =>
            this.bit(each)
          );
          const serializedGate = XGate.serialize(targetBits, controlBits);

          result.push(serializedGate);
          break;
        }
        case YGate: {
          const yGates = sameOps as YGate[];
          const targetBits = yGates.map((each) => this.indexOf(each));
          const serializedGate = YGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case ZGate: {
          const zGates = sameOps as ZGate[];
          const targetBits = zGates.map((each) => this.indexOf(each));
          const serializedGate = ZGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case RnotGate: {
          const rnotGates = sameOps as RnotGate[];
          const targetBits = rnotGates.map((each) => this.indexOf(each));
          const serializedGate = RnotGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case SGate: {
          const sGates = sameOps as SGate[];
          const targetBits = sGates.map((each) => this.indexOf(each));
          const serializedGate = SGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case SDaggerGate: {
          const sdaggerGates = sameOps as SDaggerGate[];
          const targetBits = sdaggerGates.map((each) => this.indexOf(each));
          const serializedGate = SDaggerGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case TGate: {
          const tGates = sameOps as TGate[];
          const targetBits = tGates.map((each) => this.indexOf(each));
          const serializedGate = TGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case TDaggerGate: {
          const tdaggerGates = sameOps as TGate[];
          const targetBits = tdaggerGates.map((each) => this.indexOf(each));
          const serializedGate = TDaggerGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case Write0Gate: {
          const write0Gates = sameOps as Write0Gate[];
          const targetBits = write0Gates.map((each) => this.indexOf(each));
          const serializedGate = Write0Gate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case Write1Gate: {
          const write1Gates = sameOps as Write1Gate[];
          const targetBits = write1Gates.map((each) => this.indexOf(each));
          const serializedGate = Write1Gate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case SwapGate: {
          const swapGates = sameOps as SwapGate[];
          const targetBits = swapGates.map((each) => this.indexOf(each));
          const serializedGate = SwapGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case ControlGate: {
          // もし同じステップに X ゲートがある場合、X ゲート側でシリアライズするのでここでは何もしない
          if (this.operations.some((op) => op instanceof XGate)) {
            break;
          }

          const controlGates = sameOps as ControlGate[];
          const targetBits = controlGates.map((each) => this.indexOf(each));
          const serializedGate = ControlGate.serialize(targetBits);

          result.push(serializedGate);
          break;
        }
        case MeasurementGate: {
          const measurementGates = sameOps as MeasurementGate[];

          const targetBits = measurementGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "Measure", targets: targetBits };

          result.push(serializedGate);
          break;
        }
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

    this._state = "active";
    this.redrawLine();
    this.emit("circuit-step.activated", this);
  }

  deactivate() {
    this._state = "idle";

    this.hideCurrentStepMarker();
  }

  protected onPointerOver() {
    if (this.isIdle()) {
      this.emit("circuit-step.hover", this);
      this._state = "hover";
      this.redrawLine();
    }
  }

  protected onPointerOut() {
    if (this.isHover()) {
      this._state = "idle";

      this.hideCurrentStepMarker();
    }
  }

  protected onPointerDown() {
    if (!this.isActive()) {
      this.activate();
    }
  }

  protected redrawLine() {
    if (this.isHover()) {
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
