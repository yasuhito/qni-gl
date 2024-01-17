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
  static bgColor = tailwindColors.white;
  static hoverBgColor = tailwindColors.purple[50];
  static grabbedBgColor = tailwindColors.white;
  static activeBgColor = tailwindColors.white;
  static radius = 9999;

  static style = {
    idleBodyColor: null,
    idleBorderColor: null,

    hoverBodyColor: null,
    hoverBorderColor: null,
    hoverBorderWidth: null,

    grabbedBodyColor: null,
    grabbedBorderColor: null,
    grabbedBorderWidth: null,

    activeBodyColor: null,
    activeBorderColor: null,
    activeBorderWidth: null,

    cornerRadius: null,
  };

  get style(): typeof BlochSphere.style {
    return BlochSphere.style;
  }

  applyIdleStyle() {
    super.applyIdleStyle();

    this.drawSphereLines();

    this._shape.lineStyle(1, tailwindColors.cyan[500], 1, 0);
    this._shape.beginFill(tailwindColors.cyan[500], 1);
    this._shape.drawCircle(this.sizeInPx / 2, this.sizeInPx / 2, 3);
    this._shape.endFill();
  }

  applyHoverStyle() {
    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    super.applyHoverStyle();
    this.drawSphereLines();

    this._shape.lineStyle(1, tailwindColors.cyan[500], 1, 0);
    this._shape.beginFill(tailwindColors.cyan[500], 1);
    this._shape.drawCircle(this.sizeInPx / 2, this.sizeInPx / 2, 3);
    this._shape.endFill();

    // this.updateGraphics(
    //   this.style.hoverBodyColor,
    //   this.style.hoverBorderColor,
    //   this.style.hoverBorderWidth
    // );
  }

  applyGrabbedStyle() {
    // this._sprite.texture = BlochSphere.iconGrabbed;

    this._shape.clear();
    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    super.applyGrabbedStyle();
    this.drawSphereLines();

    this._shape.lineStyle(1, tailwindColors.cyan[500], 1, 0);
    this._shape.beginFill(tailwindColors.cyan[500], 1);
    this._shape.drawCircle(this.sizeInPx / 2, this.sizeInPx / 2, 3);
    this._shape.endFill();

    // this.updateGraphics(
    //   this.style.grabbedBodyColor,
    //   this.style.grabbedBorderColor,
    //   this.style.grabbedBorderWidth
    // );
  }

  applyActiveStyle() {
    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    super.applyActiveStyle();
    this.drawSphereLines();

    this._shape.lineStyle(1, tailwindColors.cyan[500], 1, 0);
    this._shape.beginFill(tailwindColors.cyan[500], 1);
    this._shape.drawCircle(this.sizeInPx / 2, this.sizeInPx / 2, 3);
    this._shape.endFill();

    // this.updateGraphics(
    //   this.style.activeBodyColor,
    //   this.style.activeBorderColor,
    //   this.style.activeBorderWidth
    // );
  }

  toCircuitJSON() {
    return '"Bloch"';
  }

  private drawSphereLines() {
    const center = new PIXI.Point(this.sizeInPx / 2, this.sizeInPx / 2);
    const borderWidth = Spacing.borderWidth.gate[this.size];

    this._shape
      .lineStyle(1, tailwindColors.zinc[300], 1, 0)
      .moveTo(borderWidth, center.y)
      .lineTo(this.sizeInPx - borderWidth, center.y)
      .moveTo(center.x, borderWidth)
      .lineTo(center.x, this.sizeInPx - borderWidth)
      .drawEllipse(
        center.x,
        center.y,
        (this.sizeInPx - 2 * borderWidth) * 0.18,
        (this.sizeInPx - 2 * borderWidth) * 0.5
      )
      .drawEllipse(
        center.x,
        center.y,
        (this.sizeInPx - 2 * borderWidth) * 0.5,
        (this.sizeInPx - 2 * borderWidth) * 0.18
      );
  }
}
