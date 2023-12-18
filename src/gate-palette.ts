import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { GateComponent } from "./gate-component";
import { GateSource } from "./gate-source";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";
import { SignalGate, SignalGateWithPosition } from "./gate-component";
import { spacingInPx } from "./util";

/**
 * 回路に配置できるゲートのパレット。ゲートは行単位で水平方向に並べられる。
 * @noInheritDoc
 */
export class GatePalette extends Container {
  /** @ignore 水平方向のパディング */
  static horizontalPadding = spacingInPx(6);
  /** @ignore 垂直方向のパディング */
  static verticalPadding = spacingInPx(4);
  /** @ignore ゲート間の隙間 */
  static gapBetweenGates = spacingInPx(2);
  /** @ignore パレットの角の丸み */
  static cornerRadius = spacingInPx(3);
  /** @ignore パレットの枠線の色 */
  static borderColor = tailwindColors.zinc["400"];
  /** @ignore パレットの背景色 */
  static backgroundColor = tailwindColors.white;

  /** ゲートをクリックした時に発生するシグナル */
  onGrabGate: SignalGateWithPosition;
  /** 新しいゲートを生成した時に発生するシグナル */
  onNewGate: SignalGate;
  /** ゲートからマウスポインタが離れた時に発生するシグナル */
  onMouseLeaveGate: SignalGate;

  protected graphics: PIXI.Graphics;
  protected gateClasses: (typeof GateComponent)[][] = [];
  protected gateRows: List;
  protected gates = {};

  constructor() {
    super();

    this.onNewGate = new Signal();
    this.onGrabGate = new Signal();
    this.onMouseLeaveGate = new Signal();

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.gateRows = new List({
      type: "vertical",
      elementsMargin: 8,
      vertPadding: GatePalette.verticalPadding,
      horPadding: GatePalette.horizontalPadding,
    });
    this.graphics.addChild(this.gateRows);

    this.newRow();
    this.redraw();
  }

  /**
   * パレットにゲートを追加する
   *
   * @param gateClass 追加するゲートのクラス
   */
  addGate(gateClass: typeof GateComponent): GateComponent {
    const currentRow =
      this.gateRows.children[this.gateRows.children.length - 1];

    const gateSource = new GateSource(gateClass);
    currentRow.addChild(gateSource);

    gateSource.onNewGate.connect((newGate) => {
      newGate.x = this.x + currentRow.x + gateSource.x;
      newGate.y = this.y + currentRow.y;
      this.onNewGate.emit(newGate);
    });

    const gate = gateSource.generateNewGate();
    gateSource.onGrabGate.connect((gate, globalPosition) => {
      this.onGrabGate.emit(gate, globalPosition);
    });

    gateSource.onMouseLeaveGate.connect((gate) => {
      this.onMouseLeaveGate.emit(gate);
    });

    // gateSource.enterGateRunner.add(this);

    this.gates[gate.gateType()] = gate;

    this.redraw();

    return gate;
  }

  /**
   * ゲートを並べる新しい行を追加する。
   */
  newRow() {
    const row = new List({
      type: "horizontal",
      elementsMargin: 8,
    });

    this.gateRows.addChild(row);
  }

  protected redraw(): void {
    this.graphics.clear();

    // this.gateRows のうち要素数が最も多いものの length を返す
    const maxRowLength = Math.max(
      ...this.gateRows.children.map((row) => row.children.length)
    );

    this.graphics.lineStyle(1, GatePalette.borderColor, 1, 0);
    this.graphics.beginFill(GatePalette.backgroundColor);
    this.graphics.drawRoundedRect(
      0,
      0,
      GateComponent.size * maxRowLength +
        GatePalette.gapBetweenGates * maxRowLength +
        GatePalette.horizontalPadding * 2 -
        GatePalette.gapBetweenGates,
      this.gateRows.height + GatePalette.verticalPadding * 2,
      GatePalette.cornerRadius
    );
    this.graphics.endFill();

    // TODO: dropshadow の定義を別ファイルに移動
    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      gates: this.gates,
    };
  }
}
