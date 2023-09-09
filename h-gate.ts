import * as PIXI from "pixi.js";
import { App } from "./app";
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

export class HGate {
  static idleTexture = PIXI.Texture.from("./assets/H_idle.svg");
  static hoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
  static grabbedTexture = PIXI.Texture.from("./assets/H_grabbed.svg");
  static activeTexture = PIXI.Texture.from("./assets/H_active.svg");

  app: App;
  sprite: PIXI.Sprite;
  state = "default";
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
          this.sprite.texture = HGate.idleTexture;
          this.sprite.zIndex = 0;
          this.sprite.tint = 0xffffff;
          this.sprite.cursor = "default";
        },
        applyHoverStyle: () => {
          this.sprite.texture = HGate.hoverTexture;
          this.sprite.cursor = "grab";
        },
        applyGrabbedStyle: () => {
          this.sprite.zIndex = 10;
          this.sprite.texture = HGate.grabbedTexture;
        },
        applyActiveStyle: () => {
          this.sprite.texture = HGate.activeTexture;
        },
        updatePosition: (_context, event: ClickEvent | DragEvent) => {
          if (event.dropzone) {
            const x = event.dropzone.x;
            const y = event.dropzone.y;
            this.sprite.position.set(x, y);
          } else {
            this.sprite.parent.toLocal(
              event.globalPosition,
              undefined,
              this.sprite.position
            );
          }
        },
      },
    }
  );
  actor: ActorRefFrom<typeof this.stateMachine>;

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  get width(): number {
    return this.sprite.width;
  }

  get height(): number {
    return this.sprite.height;
  }

  constructor(x: number, y: number, app: App) {
    this.app = app;
    this.sprite = new PIXI.Sprite(HGate.idleTexture);

    // enable the hGate to be interactive... this will allow it to respond to mouse and touch events
    this.sprite.eventMode = "static";

    // center the hGate's anchor point
    this.sprite.anchor.set(0.5);

    // setup events for mouse + touch using
    // the pointer events
    this.sprite
      .on("pointerover", this.onPointerOver.bind(this), this.sprite)
      .on("pointerout", this.onPointerOut.bind(this), this.sprite)
      .on("pointerdown", this.onPointerDown.bind(this), this.sprite);

    // move the sprite to its designated position
    this.sprite.x = x;
    this.sprite.y = y;

    // add it to the stage
    this.app.pixiApp.stage.addChild(this.sprite);

    this.actor = interpret(this.stateMachine).start();
    // Fires whenever the state changes
    const { unsubscribe } = this.actor.subscribe((state) => {
      console.log(state.value);
    });
  }

  mouseEnter() {
    this.actor.send("Mouse enter");
  }

  mouseLeave() {
    this.actor.send("Mouse leave");
  }

  click(globalPosition: PIXI.Point, dropzone: Dropzone | null) {
    this.actor.send({
      type: "Click",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  deactivate() {
    this.actor.send("Deactivate");
  }

  mouseUp() {
    this.actor.send("Mouse up");
  }

  move(globalPosition: PIXI.Point, dropzone: Dropzone | null) {
    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  snap(x: number, y: number) {
    this.sprite.tint = 0x00ffff;
    this.sprite.position.set(x, y);
  }

  unSnap() {
    this.sprite.tint = 0xffffff;
  }

  private onPointerOver(_event: PIXI.FederatedEvent) {
    this.app.enterGate(this);
  }

  private onPointerOut() {
    this.app.leaveGate(this);
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    this.app.grabGate(this, event.global);
  }
}

// Scale mode for pixelation
HGate.idleTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.hoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.grabbedTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.activeTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
