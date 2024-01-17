import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import * as tailwindColors from "tailwindcss/colors";
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

  // static icon = PIXI.Texture.from("./assets/BlochSphere.svg", {
  //   resolution: window.devicePixelRatio,
  //   resourceOptions: {
  //     scale: window.devicePixelRatio,
  //   },
  // });
  static iconHover = PIXI.Texture.from("./assets/BlochSphere_hover.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
  static iconGrabbed = PIXI.Texture.from("./assets/BlochSphere_grabbed.svg");
  static iconActive = PIXI.Texture.from("./assets/BlochSphere_active.svg");

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

  private drawSphereLines() {
    const borderWidth = Spacing.borderWidth.gate[this.size];

    this._shape
      .lineStyle(1, tailwindColors.zinc[300], 1, 0)
      .moveTo(borderWidth, this.sizeInPx / 2)
      .lineTo(this.sizeInPx - borderWidth, this.sizeInPx / 2)
      .moveTo(this.sizeInPx / 2, borderWidth)
      .lineTo(this.sizeInPx / 2, this.sizeInPx - borderWidth)
      .drawEllipse(
        this.sizeInPx / 2,
        this.sizeInPx / 2,
        (this.sizeInPx - 2 * borderWidth) * 0.18,
        (this.sizeInPx - 2 * borderWidth) * 0.5
      )
      .drawEllipse(
        this.sizeInPx / 2,
        this.sizeInPx / 2,
        (this.sizeInPx - 2 * borderWidth) * 0.5,
        (this.sizeInPx - 2 * borderWidth) * 0.18
      );
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
    // this._sprite.texture = BlochSphere.iconActive;

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

  private updateGraphics(
    bodyColor: string | null,
    borderColor: string | null,
    borderWidth: number | null = null
  ) {
    if (borderWidth !== null && borderColor !== null) {
      this._shape.lineStyle(borderWidth, borderColor, 1, 0);
    }
    if (bodyColor !== null) {
      this._shape.beginFill(bodyColor, 1);
    }
    if (this.style.cornerRadius !== null) {
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        this.style.cornerRadius
      );
    }
    this._shape.endFill();
  }

  toCircuitJSON() {
    return '"Bloch"';
  }
}
