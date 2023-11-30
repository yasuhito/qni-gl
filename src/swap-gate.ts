import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { Spacing } from "./spacing";

export class SwapGate extends JsonableMixin(Gate) {
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

    this._sprite.tint = Colors.icon.gate.secondary;
  }

  applyHoverStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate,
      Colors.border.gate.hover,
      1,
      0
    );
    this._shape.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors.icon.gate.secondary;
  }

  applyGrabbedStyle() {
    this._shape.clear();

    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    this._shape.lineStyle(
      Spacing.borderWidth.gate,
      Colors.border.gate.grabbed,
      1,
      0
    );
    this._shape.beginFill(Colors.bg.brand.grabbed, 1);
    this._shape.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors.icon.gate.default;
  }

  applyActiveStyle() {
    this._shape.clear();

    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this._shape.lineStyle(
      Spacing.borderWidth.gate,
      Colors.border.gate.active,
      1,
      0
    );
    this._shape.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      Spacing.cornerRadius.gate
    );
    this._shape.endFill();

    this._sprite.tint = Colors.icon.gate.secondary;
  }

  toCircuitJSON() {
    return '"Swap"';
  }
}
