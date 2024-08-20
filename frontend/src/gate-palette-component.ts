import { Container, Graphics } from "pixi.js";
import { Colors } from "./colors";
import { GateComponent } from "./gate-component";
import { OperationSourceComponent } from "./operation-source-component";
import { List } from "@pixi/ui";
import { spacingInPx } from "./util";
import { DropShadowFilter } from "pixi-filters";
import { OperationClass } from "./operation";
import { OPERATION_SOURCE_EVENTS } from "./events";

export const GATE_PALETTE_EVENTS = {
  GATE_GRABBED: "gate-palette:grab-gate",
  MOUSE_LEAVE_GATE: "gate-palette:mouse-leave-gate",
  GATE_DISCARDED: "gate-palette:gate-discarded",
};

/**
 * 回路に配置できるゲートのパレット。ゲートは行単位で水平方向に並べられる。
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

  protected graphics: Graphics;
  protected gateClasses: typeof GateComponent[][] = [];
  protected gateRows: List;

  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.gateRows = new List({
      type: "vertical",
      elementsMargin: 8,
      vertPadding: GatePaletteComponent.verticalPadding,
      horPadding: GatePaletteComponent.horizontalPadding,
    });
    this.addChild(this.gateRows);

    this.newRow();
    this.redraw();
  }

  /**
   * パレットにゲートを追加する
   *
   * @param gateClass 追加するゲートのクラス
   */
  addGate(gateClass: OperationClass) {
    const currentRow =
      this.gateRows.children[this.gateRows.children.length - 1];

    const operationSource = new OperationSourceComponent(gateClass);
    currentRow.addChild(operationSource);

    operationSource.on(
      OPERATION_SOURCE_EVENTS.OPERATION_CREATED,
      (newOperation) => {
        this.emit("newGate", newOperation);
      }
    );

    const operation = operationSource.generateNewOperation();

    operationSource.on(
      OPERATION_SOURCE_EVENTS.OPERATION_GRABBED,
      (operation, globalPosition) => {
        this.emit("gate-palette:grab-gate", operation, globalPosition);
      }
    );
    operationSource.on(OPERATION_SOURCE_EVENTS.OPERATION_LEFT, (operation) => {
      this.emit("gate-palette:mouse-leave-gate", operation);
    });
    operationSource.on(
      OPERATION_SOURCE_EVENTS.OPERATION_DISCARDED,
      (operation) => {
        this.gates[operation.gateType] = null;
        this.emit("gate-palette:gate-discarded", operation);
      }
    );

    this.gates[operation.gateType] = operation;

    this.redraw();
  }

  /**
   * ゲートを並べる新しい行を追加する。
   */
  newRow() {
    const row = new List({
      type: "horizontal",
      elementsMargin: 8,
      horPadding: 0,
      vertPadding: 0,
    });

    this.gateRows.addChild(row);
  }

  protected redraw(): void {
    // this.gateRows のうち要素数が最も多いものの length を返す
    const maxRowLength = Math.max(
      ...this.gateRows.children.map((row) => row.children.length)
    );

    const width =
      GateComponent.sizeInPx.base * maxRowLength +
      GatePaletteComponent.gapBetweenGates * (maxRowLength - 1) +
      GatePaletteComponent.horizontalPadding * 2;
    const height =
      this.gateRows.height + GatePaletteComponent.verticalPadding * 2;

    this.graphics
      .clear()
      .roundRect(0, 0, width, height, GatePaletteComponent.cornerRadius)
      .fill(Colors["bg-component"])
      .stroke({ color: Colors["border-component"], width: 1 });

    // TODO: dropshadow の定義を別ファイルに移動
    this.graphics.filters = [
      new DropShadowFilter({
        offset: { x: 0, y: 4 },
        blur: 3,
        alpha: 0.07,
        resolution: window.devicePixelRatio,
      }),
      new DropShadowFilter({
        offset: { x: 0, y: 2 },
        blur: 2,
        alpha: 0.06,
        resolution: window.devicePixelRatio,
      }),
    ];
  }
}
