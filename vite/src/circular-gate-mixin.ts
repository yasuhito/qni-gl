import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { Spacing } from "./spacing";

export declare class CircularGate {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function CircularGateMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<CircularGate> & TBase {
  class CircularGateMixinClass extends Base {
    static cornerRadius = Spacing.cornerRadius.full;

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
        CircularGateMixinClass.cornerRadius
      );
      this._shape.endFill();
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
      this._shape.beginFill(Colors["bg-brand-hover"], 1);
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        CircularGateMixinClass.cornerRadius
      );
      this._shape.endFill();
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
        CircularGateMixinClass.cornerRadius
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
        CircularGateMixinClass.cornerRadius
      );
      this._shape.endFill();
    }
  }

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
