import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Dropzone, Operation } from "./dropzone";
import { Gate } from "./gate";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";
import { spacingInPx } from "./util";
import { HGate } from "./h-gate";

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
export class CircuitStep extends Container {
  static lineWidth = spacingInPx(1);
  static hoverLineColor = tailwindColors.purple["300"];
  static activeLineColor = tailwindColors.blue["500"];

  _qubitCount: number; // 量子ビットの数

  onHover: Signal<(circuitStep: CircuitStep) => void>;
  onActivate: Signal<(circuitStep: CircuitStep) => void>;

  protected _view: Container;
  protected _dropzones: List;
  protected _state: "idle" | "hover" | "active" = "idle";
  protected _line: PIXI.Graphics;

  static get gapBetweenGates(): number {
    return Dropzone.size / 2;
  }

  static get paddingX(): number {
    return Dropzone.size;
  }

  static get paddingY(): number {
    return Dropzone.size;
  }

  /**
   * ステップ内のすべての {@link Dropzone} を返す
   */
  get dropzones(): Dropzone[] {
    return this._dropzones.children as Dropzone[];
  }

  /**
   * ステップ内のすべての {@link Dropzone} のうち、ゲートが置かれたものを返す
   */
  get occupiedDropzones() {
    return this.dropzones.filter((each) => {
      return each.isOccupied();
    });
  }

  private get operations(): Operation[] {
    return this.occupiedDropzones
      .map((each) => each.operation)
      .filter((each): each is NonNullable<Operation> => each !== null);
  }

  hasGateAt(qubitIndex: number) {
    return this.dropzones[qubitIndex].isOccupied();
  }

  maybeIncrementQubitCount() {
    // TODO: qubitCount は Dropzone の数と同じなので、変数を用意するのでなく Dropzone の数をそのつど数える
    // TODO: もし量子ビット数が上限に達していれば Dropzone を追加しない
    // TODO: 新しい量子ビット数を返す
    this._qubitCount++;
    this.addDropzone();
    if (this.isHover()) {
      this.drawHoverLine();
    } else if (this.isActive()) {
      this.drawActiveLine();
    }
  }

  decrementQubitCount() {
    const dropzone = this._dropzones.getChildAt(
      this._dropzones.children.length - 1
    ) as Dropzone;
    this._dropzones.removeChildAt(this._dropzones.children.length - 1);
    dropzone.destroy();

    this._qubitCount--;
    this._line.clear();
    if (this.isHover()) {
      this.drawHoverLine();
    } else if (this.isActive()) {
      this.drawActiveLine();
    }
  }

  addDropzone() {
    const dropzone = new Dropzone();
    this._dropzones.addChild(dropzone);
  }

  constructor(qubitCount: number) {
    super();

    this.onHover = new Signal();
    this.onActivate = new Signal();

    this._qubitCount = qubitCount;
    this._view = new PIXI.Container();
    this.addChild(this._view);

    this._dropzones = new List({
      type: "vertical",
      elementsMargin: Dropzone.size / 2,
      vertPadding: CircuitStep.paddingY,
    });
    this._view.addChild(this._dropzones);
    this._dropzones.eventMode = "static";

    for (let i = 0; i < this._qubitCount; i++) {
      // const dropzone = new Dropzone();
      // this._dropzones.addChild(dropzone);
      this.addDropzone();
    }

    // setup events for mouse + touch using
    // the pointer events
    this._view
      .on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this);

    // enable the step to be interactive...
    // this will allow it to respond to mouse and touch events
    this._view.eventMode = "static";
    this._view.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);

    this._line = new PIXI.Graphics();
    this._view.addChild(this._line);
  }

  get width(): number {
    return Gate.size * 1.5;
  }

  get height(): number {
    return (
      Gate.size * this._dropzones.children.length +
      (this._dropzones.children.length - 1) * (Gate.size / 2) +
      CircuitStep.paddingY * 2
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
    const result = [];

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
      }
    }

    return result;
  }

  indexOf(operation: Operation) {
    for (let i = 0; i < this.dropzones.length; i++) {
      const dropzone = this.dropzones[i];
      if (dropzone.operation === operation) {
        return i;
      }
    }

    // ???: -1 ではなく例外を投げる?
    return -1;
  }

  toJSON() {
    return {
      dropzones: this.dropzones,
    };
  }

  toCircuitJSON() {
    const jsons = this.dropzones.map((each) => each.toCircuitJSON());
    return `[${jsons.join(",")}]`;
  }

  activate() {
    this._state = "active";
    this.drawActiveLine();
    this.onActivate.emit(this);
  }

  deactivate() {
    this._state = "idle";
    this._line.clear();
  }

  protected onPointerOver(_event: PIXI.FederatedEvent) {
    if (this.isIdle()) {
      this.onHover.emit(this);

      this._state = "hover";
      this.drawHoverLine();
    }
  }

  protected onPointerOut(_event: PIXI.FederatedEvent) {
    if (this.isHover()) {
      this._state = "idle";

      this._line.clear();
    }
  }

  protected onPointerDown(_event: PIXI.FederatedEvent) {
    if (!this.isActive()) {
      this.activate();
    }
  }

  protected drawHoverLine() {
    this.drawLine(CircuitStep.hoverLineColor);
  }

  protected drawActiveLine() {
    this.drawLine(CircuitStep.activeLineColor);
  }

  protected drawLine(color: PIXI.ColorSource) {
    this._line.beginFill(color, 1);
    this._line.drawRect(
      this.width - CircuitStep.lineWidth,
      0,
      CircuitStep.lineWidth,
      this.height
    );
    this._line.endFill();
  }
}
