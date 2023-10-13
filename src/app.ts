import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { AntiControlGate } from "./anti-control-gate";
import { BlochSphere } from "./bloch-sphere";
import { Circuit } from "./circuit";
import { CircuitStep } from "./circuit-step";
import { ControlGate } from "./control-gate";
import { Gate } from "./gate";
import { GatePalette } from "./gate-palette";
import { HGate } from "./h-gate";
import { Logger } from "./logger";
import { MeasurementGate } from "./measurement-gate";
import { PhaseGate } from "./phase-gate";
import { QFTDaggerGate } from "./qft-dagger-gate";
import { QFTGate } from "./qft-gate";
import { RnotGate } from "./rnot-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { SGate } from "./s-gate";
import { SwapGate } from "./swap-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { TGate } from "./t-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";

export class App {
  static elementId = "app";
  private static _instance: App;

  element: HTMLElement;
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
    this.element = el;

    // view, stage などをまとめた application を作成
    this.pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: 800,
      height: 600,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: tailwindColors.zinc["50"],
      preserveDrawingBuffer: true,
    });

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    el.appendChild(this.pixiApp.view);

    // stage: 画面に表示するオブジェクトたちの入れ物
    this.pixiApp.stage.eventMode = "static";
    this.pixiApp.stage.hitArea = this.pixiApp.screen;
    this.pixiApp.stage.sortableChildren = true;
    this.pixiApp.stage
      .on("pointerup", this.releaseGate.bind(this)) // マウスでクリックを離した、タッチパネルでタッチを離した
      .on("pointerupoutside", this.releaseGate.bind(this)) // 描画オブジェクトの外側でクリック、タッチを離した
      .on("pointerdown", this.maybeDeactivateGate.bind(this));

    // this.oldGatePalette.newGateRunner.add(this);
    // this.oldGatePalette.leaveGateRunner.add(this);

    this.gatePalette = new GatePalette();
    this.pixiApp.stage.addChild(this.gatePalette);
    this.gatePalette.onGrabGate.connect((gate, globalPosition) => {
      this.grabGate(gate, globalPosition);
    });
    this.gatePalette.x = 40;
    this.gatePalette.y = 64;

    this.gatePalette.onNewGate.connect((newGate) => {
      newGate.zIndex = 20;
      this.pixiApp.stage.addChild(newGate);
    });
    this.gatePalette.onMouseLeaveGate.connect((gate) => {
      this.leaveGate(gate);
    });

    this.pixiApp.stage.addChild(this.gatePalette.addGate(HGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(XGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(YGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(ZGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(RnotGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(SGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(SDaggerGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(TGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(TDaggerGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(PhaseGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(RxGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(RyGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(RzGate));

    this.gatePalette.newRow();
    this.pixiApp.stage.addChild(this.gatePalette.addGate(SwapGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(ControlGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(AntiControlGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(Write0Gate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(Write1Gate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(MeasurementGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(BlochSphere));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(QFTGate));
    this.pixiApp.stage.addChild(this.gatePalette.addGate(QFTDaggerGate));

    this.circuit = new Circuit(2, 5);
    this.circuit.x = this.gatePalette.x;
    this.circuit.y = 64 + this.gatePalette.height + 64;
    this.pixiApp.stage.addChild(this.circuit);
    this.element.dataset.app = JSON.stringify(this);

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");
  }

  get screenWidth(): number {
    return this.pixiApp.screen.width;
  }

  get screenHeight(): number {
    return this.pixiApp.screen.height;
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.pixiApp.renderer.resize(width, height);
  }

  newGate(gate: Gate) {
    this.pixiApp.stage.addChild(gate);
    this.element.dataset.app = JSON.stringify(this);
  }

  leaveGate(gate: Gate) {
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: Gate, globalPosition: PIXI.Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    gate.zIndex = 30;

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

  toJSON() {
    return {
      gatePalette: this.gatePalette,
      circuit: this.circuit || "",
    };
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
      const circuitStep = snapDropzone.parent.parent.parent;
      const circuitStepIndex = circuitStep.parent.children.indexOf(circuitStep);
      const dropzoneIndex = snapDropzone.parent.children.indexOf(snapDropzone);

      gate.snap(snapDropzone);
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
    this.grabbedGate.zIndex = 20;
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;
  }

  private maybeDeactivateGate(event: PIXI.FederatedPointerEvent) {
    if (event.target === this.pixiApp.stage) {
      this.activeGate?.deactivate();
    }
  }
}
