import * as PIXI from "pixi.js";
import { Dropzone } from "./dropzone";
import { HGate } from "./h-gate";
import { Logger } from "./logger";

export class App {
  activeGate: HGate | null = null;
  grabbedGate: HGate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  dropzone: Dropzone;
  logger: Logger;
  nameMap = new Map();

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (el === null) {
      throw new Error("Could not find #app");
    }

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
    this.pixiApp.stage
      .on("pointerup", this.releaseGate.bind(this)) // マウスでクリックを離した、タッチパネルでタッチを離した
      .on("pointerupoutside", this.releaseGate.bind(this)) // 描画オブジェクトの外側でクリック、タッチを離した
      .on("pointerdown", this.maybeDeactivateGate.bind(this));

    // 中央に dropzone を作成
    const dropzoneX = this.pixiApp.screen.width / 2;
    const dropzoneY = this.pixiApp.screen.height / 2;
    this.dropzone = new Dropzone(dropzoneX, dropzoneY);
    this.pixiApp.stage.addChild(this.dropzone.graphics);

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");

    // [this.pixiApp.stage].forEach((object) => {
    //   object.addEventListener("pointerup", this.onEvent.bind(this));
    //   object.addEventListener("pointerupoutside", this.onEvent.bind(this));
    // });
  }

  get screenWidth(): number {
    return this.pixiApp.screen.width;
  }

  get screenHeight(): number {
    return this.pixiApp.screen.height;
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
    this.nameMap.set(hGate.sprite, "H Gate");
  }

  enterGate(gate: HGate) {
    gate.mouseEnter();
  }

  leaveGate(gate: HGate) {
    // const type = "leaveGate";
    // const targetName = this.nameMap.get(gate.sprite);
    // this.logger.push(
    //   `${targetName} received ${type} event (${gate.x}, ${gate.y})`
    // );

    gate.mouseLeave();
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: HGate, globalPosition: PIXI.Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.activeGate = gate;
    this.grabbedGate = gate;
    if (
      this.dropzone.isSnappable(
        globalPosition.x,
        globalPosition.y,
        gate.width,
        gate.height
      )
    ) {
      this.grabbedGate.click(globalPosition, this.dropzone);
    } else {
      this.grabbedGate.click(globalPosition, null);
    }

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate.bind(this));
  }

  private maybeMoveGate(event: PIXI.FederatedPointerEvent) {
    if (this.grabbedGate === null) {
      return;
    }

    this.moveGate(this.grabbedGate, event.global);
  }

  // globalPosition is the global position of the mouse/touch
  private moveGate(gate: HGate, globalPosition: PIXI.Point) {
    if (
      this.dropzone.isSnappable(
        globalPosition.x,
        globalPosition.y,
        gate.width,
        gate.height
      )
    ) {
      gate.move(globalPosition, this.dropzone);
    } else {
      gate.move(globalPosition, null);
    }
  }

  private releaseGate() {
    if (this.grabbedGate === null) {
      return;
    }

    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;
  }

  private maybeDeactivateGate() {
    if (this.activeGate !== null) {
      this.activeGate.deactivate();
    }
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
