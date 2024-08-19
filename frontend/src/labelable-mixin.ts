import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { NotImplementedError } from "./not-implemented-error";

export declare class Labelable {
  get label(): string;
}

export function LabelableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Labelable> & TBase {
  class LabelableMixinClass extends Base {
    get label(): string {
      throw new NotImplementedError("label");
    }
  }

  return LabelableMixinClass as Constructor<Labelable> & TBase;
}
