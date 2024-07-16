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

export const CIRCUIT_FRAME_EVENTS = {
  GRAB_PALETTE_GATE: "circuit-frame:grab-palette-gate",
  MOUSE_LEAVE_PALETTE_GATE: "circuit-frame:mouse-leave-palette-gate",
  PALETTE_GATE_DISCARDED: "circuit-frame:palette-gate-discarded",
};

/**
 * 量子回路の表示用フレームを表すクラス。
 */
export class CircuitFrame extends PIXI.Container {
  readonly app: PIXI.Application;
  readonly background: PIXI.Graphics;
  readonly gatePalette: GatePaletteComponent;
  private static readonly GATE_PALETTE_X = 40;
  private static readonly GATE_PALETTE_Y = 64;

  private static readonly PALETTE_FIRST_ROW_GATES = [
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

  private static readonly PALETTE_SECOND_ROW_GATES = [
    SwapGate,
    ControlGate,
    Write0Gate,
    Write1Gate,
    MeasurementGate,
  ];

  /**
   * コンストラクタ
   * @param app - PIXI アプリケーションインスタンス
   * @param height - 初期のフレームの高さ
   */
  constructor(app: PIXI.Application, height: number) {
    super();

    this.app = app;
    this.background = new PIXI.Graphics();
    this.gatePalette = new GatePaletteComponent();
    this.initBackground(height);
    this.initGatePalette();
    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
    this.addChild(this.gatePalette);
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
    this.gatePalette.x = CircuitFrame.GATE_PALETTE_X;
    this.gatePalette.y = CircuitFrame.GATE_PALETTE_Y;

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

    CircuitFrame.PALETTE_FIRST_ROW_GATES.forEach((gate) =>
      this.gatePalette.addGate(gate)
    );
    this.gatePalette.newRow();
    CircuitFrame.PALETTE_SECOND_ROW_GATES.forEach((gate) =>
      this.gatePalette.addGate(gate)
    );
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
    this.emit(CIRCUIT_FRAME_EVENTS.PALETTE_GATE_DISCARDED, gate);
  }
}
