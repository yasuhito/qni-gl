import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";

export declare class Jsonable {
  toCircuitJSON(): string;
  gateChar(): string;
}

export function JsonableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Jsonable> & TBase {
  class JsonableMixinClass extends Base {
    toCircuitJSON() {
      throw new Error("Not implemented");
    }

    gateChar() {
      return "?";
    }
  }

  return JsonableMixinClass as Constructor<Jsonable> & TBase;
}
