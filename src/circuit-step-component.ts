import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { DropzoneComponent } from "./dropzone-component";
import { GateComponent } from "./gate-component";
import { List } from "@pixi/ui";
import { spacingInPx } from "./util";
import { HGate } from "./h-gate";
import { Operation } from "./operation";

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
  static hoverLineColor = tailwindColors.purple["300"];
  static activeLineColor = tailwindColors.blue["500"];

  protected _view: Container;
  protected _dropzones: List;
  protected _state: "idle" | "hover" | "active" = "idle";
  protected _line: PIXI.Graphics;

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
    this._dropzones.addChild(dropzone);

    if (this._line) {
      this.redrawLine();
    }
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
  }

  constructor(qubitCount: number) {
    super();

    this._view = new PIXI.Container();
    this.addChild(this._view);

    this._dropzones = new List({
      type: "vertical",
      elementsMargin: DropzoneComponent.size / 2,
      vertPadding: CircuitStepComponent.paddingY,
    });
    this._view.addChild(this._dropzones);
    this._dropzones.eventMode = "static";

    for (let i = 0; i < qubitCount; i++) {
      this.appendNewDropzone();
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
    return GateComponent.size * 1.5;
  }

  get height(): number {
    return (
      GateComponent.size * this._dropzones.children.length +
      (this._dropzones.children.length - 1) * (GateComponent.size / 2) +
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
      if (this.dropzoneAt(i).operation === operation) {
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
      this.width - CircuitStepComponent.lineWidth,
      0,
      CircuitStepComponent.lineWidth,
      this.height
    );
    this._line.endFill();
  }
}