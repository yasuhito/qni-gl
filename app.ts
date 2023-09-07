import * as PIXI from "pixi.js";
import { HGate } from "./h-gate";
import { Logger } from "./logger";

export class App {
  _currentDraggable: HGate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  logger: Logger;
  nameMap = new Map();

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (el === null) {
      throw new Error("Could not find #app");
    }

    this._currentDraggable = null;

    // view, stage などをまとめた application を作成
    this.pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: 800,
      height: 800,
      backgroundColor: 0x1099bb,
      autoDensity: true,
    });

    el.appendChild(this.pixiApp.view);

    // stage: 画面に表示するオブジェクトたちの入れ物
    this.pixiApp.stage.eventMode = "static";
    this.pixiApp.stage.hitArea = this.pixiApp.screen;
    this.pixiApp.stage.sortableChildren = true;
    this.pixiApp.stage.on("pointerup", this.onDragEnd.bind(this)); // マウスでクリックを離した、タッチパネルでタッチを離した
    this.pixiApp.stage.on("pointerupoutside", this.onDragEnd.bind(this)); // 描画オブジェクトの外側でクリック、タッチを離した

    // ダブっているので一か所にまとめる
    const dropzoneX = this.pixiApp.screen.width / 2;
    const dropzoneY = this.pixiApp.screen.height / 2;
    const dropzoneWidth = 32;
    const dropzoneHeight = 32;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x1111ff, 1, 0);
    graphics.beginFill(0xffffff, 0);
    graphics.drawRect(
      dropzoneX - dropzoneWidth / 2,
      dropzoneY - dropzoneHeight / 2,
      dropzoneWidth,
      dropzoneHeight
    );
    graphics.endFill();
    this.pixiApp.stage.addChild(graphics);

    this.logger = new Logger(this.pixiApp);

    this.nameMap.set(this.pixiApp.stage, "stage");

    [this.pixiApp.stage].forEach((object) => {
      // object.addEventListener("pointerenter", onEvent);
      // object.addEventListener("pointerleave", onEvent);
      // object.addEventListener("pointerover", onEvent);
      // object.addEventListener("pointerout", onEvent);
      object.addEventListener("pointerup", this.onEvent.bind(this));
      object.addEventListener("pointerupoutside", this.onEvent.bind(this));
    });
  }

  get screenWidth(): number {
    return this.pixiApp.screen.width;
  }

  get screenHeight(): number {
    return this.pixiApp.screen.height;
  }

  get currentDraggable(): HGate | null {
    return this._currentDraggable;
  }

  set currentDraggable(value: HGate | null) {
    this._currentDraggable = value;
  }

  createWorld() {
    for (let i = 0; i < 100; i++) {
      this.createHGate(
        Math.floor(Math.random() * this.pixiApp.screen.width),
        Math.floor(Math.random() * this.pixiApp.screen.height)
      );
    }
  }

  private createHGate(x: number, y: number) {
    const hGate = new HGate(x, y, this);

    hGate.sprite.addEventListener("pointerdown", this.onEvent.bind(this));
    this.nameMap.set(hGate.sprite, "H Gate");
  }

  enterGate(gate: HGate) {
    if (this.currentDraggable !== null) {
      return;
    }

    const type = "enterGate";
    const targetName = this.nameMap.get(gate.sprite);
    this.logger.push(
      `${targetName} received ${type} event (${gate.x}, ${gate.y})`
    );

    gate.hover();
    this.pixiApp.stage.cursor = "pointer";
  }

  leaveGate(gate: HGate) {
    if (this.currentDraggable !== null) {
      return;
    }

    const type = "leaveGate";
    const targetName = this.nameMap.get(gate.sprite);
    this.logger.push(
      `${targetName} received ${type} event (${gate.x}, ${gate.y})`
    );

    gate.default();
    this.pixiApp.stage.cursor = "default";
  }

  onDragStart(gate: HGate) {
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.currentDraggable = gate;
    this.currentDraggable.sprite.zIndex = 10;
    this.currentDraggable.changeTextureToGrabbedState();
    this.pixiApp.stage.on("pointermove", this.onDragMove.bind(this));
  }

  private onDragMove(event: PIXI.FederatedPointerEvent) {
    if (this.currentDraggable === null) {
      return;
    }

    // event.global is the global position of the mouse/touch
    this.currentDraggable.sprite.parent.toLocal(
      event.global,
      undefined,
      this.currentDraggable.sprite.position
    );

    const dropzoneX = this.pixiApp.screen.width / 2;
    const dropzoneY = this.pixiApp.screen.height / 2;
    const dropzoneWidth = 32;
    const dropzoneHeight = 32;
    const snapRatio = 0.5;

    if (
      this.rectIntersect(
        this.currentDraggable.sprite.x - this.currentDraggable.sprite.width / 2,
        this.currentDraggable.sprite.y -
          this.currentDraggable.sprite.height / 2,
        this.currentDraggable.sprite.width,
        this.currentDraggable.sprite.height,
        dropzoneX - (dropzoneWidth * snapRatio) / 2,
        dropzoneY - (dropzoneHeight * snapRatio) / 2,
        dropzoneWidth * snapRatio,
        dropzoneHeight * snapRatio
      )
    ) {
      this.currentDraggable.sprite.tint = 0x00ffff;
      this.currentDraggable.sprite.position.set(dropzoneX, dropzoneY);
    } else {
      this.currentDraggable.sprite.tint = 0xffffff;
    }
  }

  private onDragEnd() {
    if (this.currentDraggable === null) {
      return;
    }

    this.pixiApp.stage.off("pointermove", this.onDragMove);
    this.currentDraggable.sprite.zIndex = 0;
    this.currentDraggable.default();
    this.currentDraggable.sprite.tint = 0xffffff;
    this.currentDraggable = null;
  }

  private onEvent(e: PIXI.FederatedPointerEvent) {
    const type = e.type;
    let targetName: string | undefined;
    if (e.target) {
      targetName = this.nameMap.get(e.target);
    }
    const currentTargetName = this.nameMap.get(e.currentTarget);

    this.logger.push(
      `${currentTargetName} received ${type} event (target is ${targetName})`
    );

    if (
      currentTargetName === "stage" ||
      type === "pointerenter" ||
      type === "pointerleave"
    ) {
      this.logger.push("-----------------------------------------");
      this.logger.push("");
    }
  }

  private rectIntersect(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }
    return true;
  }
}
