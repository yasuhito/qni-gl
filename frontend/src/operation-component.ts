import { ActorRefFrom, createActor, createMachine } from "xstate";
import { Dropzone } from "./dropzone";
import { OperationSource } from "./operation-source";
import { Size } from "./size";
import { spacingInPx } from "./util";
import { Spacing } from "./spacing";
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Point,
  Sprite,
} from "pixi.js";
import { IconableMixin } from "./iconable-mixin";
import { OPERATION_EVENTS } from "./events";
import { GateShapeConfig } from "./types";

/**
 * ゲートのクリックイベント
 */
export type ClickEvent = {
  type: "Click";
  globalPosition: Point;
  dropzone: Dropzone | null;
};

/**
 * ゲートのドラッグイベント
 */
export type DragEvent = {
  type: "Drag";
  globalPosition: Point;
  dropzone: Dropzone | null;
};

export class OperationComponent extends IconableMixin(Container) {
  static sizeInPx = {
    xl: spacingInPx(12),
    lg: spacingInPx(10),
    base: spacingInPx(8),
    sm: spacingInPx(6),
    xs: spacingInPx(4),
  };
  static readonly cornerRadius = Spacing.cornerRadius.gate;

  sprite!: Sprite;
  whiteSprite!: Sprite;

  size: Size = "base";
  sizeInPx = OperationComponent.sizeInPx[this.size];

  insertable = false;
  insertStepPosition: number | null = null;
  insertQubitIndex: number | null = null;

  debug = false;

  protected _shape!: Graphics;
  protected pastedEmphasisCoversBackground = true;
  private emphasisOverlay: Container | null = null;

  protected stateMachine = createMachine(
    {
      id: "draggable",
      initial: "Idle",
      states: {
        Idle: {
          entry: "applyIdleStyle",
          on: {
            Click: {
              target: "Grabbed",
            },
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
            this.position.set(this.sizeInPx / 4, this.sizeInPx / 4);
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

  get operationType(): string {
    throw new Error("operationType must be implemented in derived class");
  }

  get gateSource(): OperationSource | null {
    if (this.parent instanceof OperationSource) {
      return this.parent;
    }

    return null;
  }

  get dropzone(): Dropzone | null {
    if (this.parent instanceof Dropzone) {
      return this.parent;
    }

    return null;
  }

  constructor() {
    super();

    this._shape = new Graphics();
    this.addChild(this._shape);

    // setup events for mouse + touch using
    // the pointer events
    this.on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this)
      .on("pointerdown", this.onPointerDown, this)
      .on("pointerup", this.onPointerUp, this);

    this.actor = createActor(this.stateMachine);
    this.actor.subscribe((state) => {
      if (this.debug) {
        console.log(`${this.operationType}: ${state.value} state`);
      }
    });

    this.createSprites(this.operationType).then(({ sprite, whiteSprite }) => {
      this.sprite = sprite;
      this.sprite.width = this.sizeInPx;
      this.sprite.height = this.sizeInPx;
      this.whiteSprite = whiteSprite;
      this.whiteSprite.visible = false;
      this.whiteSprite.width = this.sizeInPx;
      this.whiteSprite.height = this.sizeInPx;
      this.addChild(this.sprite);
      this.addChild(this.whiteSprite);

      this.actor.start();

      // enable the gate to be interactive...
      // this will allow it to respond to mouse and touch events
      this.eventMode = "static";
    });
  }

  click(globalPosition: Point, dropzone: Dropzone | null) {
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
    this.clearEmphasis();
    if (this.sprite && this.whiteSprite) {
      this.applyIdleStyle();
    }
  }

  /**
   * コピー対象として選択されたゲートを、既存のactive表示と同じ枠で強調する。
   */
  applySelectionEmphasis(): void {
    this.applyActiveStyle();
  }

  setPastedEmphasisAlpha(alpha: number): void {
    if (alpha <= 0) {
      this.clearEmphasis();
      return;
    }

    if (this.emphasisOverlay === null) {
      this.emphasisOverlay = this.createPastedEmphasisOverlay();
      this.addChild(this.emphasisOverlay);
    }

    this.emphasisOverlay.alpha = alpha;
  }

  /**
   * コピー選択やペースト結果の補助表示を消す。
   */
  clearEmphasis(): void {
    if (this.emphasisOverlay === null) {
      return;
    }

    this.removeChild(this.emphasisOverlay);
    this.emphasisOverlay.destroy();
    this.emphasisOverlay = null;
  }

  move(globalPosition: Point) {
    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: null,
    });
  }

  snapToDropzone(dropzone: Dropzone, globalPosition: Point) {
    if (this.dropzone && this.dropzone !== dropzone) {
      this.unsnap();
    }

    this.actor.send({
      type: "Drag",
      globalPosition: globalPosition,
      dropzone: dropzone,
    });
  }

  insert(dropzone: Dropzone) {
    dropzone.assign(this);
  }

  snap(dropzone: Dropzone) {
    dropzone.snap(this);
    this.emit(OPERATION_EVENTS.SNAPPED, this, dropzone);
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

  private createPastedEmphasisOverlay(): Container {
    if (!this.pastedEmphasisCoversBackground) {
      const whiteSprite = this.createWhiteSprite(this.sprite.texture);
      whiteSprite.width = this.sizeInPx;
      whiteSprite.height = this.sizeInPx;

      return whiteSprite;
    }

    return new Graphics()
      .roundRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        this.emphasisCornerRadius,
      )
      .fill(0xffffff);
  }

  private get emphasisCornerRadius(): number {
    const constructor = this.constructor as typeof OperationComponent & {
      SHAPE_CONFIG?: GateShapeConfig;
    };

    return (
      constructor.SHAPE_CONFIG?.cornerRadius ?? OperationComponent.cornerRadius
    );
  }

  private onPointerOver() {
    this.actor.send({ type: "Mouse enter" });
    this.cursor = "grab";
  }

  private onPointerOut() {
    this.mouseLeave();
    this.emit(OPERATION_EVENTS.MOUSE_LEFT, this);
  }

  private onPointerDown(event: FederatedPointerEvent) {
    if (event.shiftKey) {
      this.emit(OPERATION_EVENTS.GRABBED, this, event.global, true);
      return;
    }

    this.emit(OPERATION_EVENTS.GRABBED, this, event.global);
  }

  private onPointerUp() {
    if (this.dropzone) {
      return;
    }
    if (this.insertable) {
      return;
    }

    this.emit(OPERATION_EVENTS.DISCARDED, this);
    this.destroy();
  }
}
