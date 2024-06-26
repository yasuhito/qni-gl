import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class AntiControlGate extends JsonableMixin(GateComponent) {
  static gateType = "AntiControlGate";
  static icon = PIXI.Texture.from("./assets/AntiControl.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  applyIdleStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this._sprite.tint = Colors["icon-brand"];
  }

  applyHoverStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      Colors["border-hover"],
      1,
      0
    );
    this._shape.drawRoundedRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors["icon-brand"];
  }

  applyGrabbedStyle() {
    this._shape.clear();

    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      Colors["border-pressed"],
      1,
      0
    );
    this._shape.beginFill(Colors["bg-active"], 1);
    this._shape.drawRoundedRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors["icon-onbrand"];
  }

  applyActiveStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      Colors["border-active"],
      1,
      0
    );
    this._shape.drawRoundedRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors["icon-brand"];
  }

  toCircuitJSON() {
    return '"◦"';
  }

  // static iconHover = PIXI.Texture.from("./assets/AntiControl_hover.svg");
  // static iconGrabbed = PIXI.Texture.from("./assets/AntiControl_grabbed.svg");
  // static iconActive = PIXI.Texture.from("./assets/AntiControl_active.svg");

  // static style = {
  //   idleBodyColor: null,
  //   idleBorderColor: null,

  //   hoverBodyColor: null,
  //   hoverBorderColor: tailwindColors.purple["500"],
  //   hoverBorderWidth: 2,

  //   grabbedBodyColor: tailwindColors.purple["500"],
  //   grabbedBorderColor: tailwindColors.purple["700"],
  //   grabbedBorderWidth: 1,

  //   activeBodyColor: null,
  //   activeBorderColor: tailwindColors.teal["300"],
  //   activeBorderWidth: 2,

  //   cornerRadius: 4,
  // };

  // get style(): typeof AntiControlGate.style {
  //   return AntiControlGate.style;
  // }

  // applyIdleStyle() {
  //   this._sprite.texture = AntiControlGate.icon;

  //   this._shape.clear();
  //   this._shape.zIndex = 0;
  //   this._shape.cursor = "default";

  //   this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  // }

  // applyHoverStyle() {
  //   this._sprite.texture = AntiControlGate.iconHover;

  //   this._shape.clear();
  //   this._shape.zIndex = 0;
  //   this._shape.cursor = "grab";

  //   this.updateGraphics(
  //     this.style.hoverBodyColor,
  //     this.style.hoverBorderColor,
  //     this.style.hoverBorderWidth
  //   );
  // }

  // applyGrabbedStyle() {
  //   this._sprite.texture = AntiControlGate.iconGrabbed;

  //   this._shape.clear();
  //   this._shape.zIndex = 10;
  //   this._shape.cursor = "grabbing";

  //   this.updateGraphics(
  //     this.style.grabbedBodyColor,
  //     this.style.grabbedBorderColor,
  //     this.style.grabbedBorderWidth
  //   );
  // }

  // applyActiveStyle() {
  //   this._sprite.texture = AntiControlGate.iconActive;

  //   this._shape.clear();
  //   this._shape.zIndex = 0;
  //   this._shape.cursor = "grab";

  //   this.updateGraphics(
  //     this.style.activeBodyColor,
  //     this.style.activeBorderColor,
  //     this.style.activeBorderWidth
  //   );
  // }

  // private updateGraphics(
  //   bodyColor: string | null,
  //   borderColor: string | null,
  //   borderWidth: number | null = null
  // ) {
  //   if (borderWidth !== null && borderColor !== null) {
  //     this._shape.lineStyle(borderWidth, borderColor, 1, 0);
  //   }
  //   if (bodyColor !== null) {
  //     this._shape.beginFill(bodyColor, 1);
  //   }
  //   this._shape.drawRoundedRect(
  //     0,
  //     0,
  //     Gate.size,
  //     Gate.size,
  //     this.style.cornerRadius
  //   );
  //   this._shape.endFill();
  // }
}
