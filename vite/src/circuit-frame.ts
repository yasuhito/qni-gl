import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { ControlGate } from "./control-gate";
import { GateComponent } from "./gate-component";
import {
  GATE_PALETTE_EVENTS,
  GatePaletteComponent,
} from "./gate-palette-component";
import { HGate } from "./h-gate";
import { MeasurementGate } from "./measurement-gate";
import { RnotGate } from "./rnot-gate";
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
import { CIRCUIT_EVENTS, CircuitComponent } from "./circuit-component";
import { CircuitStepComponent } from "./circuit-step-component";

export const CIRCUIT_FRAME_EVENTS = {
  GRAB_PALETTE_GATE: "circuit-frame:grab-palette-gate",
  GRAB_CIRCUIT_GATE: "circuit-frame:grab-circuit-gate",
  MOUSE_LEAVE_PALETTE_GATE: "circuit-frame:mouse-leave-palette-gate",
  DISCARD_PALETTE_GATE: "circuit-frame:discard-palette-gate",
  ACTIVATE_CIRCUIT_STEP: "circuit-frame:activate-circuit-step",
};

const GATE_PALETTE_X = 40;
const GATE_PALETTE_Y = 64;

const PALETTE_FIRST_ROW_GATES = [
  HGate,
  XGate,
  YGate,
  ZGate,
  RnotGate,
  SGate,
  SDaggerGate,
  TGate,
  TDaggerGate,
];

const PALETTE_SECOND_ROW_GATES = [
  SwapGate,
  ControlGate,
  Write0Gate,
  Write1Gate,
  MeasurementGate,
];

/**
 * 量子回路の表示用フレームを表すクラス。
 */
export class CircuitFrame extends PIXI.Container {
  private static instance: CircuitFrame | null = null;

  readonly app: PIXI.Application;
  readonly background: PIXI.Graphics;
  readonly gatePalette: GatePaletteComponent;
  readonly circuit: CircuitComponent;

  /**
   * インスタンスを取得するメソッド
   * @param app - PIXI アプリケーションインスタンス
   * @param height - 初期のフレームの高さ
   */
  static getInstance(app: PIXI.Application, height: number): CircuitFrame {
    if (this.instance === null) {
      this.instance = new CircuitFrame(app, height);
    }
    return this.instance;
  }

  private constructor(app: PIXI.Application, height: number) {
    super();

    this.app = app;
    this.background = new PIXI.Graphics();
    this.gatePalette = new GatePaletteComponent();
    this.circuit = new CircuitComponent({ minWireCount: 2, stepCount: 5 });

    this.initBackground(height);
    this.initGatePalette();
    this.initCircuit();

    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
    this.addChild(this.gatePalette);
    this.addChild(this.circuit);
  }

  /**
   * フレームのリサイズ処理
   * @param height - 新しいフレームの高さ
   */
  resize(height: number): void {
    this.background.clear();

    this.background.beginFill(Colors["bg"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();
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
      GATE_PALETTE_EVENTS.GRAB_GATE,
      this.grabPaletteGate,
      this
    );
    this.gatePalette.on(
      GATE_PALETTE_EVENTS.MOUSE_LEAVE_GATE,
      this.emitMouseLeavePaletteGateEvent,
      this
    );
    this.gatePalette.on(
      GATE_PALETTE_EVENTS.GATE_DISCARDED,
      this.removeGrabbedPaletteGate,
      this
    );

    PALETTE_FIRST_ROW_GATES.forEach((gate) => this.gatePalette.addGate(gate));
    this.gatePalette.newRow();
    PALETTE_SECOND_ROW_GATES.forEach((gate) => this.gatePalette.addGate(gate));
  }

  private initCircuit() {
    this.circuit.x = this.gatePalette.x;
    this.circuit.y = 64 + this.gatePalette.height + 64;

    this.circuit.on(
      CIRCUIT_EVENTS.ACTIVATE_STEP,
      this.emitStepActivatedEvent,
      this
    );
    this.circuit.on(CIRCUIT_EVENTS.GRAB_GATE, this.grabCircuitGate, this);
  }

  /**
   * パレット上のゲートを掴む
   * @param gate - ゲートコンポーネント
   * @param pointerPosition - ポインターの位置
   */
  private grabPaletteGate(
    gate: GateComponent,
    pointerPosition: PIXI.Point
  ): void {
    this.addChild(gate);
    this.emit(CIRCUIT_FRAME_EVENTS.GRAB_PALETTE_GATE, gate, pointerPosition);
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
  private removeGrabbedPaletteGate(gate: GateComponent): void {
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
    gate: GateComponent,
    pointerPosition: PIXI.Point
  ): void {
    this.emit(CIRCUIT_FRAME_EVENTS.GRAB_CIRCUIT_GATE, gate, pointerPosition);
  }
}
