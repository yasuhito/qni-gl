import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { HGate } from "./h-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { RnotGate } from "./rnot-gate";
import { SGate } from "./s-gate";
import { TGate } from "./t-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { PhaseGate } from "./phase-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SwapGate } from "./swap-gate";
import { ControlGate } from "./control-gate";
import { AntiControlGate } from "./anti-control-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { MeasurementGate } from "./measurement-gate";
import { BlochSphere } from "./bloch-sphere";
import { GatePalette } from "./gate-palette";
import { Circuit } from "./circuit";
import { CircuitStep } from "./circuit-step";
import { Logger } from "./logger";

export class App {
  static elementId = "app";
  private static _instance: App;

  activeGate: Gate | null = null;
  grabbedGate: Gate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  gatePalette: GatePalette;
  circuit: Circuit;
  circuitSteps: CircuitStep[] = [];
  logger: Logger;
  nameMap = new Map();

  public static get instance(): App {
    if (!this._instance) {
      this._instance = new App(this.elementId);
    }

    // 自身が持つインスタンスを返す
    return this._instance;
  }

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (el === null) {
      throw new Error("Could not find #app");
    }

    // view, stage などをまとめた application を作成
    this.pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: 800,
      height: 800,
      backgroundColor: 0xfafafa, // Zinc/50 https://tailwindcss.com/docs/customizing-colors
      autoDensity: true,
      preserveDrawingBuffer: true,
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

    this.gatePalette.newGateRunner.add(this);
    this.gatePalette.enterGateRunner.add(this);
    this.gatePalette.leaveGateRunner.add(this);
    this.gatePalette.grabGateRunner.add(this);

    this.gatePalette.addGate(HGate);
    this.gatePalette.addGate(XGate);
    this.gatePalette.addGate(YGate);
    this.gatePalette.addGate(ZGate);
    this.gatePalette.addGate(RnotGate);
    this.gatePalette.addGate(SGate);
    this.gatePalette.addGate(SDaggerGate);
    this.gatePalette.addGate(TGate);
    this.gatePalette.addGate(TDaggerGate);
    this.gatePalette.addGate(PhaseGate);
    this.gatePalette.addGate(RxGate);
    this.gatePalette.addGate(RyGate);
    this.gatePalette.addGate(RzGate);
    this.gatePalette.addGate(SwapGate, 2);
    this.gatePalette.addGate(ControlGate, 2);
    this.gatePalette.addGate(AntiControlGate, 2);
    this.gatePalette.addGate(Write0Gate, 2);
    this.gatePalette.addGate(Write1Gate, 2);
    this.gatePalette.addGate(MeasurementGate, 2);
    this.gatePalette.addGate(BlochSphere, 2);

    this.circuit = new Circuit(10, 15, 150, 200);
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

  newGate(gate: Gate) {
    this.pixiApp.stage.addChild(gate.graphics);
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
    let dropzone;

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
          dropzone = each;
          this.grabbedGate.click(globalPosition, each);
        }
      }
    }

    gate.dropzone = dropzone;
    if (!gate.dropzone) {
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
    let snapDropzone;

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
          snapDropzone = each;
          gate.snapToDropzone(each, globalPosition);
        }
      }
    }

    if (
      snapDropzone &&
      (gate.dropzone === null || gate.dropzone !== snapDropzone)
    ) {
      gate.snap();
    }
    if (gate.dropzone && !snapDropzone) {
      gate.unsnap();
    }

    gate.dropzone = snapDropzone;
    if (!gate.dropzone) {
      gate.move(globalPosition);
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
