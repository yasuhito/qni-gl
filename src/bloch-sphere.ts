import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Spacing } from "./spacing";
import { Colors } from "./colors";

/**
 * @noInheritDoc
 */
export class BlochSphere extends JsonableMixin(
  CircularGateMixin(GateComponent)
) {
  static gateType = "BlochSphere";

  // FIXME: 見た目の情報をまとめて static style 以下に移動する
  static bgColor = Colors.bg.blochSphere.body.default;
  static hoverBgColor = Colors.bg.blochSphere.body.hover;
  static grabbedBgColor = Colors.bg.blochSphere.body.grabbed;
  static activeBgColor = Colors.bg.blochSphere.body.active;

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

    this._shape
      .lineStyle(1, Colors.bg.blochSphere.lines, 1, 0)
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

  private drawVectorEnd() {
    this._shape.lineStyle(1, Colors.bg.blochSphere.vectorEnd.inactive, 1, 0);
    this._shape.beginFill(Colors.bg.blochSphere.vectorEnd.inactive, 1);
    this._shape.drawCircle(
      this.center.x,
      this.center.y,
      Spacing.size.blochSphere.vectorEnd / 2
    );
    this._shape.endFill();
  }

  private get center() {
    return new PIXI.Point(this.sizeInPx / 2, this.sizeInPx / 2);
  }
}
