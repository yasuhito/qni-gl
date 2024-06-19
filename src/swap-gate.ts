import * as PIXI from "pixi.js";
import { Colors, ColorsOld } from "./colors";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class SwapGate extends JsonableMixin(GateComponent) {
  static gateType = "SwapGate";
  static icon = PIXI.Texture.from("./assets/Swap.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  applyIdleStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this._sprite.tint = ColorsOld.icon.gate.secondary;
  }

  applyHoverStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      ColorsOld.border.gate.hover,
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

    this._sprite.tint = ColorsOld.icon.gate.secondary;
  }

  applyGrabbedStyle() {
    this._shape.clear();

    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      ColorsOld.border.gate.grabbed,
      1,
      0
    );
    this._shape.beginFill(Colors["bg.brand.grabbed"], 1);
    this._shape.drawRoundedRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = ColorsOld.icon.gate.default;
  }

  applyActiveStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate[this.size],
      ColorsOld.border.gate.active,
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

    this._sprite.tint = ColorsOld.icon.gate.secondary;
  }

  toCircuitJSON() {
    return '"Swap"';
  }
}
