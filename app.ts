import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { HGate } from "./h-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { GatePalette } from "./gate-palette";
import { Circuit } from "./circuit";
import { CircuitStep } from "./circuit-step";
import { Logger } from "./logger";

export class App {
  activeGate: Gate | null = null;
  grabbedGate: Gate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  gatePalette: GatePalette;
  circuit: Circuit;
  circuitSteps: CircuitStep[] = [];
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

    this.gatePalette = new GatePalette(150, 32);
    this.pixiApp.stage.addChild(this.gatePalette.graphics);

    this.circuit = new Circuit(8, 10, 150, 200);
    this.pixiApp.stage.addChild(this.circuit.graphics);

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");
  }

  get screenWidth(): number {
    return this.pixiApp.screen.width;
  }

  get screenHeight(): number {
    return this.pixiApp.screen.height;
  }

  createWorld() {
    for (let i = 0; i < 50; i++) {
      this.createGate(
        HGate,
        Math.floor(Math.random() * this.pixiApp.screen.width),
        Math.floor(Math.random() * this.pixiApp.screen.height)
      );
      this.createGate(
        XGate,
        Math.floor(Math.random() * this.pixiApp.screen.width),
        Math.floor(Math.random() * this.pixiApp.screen.height)
      );
      this.createGate(
        YGate,
        Math.floor(Math.random() * this.pixiApp.screen.width),
        Math.floor(Math.random() * this.pixiApp.screen.height)
      );
      this.createGate(
        ZGate,
        Math.floor(Math.random() * this.pixiApp.screen.width),
        Math.floor(Math.random() * this.pixiApp.screen.height)
      );
    }
  }

  private createGate(gateClass: typeof Gate, x: number, y: number) {
    const gate = new gateClass(x, y);
    this.pixiApp.stage.addChild(gate.sprite);
    gate.enterGateRunner.add(this);
    gate.leaveGateRunner.add(this);
    gate.grabGateRunner.add(this);

    this.nameMap.set(gate.sprite, gateClass.name);
  }

  enterGate(gate: Gate) {
    gate.mouseEnter();
  }

  leaveGate(gate: Gate) {
    gate.mouseLeave();
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: Gate, globalPosition: PIXI.Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.activeGate = gate;
    this.grabbedGate = gate;

    // this.dropzones についてループを回す
    // その中で、dropzone が snappable かどうかを判定する
    let snapped = false;

    for (const circuitStep of this.circuit.circuitSteps) {
      for (const each of circuitStep.dropzones) {
        if (
          each.isSnappable(
            globalPosition.x,
            globalPosition.y,
            gate.width,
            gate.height
          )
        ) {
          snapped = true;
          this.grabbedGate.click(globalPosition, each);
        }
      }
    }

    if (!snapped) {
      this.grabbedGate.click(globalPosition, null);
    }

    this.pixiApp.stage.cursor = "grabbing";

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate.bind(this));
  }

  private maybeMoveGate(event: PIXI.FederatedPointerEvent) {
    if (this.grabbedGate === null) {
      return;
    }

    this.moveGate(this.grabbedGate, event.global);
  }

  // globalPosition is the global position of the mouse/touch
  private moveGate(gate: Gate, globalPosition: PIXI.Point) {
    let snapped = false;

    for (const circuitStep of this.circuit.circuitSteps) {
      for (const each of circuitStep.dropzones) {
        if (
          each.isSnappable(
            globalPosition.x,
            globalPosition.y,
            gate.width,
            gate.height
          )
        ) {
          snapped = true;
          gate.move(globalPosition, each);
        }
      }
    }

    if (!snapped) {
      gate.move(globalPosition, null);
    }
  }

  private releaseGate() {
    if (this.grabbedGate === null) {
      return;
    }

    this.pixiApp.stage.cursor = "grab";
    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;
  }

  private maybeDeactivateGate(event: PIXI.FederatedPointerEvent) {
    if (event.target === this.pixiApp.stage) {
      this.activeGate?.deactivate();
    }
  }
}
