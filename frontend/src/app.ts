import { Circuit } from "./circuit";
import { CircuitFrame } from "./circuit-frame";
import { CircuitStep } from "./circuit-step";
import { Colors } from "./colors";
import { Complex } from "@qni/common";
import { Dropzone } from "./dropzone";
import { FrameDivider } from "./frame-divider";
import { OperationComponent } from "./operation-component";
import { List } from "@pixi/ui";
import { MeasurementGate } from "./measurement-gate";
import { StateVectorComponent } from "./state-vector-component";
import { StateVectorFrame } from "./state-vector-frame";
import { OperationPalette } from "./operation-palette";
import { logger, rectIntersect } from "./util";
import {
  Application,
  Assets,
  FederatedPointerEvent,
  Point,
  Renderer,
} from "pixi.js";
import {
  CIRCUIT_FRAME_EVENTS,
  FRAME_DIVIDER_EVENTS,
  OPERATION_EVENTS,
} from "./events";

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
  verticalFrameLayout!: List;
  circuitFrame!: CircuitFrame;
  stateVectorFrame!: StateVectorFrame;
  frameDivider!: FrameDivider;

  activeGate: OperationComponent | null = null;
  grabbedGate: OperationComponent | null = null;
  app: Application;
  circuitSteps: CircuitStep[] = [];
  nameMap = new Map();

  public static get instance(): App {
    if (!this._instance) {
      this._instance = new App(this.elementId);
    }

    // 自身が持つインスタンスを返す
    return this._instance;
  }

  get gatePalette(): OperationPalette {
    return this.circuitFrame!.operationPalette;
  }

  get circuit(): Circuit {
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

    const serviceWorkerUrl =
      import.meta.env.MODE === "production"
        ? "/service-worker.js"
        : "/dev-sw.js?dev-sw";
    this.worker = new Worker(serviceWorkerUrl, {
      type: import.meta.env.MODE === "production" ? "classic" : "module",
    });
    this.worker.addEventListener(
      "message",
      this.handleServiceWorkerMessage.bind(this)
    );

    // view, stage などをまとめた application を作成
    this.app = new Application<Renderer<HTMLCanvasElement>>();
    this.initApp().then(() => {
      window.addEventListener("resize", this.resize.bind(this), false);

      el.appendChild(this.app.canvas);

      // stage: 画面に表示するオブジェクトたちの入れ物
      this.app.stage.eventMode = "static";
      this.app.stage.hitArea = this.app.screen;
      this.app.stage.sortableChildren = true;
      this.app.stage
        .on("pointerup", this.releaseGate, this) // マウスでクリックを離した、タッチパネルでタッチを離した
        .on("pointerupoutside", this.releaseGate, this) // 描画オブジェクトの外側でクリック、タッチを離した
        .on("pointerdown", this.maybeDeactivateGate, this);

      this.setupFrames();

      // 回路の最初のステップをアクティブにする
      // これによって、最初のステップの状態ベクトルが表示される
      this.circuit.fetchStep(0).activate();

      this.nameMap.set(this.app.stage, "stage");

      // テスト用
      window.pixiApp = this;
    });
  }

  private setupFrames() {
    this.verticalFrameLayout = new List({
      type: "vertical",
    });
    this.app.stage.addChild(this.verticalFrameLayout);

    this.circuitFrame = CircuitFrame.initialize(
      this.app.screen.width,
      this.app.screen.height * 0.6
    );
    this.verticalFrameLayout.addChild(this.circuitFrame);

    this.stateVectorFrame = StateVectorFrame.initialize(
      this.app.screen.width,
      this.app.screen.height * 0.4
    );
    this.verticalFrameLayout.addChild(this.stateVectorFrame);

    this.frameDivider = FrameDivider.initialize({
      width: this.app.screen.width,
      initialY: this.circuitFrame.height,
    });
    this.app.stage.addChild(this.frameDivider);

    this.setupFrameDividerEventHandlers();
    this.setupCircuitFrameEventHandlers();
  }

  private setupFrameDividerEventHandlers() {
    this.frameDivider.on(
      FRAME_DIVIDER_EVENTS.DRAG_STARTED,
      this.startFrameDividerDragging,
      this
    );
    this.app.stage.on("pointermove", this.maybeUpdateFrames, this);
    this.app.stage.on("pointerup", this.endFrameDividerDragging, this);
    this.app.stage.on("pointerupoutside", this.endFrameDividerDragging, this);
  }

  private startFrameDividerDragging() {
    this.circuitFrame.cursor = "ns-resize";
    this.stateVectorFrame.cursor = "ns-resize";
  }

  private maybeUpdateFrames(event: FederatedPointerEvent) {
    if (!this.frameDivider.isDragging) return;

    this.frameDivider.move(event.global.y, this.app.screen.height);

    // 上下フレームの更新
    this.circuitFrame.resize(this.app.screen.width, this.frameDivider.y);
    this.stateVectorFrame.repositionAndResize(
      this.frameDivider.y + this.frameDivider.height,
      this.app.screen.width,
      this.app.screen.height - this.frameDivider.y
    );
  }

  private endFrameDividerDragging() {
    this.frameDivider.endDragging();
    this.circuitFrame.cursor = "default";
    this.stateVectorFrame.cursor = "default";
  }

  private setupCircuitFrameEventHandlers() {
    this.circuitFrame.on(
      CIRCUIT_FRAME_EVENTS.PALETTE_OPERATION_GRABBED,
      this.grabGate,
      this
    );
    this.circuitFrame.on(
      CIRCUIT_FRAME_EVENTS.PALETTE_OPERATION_MOUSE_LEFT,
      this.resetCursor,
      this
    );
    this.circuitFrame.on(
      CIRCUIT_FRAME_EVENTS.PALETTE_OPERATION_DISCARDED,
      this.gateDiscarded,
      this
    );

    this.circuitFrame.on(
      CIRCUIT_FRAME_EVENTS.CIRCUIT_STEP_ACTIVATED,
      this.runSimulator,
      this
    );
    this.circuitFrame.on(
      CIRCUIT_FRAME_EVENTS.CIRCUIT_OPERATION_GRABBED,
      this.grabGate,
      this
    );
  }

  private async initApp() {
    await this.app.init({
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

  private gateDiscarded(gate: OperationComponent) {
    this.activeGate = null;
    this.grabbedGate = null;
    this.circuitFrame!.removeChild(gate);
    this.circuit.update();
    if (this.circuit.activeStepIndex === null) {
      this.circuit.fetchStep(0).activate();
    }
    this.updateStateVectorComponentQubitCount();
    this.runSimulator();
  }

  protected handleServiceWorkerMessage(event: MessageEvent): void {
    if (!this.stateVector) {
      return;
    }

    const stepIndex = event.data.step;
    const step = this.circuit.fetchStep(stepIndex);

    if (event.data.measuredBits) {
      for (const [bit, value] of Object.entries(event.data.measuredBits)) {
        // もし value が '' | 0 | 1 でない場合はエラー
        if (value !== "" && value !== 0 && value !== 1) {
          throw new Error("value is not '' | 0 | 1");
        }

        const qubitCount = this.circuit.highestOccupiedQubitNumber;
        const dropzone = step.fetchDropzone(parseInt(bit));
        const measurementGate = dropzone.operation;

        if (measurementGate) {
          if (!(measurementGate instanceof MeasurementGate)) {
            console.log(`target_bit: ${qubitCount - parseInt(bit) - 1}`);
            console.log(event.data);
            throw new Error(`${measurementGate} is not MeasurementGate`);
          }
          measurementGate.value = value;
        }
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
    return this.app.screen.width;
  }

  get screenHeight(): number {
    return this.app.screen.height;
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.renderer.resize(width, height);

    this.frameDivider.updateWidth(this.app.screen.width);

    this.stateVectorFrame.repositionAndResize(
      this.frameDivider.y + this.frameDivider.height,
      this.app.screen.width,
      this.app.screen.height - this.frameDivider.y
    );
  }

  private grabGate(gate: OperationComponent, pointerPosition: Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.activeGate = gate;
    this.grabbedGate = gate;

    this.grabbedGate.on(OPERATION_EVENTS.DISCARDED, (gate) => {
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
    this.app.stage.cursor = "grabbing";

    this.app.stage.on("pointermove", this.maybeMoveGate, this);
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
    gate: OperationComponent,
    gateCenterX: number,
    gateCenterY: number,
    gateWidth: number,
    gateHeight: number,
    dropzone: Dropzone
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
      dropzone.gateSize / 4 +
      ((1 - snapRatio) * dropzone.gateSize) / 2;
    const snapzoneY =
      dropboxPosition.y + ((1 - snapRatio) * dropzone.gateSize * 1.5) / 2;
    const snapzoneWidth = dropzone.gateSize * snapRatio;
    const snapzoneHeight = dropzone.gateSize * snapRatio;

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
  private moveGate(gate: OperationComponent, pointerPosition: Point) {
    let snapDropzone: Dropzone | null = null;

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

  private unsnapGateFromDropzone(gate: OperationComponent) {
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
    this.app.stage.off("pointermove", this.maybeMoveGate);
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;

    this.circuit.update();

    this.updateStateVectorComponentQubitCount();
    this.runSimulator();
  }

  private resetCursor() {
    this.app.stage.cursor = "default";
  }

  private updateStateVectorComponentQubitCount() {
    this.stateVector.qubitCount = this.circuit.highestOccupiedQubitNumber;
  }

  private maybeDeactivateGate(event: FederatedPointerEvent) {
    if (event.target === this.app.stage) {
      this.activeGate?.deactivate();
    }
  }

  protected runSimulator() {
    // ページの <div id="app"></div> を
    // <div id="app" data-state="running"></div> に変更
    this.element.dataset.state = "running";

    logger.log(this.circuit.toString());

    this.worker.postMessage({
      circuitJson: this.circuit.toJSON(),
      qubitCount: this.circuit.highestOccupiedQubitNumber,
      untilStepIndex: this.circuit.activeStepIndex,
      amplitudeIndices: this.stateVector.visibleQubitCircleIndices,
      steps: this.circuit.serialize(),
    });
  }
}
