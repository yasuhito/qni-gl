import * as PIXI from "pixi.js";
import { Runner } from "@pixi/runner";
import { ActorRefFrom, createMachine, interpret } from "xstate";
import { Dropzone } from "./dropzone";
import * as tailwindColors from "tailwindcss/colors";

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
  static size = 32;
  static color = {
    body: tailwindColors.emerald["500"],
    idleBorder: tailwindColors.emerald["600"],
  };
  static cornerRadius = 4;
  static icon = PIXI.Texture.from("./assets/Placeholder.svg");

  graphics: PIXI.Graphics;
  sprite: PIXI.Sprite;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

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
          this.graphics.zIndex = 0;
          this.graphics.cursor = "default";
        },
        applyHoverStyle: () => {
          this.graphics.cursor = "grab";
        },
        applyGrabbedStyle: () => {
          this.graphics.zIndex = 10;
          this.graphics.cursor = "grabbing";
        },
        applyActiveStyle: () => {
          this.graphics.cursor = "grab";
        },
        updatePosition: (_context, event: ClickEvent | DragEvent) => {
          if (event.dropzone) {
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

  constructor(xCenter: number, yCenter: number) {
    const klass = this.constructor as typeof Gate;

    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");

    this.graphics = new PIXI.Graphics();

    this.graphics.lineStyle(1, Gate.color.idleBorder, 1, 0);
    this.graphics.beginFill(Gate.color.body, 1);
    this.graphics.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      Gate.cornerRadius
    );
    this.graphics.endFill();
    this.graphics.x = xCenter - Gate.size / 2;
    this.graphics.y = yCenter - Gate.size / 2;

    // enable the hGate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.graphics.eventMode = "static";

    // Scale mode for pixelation
    klass.icon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    for (const key in klass.texture) {
      klass.texture[key].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

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
      console.log(`🌟 ${state.event.type}`);
      console.log(state.value);
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

  move(globalPosition: PIXI.Point, dropzone: Dropzone | null) {
    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  mouseEnter() {
    this.actor.send("Mouse enter");
  }

  mouseLeave() {
    this.actor.send("Mouse leave");
  }

  private onPointerOver(_event: PIXI.FederatedEvent) {
    this.enterGateRunner.emit(this);
  }

  private onPointerOut() {
    this.leaveGateRunner.emit(this);
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    console.dir(event);
    this.grabGateRunner.emit(this, event.global);
  }
}
