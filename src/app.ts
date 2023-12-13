import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { AntiControlGate } from "./anti-control-gate";
import { BlochSphere } from "./bloch-sphere";
import { CircuitComponent } from "./circuit-component";
import { CircuitStep } from "./circuit-step";
import { Complex } from "@qni/common";
import { ControlGate } from "./control-gate";
import { Dropzone } from "./dropzone";
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
import { StateVectorComponent } from "./state-vector-component";
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

  declare worker: Worker;
  element: HTMLElement;
  activeGate: Gate | null = null;
  grabbedGate: Gate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  gatePalette: GatePalette;
  circuit: CircuitComponent;
  circuitSteps: CircuitStep[] = [];
  stateVectorComponent: StateVectorComponent;
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

    this.worker = new Worker("/serviceWorker.js");
    this.worker.addEventListener(
      "message",
      this.handleServiceWorkerMessage.bind(this)
    );

    // view, stage などをまとめた application を作成
    this.pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: 800,
      height: 600,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
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
    this.gatePalette.onMouseLeaveGate.connect(() => {
      this.mouseLeaveGate();
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

    this.circuit = new CircuitComponent({ minWireCount: 2, stepCount: 5 });
    this.circuit.x = this.gatePalette.x;
    this.circuit.y = 64 + this.gatePalette.height + 64;
    this.pixiApp.stage.addChild(this.circuit);
    this.element.dataset.app = JSON.stringify(this);

    this.circuit.onStepHover.connect(this.runSimulator.bind(this));
    this.circuit.onStepActivated.connect(this.runSimulator.bind(this));
    this.circuit.onGateSnapToDropzone.connect(this.runSimulator.bind(this));

    this.stateVectorComponent = new StateVectorComponent(
      this.circuit.qubitCountInUse
    );
    this.pixiApp.stage.addChild(this.stateVectorComponent);

    this.updateStateVectorComponentPosition();

    // 回路の最初のステップをアクティブにする
    // これによって、最初のステップの状態ベクトルが表示される
    this.circuit.steps[0].activate();

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");
  }

  private updateStateVectorComponentPosition() {
    this.stateVectorComponent.x =
      (this.screenWidth - this.stateVectorComponent.width) / 2;
    this.stateVectorComponent.y =
      this.screenHeight - 32 - this.stateVectorComponent.height;
  }

  protected handleServiceWorkerMessage(event: MessageEvent): void {
    if (!this.stateVectorComponent) {
      return;
    }

    const amplitudes = event.data.amplitudes;

    for (const ket in amplitudes) {
      const c = amplitudes[ket];
      const amplifier = new Complex(c[0], c[1]);
      const qubitCircle = this.stateVectorComponent.qubitCircles[ket];

      // FIXME: qubitCircle が undefined になることがある
      if (qubitCircle) {
        qubitCircle.probability = amplifier.abs() * 100;
        qubitCircle.phase = amplifier.phase();
      }
    }
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

  mouseLeaveGate() {
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: Gate, pointerPosition: PIXI.Point) {
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

    this.maybeAppendCircuitWire();
    // TODO: メソッドに切り出す
    this.element.dataset.app = JSON.stringify(this);
    this.updateStateVectorComponentQubitCount();
    this.updateStateVectorComponentPosition();
    this.runSimulator();

    for (const circuitStep of this.circuit.steps) {
      for (const each of circuitStep.dropzones) {
        if (
          each.isSnappable(
            gate,
            pointerPosition.x,
            pointerPosition.y,
            gate.width,
            gate.height
          )
        ) {
          dropzone = each;
          this.grabbedGate.click(pointerPosition, each);
        }
      }
    }

    gate.dropzone = dropzone;
    if (!gate.dropzone) {
      this.grabbedGate.click(pointerPosition, null);
    }

    this.pixiApp.stage.cursor = "grabbing";

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate.bind(this));
  }

  protected maybeAppendCircuitWire() {
    const firstStepWireCount = this.circuit.steps[0].wireCount;

    for (const each of this.circuit.steps) {
      if (each.wireCount !== firstStepWireCount) {
        throw new Error("All steps must have the same number of wires");
      }

      if (each.wireCount < this.circuit.maxWireCount) {
        each.appendNewDropzone();
      }
    }
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

  /**
   * globalPosition is the global position of the mouse/touch
   *
   * @param gate ゲート
   * @param pointerPosition マウス/タッチの位置
   */
  private moveGate(gate: Gate, pointerPosition: PIXI.Point) {
    let snapDropzone: Dropzone | null = null;

    for (const circuitStep of this.circuit.steps) {
      for (const dropzone of circuitStep.dropzones) {
        if (
          dropzone.isSnappable(
            gate,
            pointerPosition.x,
            pointerPosition.y,
            gate.width,
            gate.height
          )
        ) {
          snapDropzone = dropzone;
          gate.snapToDropzone(dropzone, pointerPosition);
        }
      }
    }

    if (
      snapDropzone &&
      (gate.dropzone === null || gate.dropzone !== snapDropzone)
    ) {
      gate.snap(snapDropzone);
      this.updateStateVectorComponentQubitCount();
      this.updateStateVectorComponentPosition();
      this.runSimulator();
    }

    if (gate.dropzone && !snapDropzone) {
      gate.unsnap();
    }

    gate.dropzone = snapDropzone;
    if (!gate.dropzone) {
      gate.move(pointerPosition);
    }
  }

  private releaseGate() {
    if (this.grabbedGate === null) {
      return;
    }

    // TODO: 以下の this.circuit... 以下と同様の粒度にする (関数に切り分ける)
    this.pixiApp.stage.cursor = "grab";
    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    this.grabbedGate.zIndex = 20;
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;

    this.circuit.removeUnusedUpperWires();

    this.updateStateVectorComponentQubitCount();
    this.updateStateVectorComponentPosition();
    this.runSimulator();
  }

  private updateStateVectorComponentQubitCount() {
    this.stateVectorComponent.qubitCount = this.circuit.qubitCountInUse;
  }

  private maybeDeactivateGate(event: PIXI.FederatedPointerEvent) {
    if (event.target === this.pixiApp.stage) {
      this.activeGate?.deactivate();
    }
  }

  protected runSimulator() {
    this.worker.postMessage({ qubitCount: this.circuit.qubitCountInUse });
  }
}
