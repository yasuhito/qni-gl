import * as PIXI from "pixi.js";
import { Runner } from "@pixi/runner";
import { ActorRefFrom, createMachine, interpret } from "xstate";
import { Dropzone } from "./dropzone";

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

export class Gate {
  static gateType = "Gate";
  static size = 32;
  static icon = PIXI.Texture.from("./assets/Placeholder.svg");

  _dropzone: Dropzone | null = null;
  graphics: PIXI.Graphics;
  sprite: PIXI.Sprite;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;
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
            this.graphics.position.set(x - Gate.size / 2, y - Gate.size / 2);
          } else {
            const newPoint = this.graphics.parent.toLocal(event.globalPosition);
            this.graphics.position.set(
              newPoint.x - Gate.size / 2,
              newPoint.y - Gate.size / 2
            );
          }
        },
      },
    }
  );
  actor: ActorRefFrom<typeof this.stateMachine>;

  get x(): number {
    return this.graphics.x + Gate.size / 2;
  }

  get y(): number {
    return this.graphics.y + Gate.size / 2;
  }

  get width(): number {
    const klass = this.constructor as typeof Gate;
    return klass.size;
  }

  get height(): number {
    const klass = this.constructor as typeof Gate;
    return klass.size;
  }

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

  constructor(xCenter: number, yCenter: number) {
    const klass = this.constructor as typeof Gate;

    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");
    this.snapDropzoneRunner = new Runner("snapDropzone");

    this.graphics = new PIXI.Graphics();
    this.graphics.x = xCenter - Gate.size / 2;
    this.graphics.y = yCenter - Gate.size / 2;

    // enable the hGate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.graphics.eventMode = "static";

    // Scale mode for pixelation
    klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this.sprite = new PIXI.Sprite(klass.icon);
    this.graphics.addChild(this.sprite);

    // setup events for mouse + touch using
    // the pointer events
    this.graphics
      .on("pointerover", this.onPointerOver.bind(this), this.graphics)
      .on("pointerout", this.onPointerOut.bind(this), this.graphics)
      .on("pointerdown", this.onPointerDown.bind(this), this.graphics);

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

  mouseEnter() {
    this.actor.send("Mouse enter");
  }

  mouseLeave() {
    this.actor.send("Mouse leave");
  }

  applyIdleStyle() {}

  applyHoverStyle() {}

  applyGrabbedStyle() {}

  applyActiveStyle() {}

  gateType(): string {
    const klass = this.constructor as typeof Gate;
    return klass.gateType;
  }

  toJSON() {
    return {
      x: this.graphics.x,
      y: this.graphics.y,
    };
  }

  private onPointerOver(_event: PIXI.FederatedEvent) {
    this.enterGateRunner.emit(this);
  }

  private onPointerOut() {
    this.leaveGateRunner.emit(this);
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    this.grabGateRunner.emit(this, event.global);
  }
}
