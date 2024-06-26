import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { Colors } from "./colors";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { GateComponent } from "./gate-component";
import { GateSourceComponent } from "./gate-source-component";
import { List } from "@pixi/ui";
import { spacingInPx } from "./util";

/**
 * 回路に配置できるゲートのパレット。ゲートは行単位で水平方向に並べられる。
 * @noInheritDoc
 */
export class GatePaletteComponent extends Container {
  /** @ignore 水平方向のパディング */
  static horizontalPadding = spacingInPx(6);
  /** @ignore 垂直方向のパディング */
  static verticalPadding = spacingInPx(4);
  /** @ignore ゲート間の隙間 */
  static gapBetweenGates = spacingInPx(2);
  /** @ignore パレットの角の丸み */
  static cornerRadius = spacingInPx(3);

  gates: { [key: string]: GateComponent | null } = {};

  protected graphics: PIXI.Graphics;
  protected gateClasses: typeof GateComponent[][] = [];
  protected gateRows: List;

  constructor() {
    super();

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.gateRows = new List({
      type: "vertical",
      elementsMargin: 8,
      vertPadding: GatePaletteComponent.verticalPadding,
      horPadding: GatePaletteComponent.horizontalPadding,
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
  addGate(gateClass: typeof GateComponent) {
    const currentRow =
      this.gateRows.children[this.gateRows.children.length - 1];

    const gateSource = new GateSourceComponent(gateClass);
    currentRow.addChild(gateSource);

    gateSource.on("newGate", (newGate) => {
      this.emit("newGate", newGate);
    });

    const gate = gateSource.generateNewGate();

    gateSource.on("grabGate", (gate, globalPosition) => {
      this.emit("grabGate", gate, globalPosition);
    });
    gateSource.on("mouseLeaveGate", (gate) => {
      this.emit("mouseLeaveGate", gate);
    });
    gateSource.on("gateDiscarded", (gate) => {
      this.gates[gate.gateType()] = null;
      this.emit("gateDiscarded", gate);
    });

    this.gates[gate.gateType()] = gate;

    this.redraw();
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

    this.graphics.lineStyle(1, Colors["border-component"], 1, 0);
    this.graphics.beginFill(Colors["bg-component"]);
    this.graphics.drawRoundedRect(
      0,
      0,
      GateComponent.sizeInPx.base * maxRowLength +
        GatePaletteComponent.gapBetweenGates * maxRowLength +
        GatePaletteComponent.horizontalPadding * 2 -
        GatePaletteComponent.gapBetweenGates,
      this.gateRows.height + GatePaletteComponent.verticalPadding * 2,
      GatePaletteComponent.cornerRadius
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
