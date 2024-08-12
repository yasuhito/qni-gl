import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { GateShapeConfig } from "./types";
import { Spacing } from "./spacing";
import {
  GateStyleMixin,
  GateStyle,
  GateStyleConstructor,
} from "./gate-style-mixin";

export declare class CircularGate extends GateStyle {}

export function CircularGateMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<CircularGate> & TBase & GateStyleConstructor {
  const GateStyleBase = GateStyleMixin(Base);

  return class CircularGateMixinClass extends GateStyleBase {
    static SHAPE_CONFIG: GateShapeConfig = {
      cornerRadius: Spacing.cornerRadius.full,
      strokeAlignment: 0.5,
    };
  };
}
