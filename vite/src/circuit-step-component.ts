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
import { spacingInPx } from "./util";
import { Colors } from "./colors";

const groupBy = <K, V>(
  array: readonly V[],
  getKey: (current: V, index: number, orig: readonly V[]) => K
): Array<[K, V[]]> =>
  Array.from(
    array.reduce((map, current, index, orig) => {
      const key = getKey(current, index, orig);
      const list = map.get(key);
      if (list) {
        list.push(current);
      } else {
        map.set(key, [current]);
      }
      return map;
    }, new Map<K, V[]>())
  );

/**
 * @noInheritDoc
 */
export class CircuitStepComponent extends Container {
  static lineWidth = spacingInPx(1);
  static hoverLineColor = Colors["bg-brand-hover"];
  static activeLineColor = Colors["bg-brand"];

  private _dropzones: List;
  private _state: "idle" | "hover" | "active" = "idle";
  private _line: PIXI.Graphics;

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

    if (this._line) {
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

    this._line = new PIXI.Graphics();
    this.addChild(this._line);
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

    if (swapDropzones.length !== 2) {
      //   for (const each of swapDropzones) {
      //     const swapGate = each.operation as SwapGateElement
      //     swapGate.disable()
      //   }
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

      const swapBits = swapDropzones.map((each) => this.bit(each));
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
          const serializedGate = { type: "H", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case XGate: {
          const xGates = sameOps as XGate[];

          const targetBits = xGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "X", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case YGate: {
          const yGates = sameOps as YGate[];

          const targetBits = yGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "Y", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case ZGate: {
          const zGates = sameOps as ZGate[];

          const targetBits = zGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "Z", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case RnotGate: {
          const rnotGates = sameOps as RnotGate[];

          const targetBits = rnotGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "X^½", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case SGate: {
          const sGates = sameOps as SGate[];

          const targetBits = sGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "S", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case SDaggerGate: {
          const sdaggerGates = sameOps as SDaggerGate[];

          const targetBits = sdaggerGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "S†", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case TGate: {
          const tGates = sameOps as TGate[];

          const targetBits = tGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "T", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case TDaggerGate: {
          const tdaggerGates = sameOps as TGate[];

          const targetBits = tdaggerGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "T†", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case Write0Gate: {
          const write0Gates = sameOps as Write0Gate[];

          const targetBits = write0Gates.map((each) => this.indexOf(each));
          const serializedGate = { type: "|0>", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case Write1Gate: {
          const write1Gates = sameOps as Write1Gate[];

          const targetBits = write1Gates.map((each) => this.indexOf(each));
          const serializedGate = { type: "|1>", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case SwapGate: {
          const swapGates = sameOps as SwapGate[];

          const targetBits = swapGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "Swap", targets: targetBits };

          result.push(serializedGate);
          break;
        }
        case ControlGate: {
          const controlGates = sameOps as ControlGate[];

          const targetBits = controlGates.map((each) => this.indexOf(each));
          const serializedGate = { type: "•", targets: targetBits };

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
    this.emit("activated", this);
  }

  deactivate() {
    this._state = "idle";
    this._line.clear();
  }

  protected onPointerOver() {
    if (this.isIdle()) {
      this.emit("hover", this);
      this._state = "hover";
      this.redrawLine();
    }
  }

  protected onPointerOut() {
    if (this.isHover()) {
      this._state = "idle";

      this._line.clear();
    }
  }

  protected onPointerDown() {
    if (!this.isActive()) {
      this.activate();
    }
  }

  protected redrawLine() {
    this._line.clear();

    if (this.isHover()) {
      this.drawHoverLine();
    } else if (this.isActive()) {
      this.drawActiveLine();
    }
  }

  protected drawHoverLine() {
    this.drawLine(CircuitStepComponent.hoverLineColor);
  }

  protected drawActiveLine() {
    this.drawLine(CircuitStepComponent.activeLineColor);
  }

  protected drawLine(color: PIXI.ColorSource) {
    this._line.beginFill(color, 1);
    this._line.drawRect(
      this.componentWidth - CircuitStepComponent.lineWidth / 2,
      0,
      CircuitStepComponent.lineWidth,
      this.componentHeight
    );
    this._line.endFill();
  }
}
