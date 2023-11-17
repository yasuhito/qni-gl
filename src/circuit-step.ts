import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Dropzone } from "./dropzone";
import { Gate } from "./gate";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";
import { spacingInPx } from "./util";

/**
 * @noInheritDoc
 */
export class CircuitStep extends Container {
  static lineWidth = spacingInPx(1);
  static hoverLineColor = tailwindColors.purple["300"];
  static activeLineColor = tailwindColors.blue["500"];

  qubitCount: number; // 量子ビットの数

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

  get dropzones(): Dropzone[] {
    return this._dropzones.children as Dropzone[];
  }

  constructor(qubitCount: number) {
    super();

    this.onHover = new Signal();
    this.onActivate = new Signal();

    this.qubitCount = qubitCount;
    this._view = new PIXI.Container();
    this.addChild(this._view);

    this._dropzones = new List({
      type: "vertical",
      elementsMargin: Dropzone.size / 2,
      vertPadding: CircuitStep.paddingY,
    });
    this._view.addChild(this._dropzones);
    this._dropzones.eventMode = "static";

    for (let i = 0; i < this.qubitCount; i++) {
      const dropzone = new Dropzone();
      this._dropzones.addChild(dropzone);
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

  toJSON() {
    return {
      dropzones: this.dropzones,
    };
  }

  activate() {
    this._state = "active"
    this.drawLine(CircuitStep.activeLineColor);
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
      this.drawLine(CircuitStep.hoverLineColor);
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
      this.activate()
    }
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
