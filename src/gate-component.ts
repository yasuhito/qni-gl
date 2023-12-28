import * as PIXI from "pixi.js";
import { ActorRefFrom, createMachine, interpret } from "xstate";
import { Container } from "pixi.js";
import { DropzoneComponent } from "./dropzone-component";
import { GateSourceComponent } from "./gate-source-component";
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

  static radius = 4;

  /** ゲートのアイコン。HGate などゲートの種類ごとにサブクラスを定義してセットする */
  static icon = PIXI.Texture.from("./assets/Placeholder.svg");

  debug = false;

  protected _shape: PIXI.Graphics;
  protected _sprite: PIXI.Sprite;

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
            this.position.set(GateComponent.size / 4, 0);
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
  private actor: ActorRefFrom<typeof this.stateMachine>;

  /**
   * Returns the gate type of the component.
   * If the gate type is not defined, it throws an error.
   */
  gateType(): string {
    const klass = this.constructor as typeof GateComponent;

    if (typeof klass.gateType === "string") {
      return klass.gateType;
    }

    throw new Error("Gate type is not defined");
  }

  get gateSource(): GateSourceComponent | null {
    if (this.parent instanceof GateSourceComponent) {
      return this.parent;
    }

    return null;
  }

  get dropzone(): DropzoneComponent | null {
    if (this.parent instanceof DropzoneComponent) {
      return this.parent;
    }

    return null;
  }

  constructor() {
    super();

    const klass = this.constructor as typeof GateComponent;

    this._shape = new PIXI.Graphics();
    this.addChild(this._shape);

    // enable the gate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.eventMode = "static";

    // Scale mode for pixelation
    klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._sprite = new PIXI.Sprite(klass.icon);
    this.addChild(this._sprite);

    // setup events for mouse + touch using
    // the pointer events
    this.on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this)
      .on("pointerup", this.onPointerUp, this);

    // this.on("pointerenter", () => {
    //   console.log("!!! pointer enter !!!");
    // });

    this.actor = interpret(this.stateMachine)
      .onTransition((state) => {
        if (this.debug) {
          console.log(`${this.gateType()}: ${state.value} state`);
        }
      })
      .start();
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
    this.emit("snap", this, dropzone);
  }

  unsnap() {
    if (this.dropzone === null) {
      throw new Error("Cannot unsnap a gate that is not snapped");
    }

    this.dropzone.unsnap();
  }

  protected mouseLeave() {
    // console.log("🐭 mouse leave");
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
    // console.dir("!!!! pointer over !!!!");

    this.actor.send("Mouse enter");
    this.cursor = "grab";
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
