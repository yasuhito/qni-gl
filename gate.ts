import * as PIXI from "pixi.js";
import { App } from "./app";
import { ActorRefFrom, createMachine } from "xstate";
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
  static idleTexture = PIXI.Texture.from("./assets/idle.svg");
  static hoverTexture = PIXI.Texture.from("./assets/hover.svg");
  static grabbedTexture = PIXI.Texture.from("./assets/grabbed.svg");
  static activeTexture = PIXI.Texture.from("./assets/active.svg");
  static disabledTexture = PIXI.Texture.from("./assets/disabled.svg");

  app: App;
  sprite: PIXI.Sprite;

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
  }

  applyIdleStyle() {}

  applyHoverStyle() {}

  applyGrabbedStyle() {}

  applyActiveStyle() {}
}
