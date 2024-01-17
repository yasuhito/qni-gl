import * as PIXI from "pixi.js";
import { ActorRefFrom, createActor, createMachine } from "xstate";
import { Container } from "pixi.js";
import { DropzoneComponent } from "./dropzone-component";
import { GateSourceComponent } from "./gate-source-component";
import { Size } from "./size";
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
   */
  static sizeInPx = {
    xl: spacingInPx(12),
    lg: spacingInPx(10),
    base: spacingInPx(8),
    sm: spacingInPx(6),
    xs: spacingInPx(4),
  };

  static radius = 4;

  /** ゲートのアイコン。HGate などゲートの種類ごとにサブクラスを定義してセットする */
  static icon: PIXI.Texture<PIXI.Resource> | null = null; // PIXI.Texture.from("./assets/Placeholder.svg");

  size: Size = "base";
  sizeInPx = GateComponent.sizeInPx[this.size];

  debug = false;

  protected _shape: PIXI.Graphics;
  protected _sprite: PIXI.Sprite;

  protected stateMachine = createMachine(
    {
      id: "draggable",
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
              reenter: true,
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
      types: {
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
        updatePosition: ({ event }) => {
          const e = event as ClickEvent | DragEvent;

          if (e.dropzone) {
            // snap した場合
            this.position.set(this.sizeInPx / 4, 0);
          } else {
            const newPos = this.parent.toLocal(e.globalPosition);
            this.position.set(
              newPos.x - this.sizeInPx / 2,
              newPos.y - this.sizeInPx / 2
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

    if (klass.icon !== null) {
      // Scale mode for pixelation
      klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      this._sprite = new PIXI.Sprite(klass.icon);
      this.addChild(this._sprite);
    }

    // setup events for mouse + touch using
    // the pointer events
    this.on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this)
      .on("pointerup", this.onPointerUp, this);

    this.actor = createActor(this.stateMachine);
    this.actor.subscribe((state) => {
      if (this.debug) {
        console.log(`${this.gateType()}: ${state.value} state`);
      }
    });
    this.actor.start();
  }

  click(globalPosition: PIXI.Point, dropzone: DropzoneComponent | null) {
    this.actor.send({
      type: "Click",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  mouseUp() {
    this.actor.send({ type: "Mouse up" });
  }

  deactivate() {
    this.actor.send({ type: "Deactivate" });
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
    this.actor.send({ type: "Mouse leave" });
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
    this.actor.send({ type: "Mouse enter" });
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
