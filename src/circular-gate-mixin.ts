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
    static style = {
      bg: {
        default: Colors.bg.gate.default,
        hover: Colors.bg.gate.hover,
        grabbed: Colors.bg.gate.grabbed,
        active: Colors.bg.gate.active,
      },
    };

    applyIdleStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "default";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors.border.gate.idle,
        1,
        0
      );
      this._shape.beginFill(
        (this.constructor as typeof CircularGateMixinClass).style.bg.default,
        1
      );
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.full
      );
      this._shape.endFill();
    }

    applyHoverStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "grab";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors.border.gate.hover,
        1,
        0
      );
      this._shape.beginFill(
        (this.constructor as typeof CircularGateMixinClass).style.bg.hover,
        1
      );
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.full
      );
      this._shape.endFill();
    }

    applyGrabbedStyle() {
      this._shape.clear();

      this._shape.zIndex = 10;
      this._shape.cursor = "grabbing";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors.border.gate.grabbed,
        1,
        0
      );
      this._shape.beginFill(
        (this.constructor as typeof CircularGateMixinClass).style.bg.grabbed,
        1
      );
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.full
      );
      this._shape.endFill();
    }

    applyActiveStyle() {
      this._shape.clear();

      this._shape.zIndex = 0;
      this._shape.cursor = "grab";

      this._shape.lineStyle(
        Spacing.borderWidth.gate[this.size],
        Colors.border.gate.active,
        1,
        0
      );
      this._shape.beginFill(
        (this.constructor as typeof CircularGateMixinClass).style.bg.active,
        1
      );
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        Spacing.cornerRadius.full
      );
      this._shape.endFill();
    }
  }

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
