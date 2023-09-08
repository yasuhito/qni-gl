import * as PIXI from "pixi.js";
import { Dropzone } from "./dropzone";
import { HGate } from "./h-gate";
import { Logger } from "./logger";

export class App {
  _currentDraggable: HGate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  dropzone: Dropzone;
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
    this.pixiApp.stage.on("pointerup", this.releaseGate.bind(this)); // マウスでクリックを離した、タッチパネルでタッチを離した
    this.pixiApp.stage.on("pointerupoutside", this.releaseGate.bind(this)); // 描画オブジェクトの外側でクリック、タッチを離した

    // 中央に dropzone を作成
    const dropzoneX = this.pixiApp.screen.width / 2;
    const dropzoneY = this.pixiApp.screen.height / 2;
    this.dropzone = new Dropzone(dropzoneX, dropzoneY);
    this.pixiApp.stage.addChild(this.dropzone.graphics);

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");

    [this.pixiApp.stage].forEach((object) => {
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

    gate.mouseEnter();
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

    gate.mouseLeave();
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: HGate) {
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.currentDraggable = gate;

    this.currentDraggable.sprite.zIndex = 10;
    this.currentDraggable.click();

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate.bind(this));
  }

  private maybeMoveGate(event: PIXI.FederatedPointerEvent) {
    if (this.currentDraggable === null) {
      return;
    }

    this.moveGate(this.currentDraggable, event.global);
  }

  // globalPosition is the global position of the mouse/touch
  private moveGate(gate: HGate, globalPosition: PIXI.Point) {
    gate.sprite.parent.toLocal(globalPosition, undefined, gate.sprite.position);

    if (this.dropzone.isSnappable(gate)) {
      gate.snap(this.dropzone.x, this.dropzone.y);
    } else {
      gate.unSnap();
    }
  }

  private releaseGate() {
    if (this.currentDraggable === null) {
      return;
    }

    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    this.currentDraggable.mouseUp();
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
}
