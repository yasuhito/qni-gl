import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class BlochSphere extends JsonableMixin(
  CircularGateMixin(GateComponent)
) {
  static gateType = "BlochSphere";

  // FIXME: 見た目の情報をまとめて static style 以下に移動する
  static bgColor = tailwindColors.white;
  static hoverBgColor = tailwindColors.purple[50];
  static grabbedBgColor = tailwindColors.white;
  static activeBgColor = tailwindColors.white;

  // FIXME: この値を消したときにブロッホ球に枠線が出ないようにする
  static radius = 9999;

  applyIdleStyle() {
    super.applyIdleStyle();
    this.drawSphereLines();
    this.drawVectorEnd();
  }

  applyHoverStyle() {
    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    super.applyHoverStyle();
    this.drawSphereLines();
    this.drawVectorEnd();
  }

  applyGrabbedStyle() {
    this._shape.clear();
    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    super.applyGrabbedStyle();
    this.drawSphereLines();
    this.drawVectorEnd();
  }

  applyActiveStyle() {
    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    super.applyActiveStyle();
    this.drawSphereLines();
    this.drawVectorEnd();
  }

  toCircuitJSON() {
    return '"Bloch"';
  }

  private drawSphereLines() {
    const borderWidth = Spacing.borderWidth.gate[this.size];

    // FIXME: tailwindColors.zinc[300] を定数化する
    this._shape
      .lineStyle(1, tailwindColors.zinc[300], 1, 0)
      .moveTo(borderWidth, this.center.y)
      .lineTo(this.sizeInPx - borderWidth, this.center.y)
      .moveTo(this.center.x, borderWidth)
      .lineTo(this.center.x, this.sizeInPx - borderWidth)
      .moveTo(this.sizeInPx * 0.35, this.sizeInPx * 0.65)
      .lineTo(this.sizeInPx * 0.65, this.sizeInPx * 0.35)
      .drawEllipse(
        this.center.x,
        this.center.y,
        (this.sizeInPx - 2 * borderWidth) * 0.18,
        (this.sizeInPx - 2 * borderWidth) * 0.5
      )
      .drawEllipse(
        this.center.x,
        this.center.y,
        (this.sizeInPx - 2 * borderWidth) * 0.5,
        (this.sizeInPx - 2 * borderWidth) * 0.18
      );
  }

  // FIXME: tailwindColors.cyan[500] を定数化する
  // FIXME: vectorEnd の半径 3 を定数化する
  private drawVectorEnd() {
    this._shape.lineStyle(1, tailwindColors.cyan[500], 1, 0);
    this._shape.beginFill(tailwindColors.cyan[500], 1);
    this._shape.drawCircle(this.center.x, this.center.y, 3);
    this._shape.endFill();
  }

  private get center() {
    return new PIXI.Point(this.sizeInPx / 2, this.sizeInPx / 2);
  }
}
