import { Application, Container, Graphics, Point, Sprite, Texture } from "pixi.js";
import { CIRCUIT_EVENTS, CircuitComponent } from "./circuit-component";
import { CircuitStepComponent } from "./circuit-step-component";
import { Colors } from "./colors";
import { OPERATION_PALETTE_EVENTS } from "./events";
import { OperationComponent } from "./operation-component";
import { OperationPaletteComponent } from "./operation-palette-component";

export const CIRCUIT_FRAME_EVENTS = {
  PALETTE_GATE_GRABBED: "circuit-frame:grab-palette-gate",
  GRAB_CIRCUIT_GATE: "circuit-frame:grab-circuit-gate",
  MOUSE_LEAVE_PALETTE_GATE: "circuit-frame:mouse-leave-palette-gate",
  DISCARD_PALETTE_GATE: "circuit-frame:discard-palette-gate",
  ACTIVATE_CIRCUIT_STEP: "circuit-frame:activate-circuit-step",
};

const GATE_PALETTE_X = 40;
const GATE_PALETTE_Y = 64;

/**
 * 量子回路の表示用フレームを表すクラス。
 */
export class CircuitFrame extends Container {
  private static instance: CircuitFrame | null = null;

  readonly app: Application;
  readonly background: Graphics;
  readonly gatePalette: OperationPaletteComponent;
  readonly circuit: CircuitComponent;
  private maskSprite: Sprite;
  private scrollContainer: Container;

  /**
   * インスタンスを取得するメソッド
   * @param app - PIXI アプリケーションインスタンス
   * @param height - 初期のフレームの高さ
   */
  static getInstance(app: Application, height: number): CircuitFrame {
    if (this.instance === null) {
      this.instance = new CircuitFrame(app, height);
    }
    return this.instance;
  }

  private constructor(app: Application, height: number) {
    super();

    this.app = app;
    this.background = new Graphics();
    this.gatePalette = new OperationPaletteComponent();
    this.circuit = new CircuitComponent({ minWireCount: 2, stepCount: 5 });
    this.scrollContainer = new Container();

    this.addChildAt(this.background, 0);
    this.addChild(this.scrollContainer);
    this.addChild(this.gatePalette);
    this.gatePalette.zIndex = 2;
    this.scrollContainer.addChild(this.circuit);
    this.scrollContainer.zIndex = 1;

    // マスクの設定を変更
    this.maskSprite = new Sprite(Texture.WHITE);
    this.updateMask(height);
    this.scrollContainer.mask = this.maskSprite;
    this.addChild(this.maskSprite); // マスクをシーンに追加

    this.initBackground(height);
    this.initGatePalette();
    this.initCircuit();

    this.initScrollEvents();
  }

  /**
   * フレームのリサイズ処理
   * @param height - 新しいフレームの高さ
   */
  resize(height: number): void {
    this.background
      .clear()
      .rect(0, 0, this.app.screen.width, height)
      .fill(Colors["bg"]);

    this.updateMask(height);
  }

  /**
   * 背景の初期化処理
   * @param height - 初期のフレームの高さ
   */
  private initBackground(height: number): void {
    this.resize(height);
  }

  /**
   * ゲートパレットの初期化処理
   */
  private initGatePalette(): void {
    this.gatePalette.x = GATE_PALETTE_X;
    this.gatePalette.y = GATE_PALETTE_Y;

    this.gatePalette.on(
      OPERATION_PALETTE_EVENTS.OPERATION_GRABBED,
      this.grabPaletteGate,
      this
    );
    this.gatePalette.on(
      OPERATION_PALETTE_EVENTS.OPERATION_MOUSE_LEFT,
      this.emitMouseLeavePaletteGateEvent,
      this
    );
    this.gatePalette.on(
      OPERATION_PALETTE_EVENTS.OPERATION_DISCARDED,
      this.removeGrabbedPaletteGate,
      this
    );
  }

  private initCircuit() {
    this.circuit.x = this.gatePalette.x;
    this.circuit.y = 64 + this.gatePalette.height + 64;

    this.circuit.on(
      CIRCUIT_EVENTS.ACTIVATE_STEP,
      this.emitStepActivatedEvent,
      this
    );
    this.circuit.on(CIRCUIT_EVENTS.GATE_GRABBED, this.grabCircuitGate, this);
  }

  /**
   * パレット上のゲートを掴む
   * @param gate - ゲートコンポーネント
   * @param pointerPosition - ポインターの位置
   */
  private grabPaletteGate(
    gate: OperationComponent,
    pointerPosition: Point
  ): void {
    this.addChild(gate);
    this.emit(CIRCUIT_FRAME_EVENTS.PALETTE_GATE_GRABBED, gate, pointerPosition);
  }

  /**
   * パレット上のゲートからマウスが離れた時のイベントを発火
   */
  private emitMouseLeavePaletteGateEvent(): void {
    this.emit(CIRCUIT_FRAME_EVENTS.MOUSE_LEAVE_PALETTE_GATE);
  }

  /**
   * 掴んだパレットゲートを削除
   * @param gate - ゲートコンポーネント
   */
  private removeGrabbedPaletteGate(gate: OperationComponent): void {
    this.removeChild(gate);
    this.emit(CIRCUIT_FRAME_EVENTS.DISCARD_PALETTE_GATE, gate);
  }

  /**
   * 回路のステップがアクティブになったイベントを発火する処理
   * @param circuitStep - 回路ステップコンポーネント
   */
  private emitStepActivatedEvent(circuitStep: CircuitStepComponent): void {
    this.emit(
      CIRCUIT_FRAME_EVENTS.ACTIVATE_CIRCUIT_STEP,
      this.circuit,
      circuitStep
    );
  }

  /**
   * 回路上のゲートを掴む
   * @param gate - ゲートコンポーネント
   * @param pointerPosition - ポインターの位置
   */
  private grabCircuitGate(
    gate: OperationComponent,
    pointerPosition: Point
  ): void {
    this.emit(CIRCUIT_FRAME_EVENTS.GRAB_CIRCUIT_GATE, gate, pointerPosition);
  }

  /**
   * スクロールイベントの初期化
   */
  private initScrollEvents(): void {
    this.interactive = true;
    this.on("wheel", this.handleScroll, this);
  }

  /**
   * マスクの更新
   * @param height - 新しいマスクの高さ
   */
  private updateMask(height: number): void {
    this.maskSprite.width = this.app.screen.width;
    this.maskSprite.height = height;
    this.maskSprite.x = 0;
    this.maskSprite.y = 0;
  }

  /**
   * スクロール処理
   * @param event - ホイールイベント
   */
  private handleScroll(event: WheelEvent): void {
    if (this.circuit.y + this.circuit.height + 128 <= this.maskSprite.height) {
      return;
    }

    const deltaY = event.deltaY;
    this.scrollContainer.y -= deltaY;

    // スクロール範囲の制限
    if (this.scrollContainer.y > 0) {
      this.scrollContainer.y = 0;
    }

    const maxScrollY =
      this.circuit.height +
      this.gatePalette.height +
      256 -
      this.maskSprite.height;
    if (this.scrollContainer.y < -maxScrollY) {
      this.scrollContainer.y = -maxScrollY;
    }
  }
}
