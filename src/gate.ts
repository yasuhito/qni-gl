import * as PIXI from "pixi.js";
import { ActorRefFrom, createMachine, interpret } from "xstate";
import { Container } from "pixi.js";
import { Dropzone } from "../dropzone";
import { Runner } from "@pixi/runner";
import { Signal } from "typed-signals";
import { spacingInPx } from "./util";

type ClickEvent = {
  type: "Click";
  globalPosition: PIXI.Point;
  dropzone: Dropzone | null;
};
type DragEvent = {
  type: "Drag";
  globalPosition: PIXI.Point;
  dropzone: Dropzone | null;
};

export class Gate extends Container {
  /**
   * ゲートの幅と高さ (ピクセル)
   *
   * @todo サイズごと (xl, lg, base, sm, xs) に定義する
   */
  static size = spacingInPx(8);

  /**
   * ゲートのアイコン。HGate などゲートの種類ごとにサブクラスを定義してセットする。
   */
  static icon = PIXI.Texture.from("./assets/Placeholder.svg");

  _dropzone: Dropzone | null = null;
  view: Container;
  protected _shape: PIXI.Graphics;
  sprite: PIXI.Sprite;

  onGrab: Signal<(newGate: Gate, globalPosition: PIXI.Point) => void>;
  onMouseLeave: Signal<(gate: Gate) => void>;

  snapDropzoneRunner: Runner;

  stateMachine = createMachine(
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
            const x = event.dropzone.x;
            const y = event.dropzone.y;
            this.view.position.set(x - Gate.size / 2, y - Gate.size / 2);
          } else {
            const newPoint = this.view.parent.toLocal(event.globalPosition);
            this.view.position.set(
              newPoint.x - Gate.size / 2,
              newPoint.y - Gate.size / 2
            );
          }
        },
      },
    }
  );
  actor: ActorRefFrom<typeof this.stateMachine>;

  get cornerRadius(): number {
    return 4;
  }

  set dropzone(value: Dropzone | null) {
    this._dropzone = value;
    this.snapDropzoneRunner.emit(this);
  }

  get dropzone(): Dropzone | null {
    return this._dropzone;
  }

  constructor() {
    super();

    this.onMouseLeave = new Signal();
    this.onGrab = new Signal();

    const klass = this.constructor as typeof Gate;

    this.snapDropzoneRunner = new Runner("snapDropzone");

    this.view = new Container();
    // this.graphics.x = Gate.size / 2;
    // this.graphics.y = Gate.size / 2;
    this.addChild(this.view);

    this._shape = new PIXI.Graphics();
    this.view.addChild(this._shape);

    // enable the hGate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.view.eventMode = "static";

    // Scale mode for pixelation
    klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this.sprite = new PIXI.Sprite(klass.icon);
    this.view.addChild(this.sprite);

    // setup events for mouse + touch using
    // the pointer events
    this.view
      .on("pointerover", this.onPointerOver.bind(this), this.view)
      .on("pointerout", this.onPointerOut.bind(this), this.view)
      .on("pointerdown", this.onPointerDown.bind(this), this.view);

    this.actor = interpret(this.stateMachine).start();

    // Fires whenever the state changes
    const { unsubscribe } = this.actor.subscribe((state) => {
      // console.log(`🌟 ${state.event.type}`);
      // console.log(state.value);
    });
  }

  click(globalPosition: PIXI.Point, dropzone: Dropzone | null) {
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

  snapToDropzone(dropzone: Dropzone, globalPosition: PIXI.Point) {
    if (this.dropzone && this.dropzone !== dropzone) {
      this.unsnap();
    }

    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  snap(dropzone: Dropzone) {
    dropzone.snap(this);
  }

  unsnap() {
    if (this.dropzone === null) {
      throw new Error("Cannot unsnap a gate that is not snapped");
    }

    this.dropzone.unsnap(this);
  }

  protected mouseLeave() {
    this.actor.send("Mouse leave");
  }

  applyIdleStyle() {}

  applyHoverStyle() {}

  applyGrabbedStyle() {}

  applyActiveStyle() {}

  toJSON() {
    return {
      x: this.view.x,
      y: this.view.y,
      width: this.width,
      height: this.height,
    };
  }

  private onPointerOver(_event: PIXI.FederatedEvent) {
    this.actor.send("Mouse enter");
    this.view.cursor = "grab";
  }

  private onPointerOut() {
    this.mouseLeave();
    this.onMouseLeave.emit(this);
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    this.onGrab.emit(this, event.global);
  }
}
