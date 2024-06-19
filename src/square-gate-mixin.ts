import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { Spacing } from "./spacing";

export declare class SquareGate {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function SquareGateMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<SquareGate> & TBase {
  class SquareGateMixinClass extends Base {
    applyIdleStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "default";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors["border-onbrand"],
        1,
        0
      );
      this._shape.beginFill(Colors["bg-brand"], 1);
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
    }

    applyHoverStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "grab";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors["border-onbrand-hover"],
        1,
        0
      );
      this._shape.beginFill(Colors["bg-brand-hover"], 1);
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
    }

    applyGrabbedStyle() {
      this._shape.clear();

      this._shape.zIndex = 10;
      this._shape.cursor = "grabbing";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors["border-onbrand-grabbed"],
        1,
        0
      );
      this._shape.beginFill(Colors["bg-brand-grabbed"], 1);
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
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
      this._shape.beginFill(Colors["bg-brand"], 1);
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.gate
      );
      this._shape.endFill();
    }
  }

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
