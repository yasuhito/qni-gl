import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";

export declare class Labelable {
  get label(): string;
}

export function LabelableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Labelable> & TBase {
  class LabelableMixinClass extends Base {
    get label(): string {
      throw new Error("label getter must be implemented");
    }
  }

  return LabelableMixinClass as Constructor<Labelable> & TBase;
}
