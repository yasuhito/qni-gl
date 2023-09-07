import * as PIXI from "pixi.js";
import { HGate } from "./h-gate";

export class App {
  _dragTarget: HGate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  logs: string[] = [];
  logText: PIXI.Text;
  nameMap = new Map();

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (el === null) {
      throw new Error("Could not find #app");
    }

    this._dragTarget = null;

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

    this.logText = this.pixiApp.stage.addChild(
      new PIXI.Text("", {
        fontSize: 14,
      })
    );

    // logText.y = 80;
    this.logText.x = 2;
    this.logText.zIndex = 20;

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

  get dragTarget(): HGate | null {
    return this._dragTarget;
  }

  set dragTarget(value: HGate | null) {
    this._dragTarget = value;
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
    new HGate(x, y, this);
  }

  onGateOver(gate: HGate) {
    if (this.dragTarget === null) {
      gate.changeTextureToHoverState();
      this.pixiApp.stage.cursor = "pointer";
    }
  }

  onGateOut(gate: HGate) {
    if (this.dragTarget === null) {
      gate.changeTextureToDefault();
      this.pixiApp.stage.cursor = "default";
    }
  }

  onDragStart(gate: HGate) {
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.dragTarget = gate;
    if (this.dragTarget === null) {
      throw new Error("dragTarget is null");
    }

    this.dragTarget.sprite.zIndex = 10;
    this.dragTarget.changeTextureToGrabbedState();
    this.pixiApp.stage.on("pointermove", this.onDragMove.bind(this));
  }

  private onDragMove(event: PIXI.FederatedPointerEvent) {
    if (this.dragTarget) {
      // event.global is the global position of the mouse/touch
      this.dragTarget.sprite.parent.toLocal(
        event.global,
        undefined,
        this.dragTarget.sprite.position
      );

      const dropzoneX = this.pixiApp.screen.width / 2;
      const dropzoneY = this.pixiApp.screen.height / 2;
      const dropzoneWidth = 32;
      const dropzoneHeight = 32;
      const snapRatio = 0.5;

      if (
        this.rectIntersect(
          this.dragTarget.sprite.x - this.dragTarget.sprite.width / 2,
          this.dragTarget.sprite.y - this.dragTarget.sprite.height / 2,
          this.dragTarget.sprite.width,
          this.dragTarget.sprite.height,
          dropzoneX - (dropzoneWidth * snapRatio) / 2,
          dropzoneY - (dropzoneHeight * snapRatio) / 2,
          dropzoneWidth * snapRatio,
          dropzoneHeight * snapRatio
        )
      ) {
        this.dragTarget.sprite.tint = 0x00ffff;
        this.dragTarget.sprite.position.set(dropzoneX, dropzoneY);
      } else {
        this.dragTarget.sprite.tint = 0xffffff;
      }
    }
  }

  private onDragEnd() {
    if (this.dragTarget) {
      this.pixiApp.stage.off("pointermove", this.onDragMove);
      this.dragTarget.sprite.zIndex = 0;
      this.dragTarget.changeTextureToDefault();
      this.dragTarget.sprite.tint = 0xffffff;
      this.dragTarget = null;
    }
  }

  private onEvent(e: PIXI.FederatedPointerEvent) {
    const type = e.type;
    let targetName: string | undefined;
    if (e.target) {
      targetName = this.nameMap.get(e.target);
    }
    const currentTargetName = this.nameMap.get(e.currentTarget);

    // Add event to top of logs
    this.logs.push(
      `${currentTargetName} received ${type} event (target is ${targetName})`
    );

    if (
      currentTargetName === "stage" ||
      type === "pointerenter" ||
      type === "pointerleave"
    ) {
      this.logs.push("-----------------------------------------", "");
    }

    // Prevent logs from growing too long
    if (this.logs.length > 30) {
      while (this.logs.length > 30) {
        this.logs.shift();
      }
    }

    // Update logText
    this.logText.text = this.logs.join("\n");
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
