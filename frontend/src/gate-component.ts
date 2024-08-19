import { ActorRefFrom, createActor, createMachine } from "xstate";
import { DropzoneComponent } from "./dropzone-component";
import { GateSourceComponent } from "./gate-source-component";
import { Size } from "./size";
import { sizeInPx } from "./util";
import { Spacing } from "./spacing";
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Point,
  Sprite,
} from "pixi.js";
import { IconableMixin } from "./iconable-mixin";

/**
 * ゲートのクリックイベント
 */
export type ClickEvent = {
  type: "Click";
  globalPosition: Point;
  dropzone: DropzoneComponent | null;
};

/**
 * ゲートのドラッグイベント
 */
export type DragEvent = {
  type: "Drag";
  globalPosition: Point;
  dropzone: DropzoneComponent | null;
};

export class GateComponent extends IconableMixin(Container) {
  static cornerRadius = Spacing.cornerRadius.gate;

  sprite!: Sprite;
  whiteSprite!: Sprite;

  size: Size = "base";
  sizeInPx = sizeInPx[this.size];

  debug = false;

  protected _shape!: Graphics;

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
  private actor!: ActorRefFrom<typeof this.stateMachine>;

  get gateType(): string {
    return this.constructor.name;
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

    // enable the gate to be interactive...
    // this will allow it to respond to mouse and touch events
    this.eventMode = "static";

    this._shape = new Graphics();
    this.addChild(this._shape);

    this.createSprites(this.gateType).then(({ sprite, whiteSprite }) => {
      this.sprite = sprite;
      this.sprite.width = this.sizeInPx;
      this.sprite.height = this.sizeInPx;
      this.whiteSprite = whiteSprite;
      this.whiteSprite.visible = false;
      this.whiteSprite.width = this.sizeInPx;
      this.whiteSprite.height = this.sizeInPx;
      this.addChild(this.sprite);
      this.addChild(this.whiteSprite);

      // setup events for mouse + touch using
      // the pointer events
      this.on("pointerover", this.onPointerOver, this)
        .on("pointerout", this.onPointerOut, this)
        .on("pointerdown", this.onPointerDown, this)
        .on("pointerup", this.onPointerUp, this);

      this.actor = createActor(this.stateMachine);
      this.actor.subscribe((state) => {
        if (this.debug) {
          console.log(`${state.value} state`);
        }
      });
      this.actor.start();
    });
  }

  click(globalPosition: Point, dropzone: DropzoneComponent | null) {
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

  move(globalPosition: Point) {
    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: null,
    });
  }

  snapToDropzone(dropzone: DropzoneComponent, globalPosition: Point) {
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

  private onPointerOver() {
    this.actor.send({ type: "Mouse enter" });
    this.cursor = "grab";
  }

  private onPointerOut() {
    this.mouseLeave();
    this.emit("mouseLeave", this);
  }

  private onPointerDown(event: FederatedPointerEvent) {
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
