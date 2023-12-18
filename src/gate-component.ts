import * as PIXI from "pixi.js";
import { ActorRefFrom, createMachine, interpret } from "xstate";
import { Container } from "pixi.js";
import { DropzoneComponent } from "./dropzone-component";
import { Runner } from "@pixi/runner";
import { spacingInPx } from "./util";

/**
 * ゲートのクリックイベント
 */
export type ClickEvent = {
  type: "Click";
  globalPosition: PIXI.Point;
  dropzone: DropzoneComponent | null;
};

/**
 * ゲートのドラッグイベント
 */
export type DragEvent = {
  type: "Drag";
  globalPosition: PIXI.Point;
  dropzone: DropzoneComponent | null;
};

/**
 * @noInheritDoc
 */
export class GateComponent extends Container {
  static gateType: string;

  /**
   * ゲートの幅と高さ (ピクセル)
   *
   * @todo サイズごと (xl, lg, base, sm, xs) に定義する
   */
  static size = spacingInPx(8);

  /** ゲートのアイコン。HGate などゲートの種類ごとにサブクラスを定義してセットする */
  static icon = PIXI.Texture.from("./assets/Placeholder.svg");

  /** すべての内部要素を保持するコンテナ */
  view: Container;

  protected _shape: PIXI.Graphics;
  protected _dropzone: DropzoneComponent | null = null;
  protected _sprite: PIXI.Sprite;

  /** @todo 消す */
  snapDropzoneRunner: Runner;

  protected stateMachine = createMachine(
    {
      id: "draggable",
      predictableActionArguments: true,
      initial: "Idle",
      states: {
        Idle: {
          entry: "applyIdleStyle",
          on: {
            "Mouse enter": {
              target: "Hover",
            },
          },
        },
        Hover: {
          entry: "applyHoverStyle",
          on: {
            Click: {
              target: "Grabbed",
            },
            "Mouse leave": {
              target: "Idle",
            },
          },
        },
        Grabbed: {
          entry: ["applyGrabbedStyle", "updatePosition"],
          on: {
            "Mouse up": {
              target: "Active",
            },
            Drag: {
              target: "Dragging",
            },
          },
        },
        Dragging: {
          entry: ["updatePosition"],
          on: {
            Drag: {
              target: "Dragging",
            },
            "Mouse up": {
              target: "Active",
            },
          },
        },
        Active: {
          entry: "applyActiveStyle",
          on: {
            Click: {
              target: "Grabbed",
            },
            Deactivate: {
              target: "Idle",
            },
          },
        },
      },
      schema: {
        events: {} as
          | { type: "Mouse enter" }
          | { type: "Mouse leave" }
          | ClickEvent
          | { type: "Deactivate" }
          | { type: "Mouse up" }
          | DragEvent,
      },
    },
    {
      actions: {
        applyIdleStyle: () => {
          this.applyIdleStyle();
        },
        applyHoverStyle: () => {
          this.applyHoverStyle();
        },
        applyGrabbedStyle: () => {
          this.applyGrabbedStyle();
        },
        applyActiveStyle: () => {
          this.applyActiveStyle();
        },
        updatePosition: (_context, event: ClickEvent | DragEvent) => {
          if (event.dropzone) {
            // snap した場合
            const pos = this.parent.toLocal(event.dropzone.getGlobalPosition());
            this.position.set(pos.x + GateComponent.size / 4, pos.y);
          } else {
            const newPos = this.parent.toLocal(event.globalPosition);
            this.position.set(
              newPos.x - GateComponent.size / 2,
              newPos.y - GateComponent.size / 2
            );
          }
        },
      },
    }
  );
  actor: ActorRefFrom<typeof this.stateMachine>;

  set dropzone(value: DropzoneComponent | null) {
    this._dropzone = value;
    this.snapDropzoneRunner.emit(this);
  }

  get dropzone(): DropzoneComponent | null {
    return this._dropzone;
  }

  constructor() {
    super();

    const klass = this.constructor as typeof GateComponent;

    this.snapDropzoneRunner = new Runner("snapDropzone");

    this.view = new Container();
    this.addChild(this.view);

    this._shape = new PIXI.Graphics();
    this.view.addChild(this._shape);

    // enable the gate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.view.eventMode = "static";

    // Scale mode for pixelation
    klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._sprite = new PIXI.Sprite(klass.icon);
    this.view.addChild(this._sprite);

    // setup events for mouse + touch using
    // the pointer events
    this.view
      .on("pointerover", this.onPointerOver.bind(this), this.view)
      .on("pointerout", this.onPointerOut.bind(this), this.view)
      .on("pointerdown", this.onPointerDown.bind(this), this.view)
      .on("pointerup", this.onPointerUp.bind(this), this.view);

    this.actor = interpret(this.stateMachine).start();
  }

  gateType(): string | null {
    const klass = this.constructor as typeof GateComponent;

    if (typeof klass.gateType === "string") {
      return klass.gateType;
    } else {
      return null;
    }
  }

  click(globalPosition: PIXI.Point, dropzone: DropzoneComponent | null) {
    this.actor.send({
      type: "Click",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  mouseUp() {
    this.actor.send("Mouse up");
  }

  deactivate() {
    this.actor.send("Deactivate");
  }

  move(globalPosition: PIXI.Point) {
    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: null,
    });
  }

  snapToDropzone(dropzone: DropzoneComponent, globalPosition: PIXI.Point) {
    if (this.dropzone && this.dropzone !== dropzone) {
      this.unsnap();
    }

    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  snap(dropzone: DropzoneComponent) {
    dropzone.snap(this);
  }

  unsnap() {
    if (this.dropzone === null) {
      throw new Error("Cannot unsnap a gate that is not snapped");
    }

    this.dropzone.unsnap();
  }

  protected mouseLeave() {
    this.actor.send("Mouse leave");
  }

  applyIdleStyle() {}

  applyHoverStyle() {}

  applyGrabbedStyle() {}

  applyActiveStyle() {}

  toJSON() {
    const pos = this.getGlobalPosition();

    return {
      x: pos.x,
      y: pos.y,
      width: this.width,
      height: this.height,
    };
  }

  private onPointerOver() {
    this.actor.send("Mouse enter");
    this.view.cursor = "grab";
  }

  private onPointerOut() {
    this.mouseLeave();
    this.emit("mouseLeave", this);
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    this.emit("grab", this, event.global);
  }

  private onPointerUp() {
    if (this.dropzone) {
      return;
    }

    this.emit("discarded", this);
    this.destroy();
  }
}
