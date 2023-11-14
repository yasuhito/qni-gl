import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { Gate } from "./gate";
import { Spacing } from "./spacing";

export declare class SquareGate {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function SquareGateMixin<TBase extends Constructor<Gate>>(
  Base: TBase
): Constructor<SquareGate> & TBase {
  class SquareGateMixinClass extends Base {
    applyIdleStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "default";

      this._shape.lineStyle(
        Spacing.borderWidth.gate,
        Colors.border.gate.idle,
        1,
        0
      );
      this._shape.beginFill(Colors.bg.brand.default, 1);
      this._shape.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
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
      this._shape.beginFill(Colors.bg.brand.hover, 1);
      this._shape.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
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
      this._shape.beginFill(Colors.bg.brand.active, 1);
      this._shape.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
    }
  }

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
