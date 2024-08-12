import { CircuitComponent } from "./circuit-component";
import { CIRCUIT_FRAME_EVENTS, CircuitFrame } from "./circuit-frame";
import { CircuitStepComponent } from "./circuit-step-component";
import { Colors } from "./colors";
import { Complex } from "@qni/common";
import { DropzoneComponent } from "./dropzone-component";
import { FrameDivider } from "./frame-divider";
import { GateComponent } from "./gate-component";
import { List } from "@pixi/ui";
import { MeasurementGate } from "./measurement-gate";
import { StateVectorComponent } from "./state-vector-component";
import { StateVectorFrame } from "./state-vector-frame";
import { GatePaletteComponent } from "./gate-palette-component";
import { rectIntersect } from "./util";
import { STATE_VECTOR_EVENTS } from "./state-vector-events";
import {
  Application,
  Assets,
  FederatedPointerEvent,
  Point,
  Renderer,
} from "pixi.js";

declare global {
  interface Window {
    pixiApp?: App;
  }
}

export class App {
  static elementId = "app";
  private static _instance: App;

  declare worker: Worker;

  element: HTMLElement;
  mainContainer: List = new List({
    type: "vertical",
  });
  circuitFrame!: CircuitFrame;
  stateVectorFrame: StateVectorFrame | null = null;
  frameDivider: FrameDivider | null = null;

  activeGate: GateComponent | null = null;
  grabbedGate: GateComponent | null = null;
  pixiApp: Application;
  circuitSteps: CircuitStepComponent[] = [];
  nameMap = new Map();

  public static get instance(): App {
    if (!this._instance) {
      this._instance = new App(this.elementId);
    }

    // 自身が持つインスタンスを返す
    return this._instance;
  }

  get gatePalette(): GatePaletteComponent {
    return this.circuitFrame!.gatePalette;
  }

  get circuit(): CircuitComponent {
    return this.circuitFrame!.circuit;
  }

  get stateVector(): StateVectorComponent {
    return this.stateVectorFrame!.stateVector;
  }

  constructor(elementId: string) {
    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );

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
    this.pixiApp = new Application<Renderer<HTMLCanvasElement>>();
    this.initApp().then(() => {
      // this.pixiApp.stage = new Stage();

      window.addEventListener("resize", this.resize.bind(this), false);
      this.resize();

      el.appendChild(this.pixiApp.canvas);

      // stage: 画面に表示するオブジェクトたちの入れ物
      this.pixiApp.stage.eventMode = "static";
      this.pixiApp.stage.hitArea = this.pixiApp.screen;
      this.pixiApp.stage.sortableChildren = true;
      this.pixiApp.stage
        .on("pointerup", this.releaseGate, this) // マウスでクリックを離した、タッチパネルでタッチを離した
        .on("pointerupoutside", this.releaseGate, this) // 描画オブジェクトの外側でクリック、タッチを離した
        .on("pointerdown", this.maybeDeactivateGate, this);

      this.mainContainer = new List({
        type: "vertical",
      });
      this.mainContainer.sortableChildren = true;
      this.pixiApp.stage.addChild(this.mainContainer);

      this.circuitFrame = CircuitFrame.getInstance(
        this.pixiApp,
        this.pixiApp.screen.height * 0.6
      );
      this.mainContainer.addChild(this.circuitFrame);

      this.stateVectorFrame = StateVectorFrame.getInstance(
        this.pixiApp.screen.width,
        this.pixiApp.screen.height * 0.4
      );
      this.mainContainer.addChild(this.stateVectorFrame);

      // 量子回路と状態ベクトルの境界線
      this.frameDivider = FrameDivider.initialize(
        this.pixiApp,
        this.circuitFrame.height
      );
      this.pixiApp.stage.addChild(this.frameDivider);

      this.pixiApp.stage.on("pointermove", () => {
        if (!this.frameDivider!.isDragging) return;

        // 上下フレームの更新
        this.circuitFrame!.resize(this.frameDivider!.y);
        this.stateVectorFrame!.repositionAndResize(
          this.frameDivider!.y + this.frameDivider!.height,
          this.pixiApp.screen.width,
          this.pixiApp.screen.height - this.frameDivider!.y
        );
      });

      this.circuitFrame.on(
        CIRCUIT_FRAME_EVENTS.PALETTE_GATE_GRABBED,
        this.grabGate,
        this
      );
      this.circuitFrame.on(
        CIRCUIT_FRAME_EVENTS.MOUSE_LEAVE_PALETTE_GATE,
        this.resetCursor,
        this
      );
      this.circuitFrame.on(
        CIRCUIT_FRAME_EVENTS.DISCARD_PALETTE_GATE,
        this.gateDiscarded,
        this
      );

      this.circuitFrame.on(
        CIRCUIT_FRAME_EVENTS.ACTIVATE_CIRCUIT_STEP,
        this.runSimulator,
        this
      );
      this.circuitFrame.on(
        CIRCUIT_FRAME_EVENTS.GRAB_CIRCUIT_GATE,
        this.grabGate,
        this
      );

      this.stateVector.on(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        this.runSimulator,
        this
      );

      // 回路の最初のステップをアクティブにする
      // これによって、最初のステップの状態ベクトルが表示される
      this.circuit.stepAt(0).activate();

      this.nameMap.set(this.pixiApp.stage, "stage");

      // テスト用
      window.pixiApp = this;
    });
  }

  private async initApp() {
    await this.pixiApp.init({
      resizeTo: window,
      resolution: window.devicePixelRatio,
      preference: "webgpu",
      antialias: true,
      autoDensity: true,
      backgroundColor: Colors["bg"],
      preserveDrawingBuffer: true,
    });

    await Assets.init({
      texturePreference: { resolution: window.devicePixelRatio },
    });
  }

  private gateDiscarded(gate: GateComponent) {
    this.activeGate = null;
    this.grabbedGate = null;
    this.circuitFrame!.removeChild(gate);
    this.circuit.update();
    if (this.circuit.activeStepIndex === null) {
      this.circuit.stepAt(0).activate();
    }
    this.updateStateVectorComponentQubitCount();
    this.runSimulator();
  }

  protected handleServiceWorkerMessage(event: MessageEvent): void {
    if (!this.stateVector) {
      return;
    }

    const stepIndex = event.data.step;
    const step = this.circuit.stepAt(stepIndex);

    if (event.data.measuredBits) {
      for (const [bit, value] of Object.entries(event.data.measuredBits)) {
        // もし value が '' | 0 | 1 でない場合はエラー
        if (value !== "" && value !== 0 && value !== 1) {
          throw new Error("value is not '' | 0 | 1");
        }

        const qubitCount = this.circuit.qubitCountInUse;
        // TODO: ビットオーダーの変換をサービスワーカ側で行う
        // フロントエンドからは Qni のビットオーダ (上が下位) しか意識しなくて良いようにする
        const dropzone = step.fetchDropzoneByIndex(
          qubitCount - parseInt(bit) - 1
        );
        const measurementGate = dropzone.operation;

        // もし measurementGate が MeasurementGate でない場合はエラー
        if (!(measurementGate instanceof MeasurementGate)) {
          throw new Error(`${measurementGate} is not MeasurementGate`);
        }
        measurementGate.value = value;
      }
    }

    const amplitudes = event.data.amplitudes;
    if (amplitudes) {
      this.updateStateVectorAmplitudes(amplitudes);
    }

    // ページの <div id="app" data-state="running"></div> を
    // <div id="app" data-state="idle"></div> に変更
    const eventType = event.data.type;
    if (eventType === "finish") {
      this.element.dataset.state = "idle";
    }
  }

  private updateStateVectorAmplitudes(amplitudes: {
    [key: number]: [number, number];
  }) {
    for (const [index, [real, imag]] of Object.entries(amplitudes)) {
      const qubitCircle = this.stateVector.qubitCircleAt(parseInt(index));

      if (qubitCircle) {
        const amplitude = new Complex(real, imag);
        qubitCircle.probability = Math.pow(amplitude.abs(), 2) * 100;
        qubitCircle.phase = amplitude.phase();
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

    if (this.frameDivider) {
      this.frameDivider.updateWidth();
    }

    if (this.stateVectorFrame) {
      this.stateVectorFrame.repositionAndResize(
        this.frameDivider!.y + this.frameDivider!.height,
        this.pixiApp.screen.width,
        this.pixiApp.screen.height - this.frameDivider!.y
      );
    }
  }

  private grabGate(gate: GateComponent, pointerPosition: Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.activeGate = gate;
    this.grabbedGate = gate;

    this.grabbedGate.on("discarded", (gate) => {
      this.activeGate = null;
      this.grabbedGate = null;
      this.circuitFrame!.removeChild(gate);
      // this.pixiApp.stage.removeChild(gate);
    });

    // this.dropzones についてループを回す
    // その中で、dropzone が snappable かどうかを判定する
    let dropzone;

    this.circuit.maybeAppendWire();

    this.updateStateVectorComponentQubitCount();

    for (const circuitStep of this.circuit.steps) {
      for (const each of circuitStep.dropzones) {
        if (
          this.isSnappable(
            gate,
            pointerPosition.x,
            pointerPosition.y,
            gate.width,
            gate.height,
            each
          )
        ) {
          dropzone = each;
          this.grabbedGate.click(pointerPosition, each);
        }
      }
    }

    if (dropzone) {
      dropzone.addChild(gate);
    } else {
      this.grabbedGate.click(pointerPosition, null);
    }

    // TODO: メソッド化
    this.pixiApp.stage.cursor = "grabbing";

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate, this);
  }

  /**
   * 指定したゲートがドロップゾーンにスナップできるかどうかを返す。
   *
   *        x+size/4+((1-snapRatio)*size)/2,
   *        y+size/4+((1-snapRatio)*size)/2
   *                  │
   *        x+size/4  │
   *              │   │
   *     x,y      ▼   │
   *       ┌──────┬───┼──────────────────────────┬──────┐  ┬
   *       │      │   ▼                          │      │  │
   *       │      │   ┏━━━━━━━━━━━━━━━━━━━━━━━┓  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃       snapzone        ┃  │      │  │  size
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┃                       ┃  │      │  │
   *       │      │   ┗━━━━━━━━━━━━━━━━━━━━━━━┛  │      │  │
   *       │      │                              │      │  │
   *       └──────┴──────────────────────────────┴──────┘  ┴
   *
   *              ├──────────────────────────────┤
   *                            size
   *
   * @param gateCenterX ゲート中心の x 座標
   * @param gateCenterY ゲート中心の y 座標
   * @param gateWidth ゲートの幅
   * @param gateHeight ゲートの高さ
   */
  private isSnappable(
    gate: GateComponent,
    gateCenterX: number,
    gateCenterY: number,
    gateWidth: number,
    gateHeight: number,
    dropzone: DropzoneComponent
  ) {
    if (dropzone.operation !== null && dropzone.operation !== gate) {
      return false;
    }

    const snapRatio = 0.5;
    const gateX = gateCenterX - gateWidth / 2;
    const gateY = gateCenterY - gateHeight / 2;
    const dropboxPosition = dropzone.getGlobalPosition();
    const snapzoneX =
      dropboxPosition.x +
      dropzone.size / 4 +
      ((1 - snapRatio) * dropzone.size) / 2;
    const snapzoneY = dropboxPosition.y + ((1 - snapRatio) * dropzone.size) / 2;
    const snapzoneWidth = dropzone.size * snapRatio;
    const snapzoneHeight = dropzone.size * snapRatio;

    return rectIntersect(
      gateX,
      gateY,
      gateWidth,
      gateHeight,
      snapzoneX,
      snapzoneY,
      snapzoneWidth,
      snapzoneHeight
    );
  }

  private maybeMoveGate(event: FederatedPointerEvent) {
    if (this.grabbedGate === null) {
      return;
    }

    this.moveGate(this.grabbedGate, event.global);
  }

  /**
   * pointerPosition is the global position of the mouse/touch
   *
   * @param gate ゲート
   * @param pointerPosition マウス/タッチの位置
   */
  private moveGate(gate: GateComponent, pointerPosition: Point) {
    let snapDropzone: DropzoneComponent | null = null;

    for (const circuitStep of this.circuit.steps) {
      for (const dropzone of circuitStep.dropzones) {
        if (
          this.isSnappable(
            gate,
            pointerPosition.x,
            pointerPosition.y,
            gate.width,
            gate.height,
            dropzone
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
    }

    if (gate.dropzone && !snapDropzone) {
      this.unsnapGateFromDropzone(gate);
    }

    // gate.dropzone = snapDropzone;
    if (snapDropzone) {
      snapDropzone.addChild(gate);
    } else {
      gate.move(pointerPosition);
    }
  }

  private unsnapGateFromDropzone(gate: GateComponent) {
    gate.unsnap();
    this.circuitFrame!.addChild(gate);
    // this.pixiApp.stage.addChild(gate);
  }

  private releaseGate() {
    if (this.grabbedGate === null) {
      return;
    }

    // TODO: 以下の this.circuit... 以下と同様の粒度にする (関数に切り分ける)
    this.resetCursor();
    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    // this.grabbedGate.parentLayer = this.gateLayer;
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;

    this.circuit.update();

    this.updateStateVectorComponentQubitCount();
    this.runSimulator();
  }

  private resetCursor() {
    this.pixiApp.stage.cursor = "default";
  }

  private updateStateVectorComponentQubitCount() {
    this.stateVector.qubitCount = this.circuit.qubitCountInUse;
  }

  private maybeDeactivateGate(event: FederatedPointerEvent) {
    if (event.target === this.pixiApp.stage) {
      this.activeGate?.deactivate();
    }
  }

  protected runSimulator() {
    // ページの <div id="app"></div> を
    // <div id="app" data-state="running"></div> に変更
    this.element.dataset.state = "running";

    this.worker.postMessage({
      circuitJson: this.circuit.toCircuitJSON(),
      qubitCount: this.circuit.qubitCountInUse,
      stepIndex: this.circuit.activeStepIndex,
      targets: this.stateVector.visibleQubitCircleIndices,
      steps: this.circuit.serialize(),
    });
  }
}
