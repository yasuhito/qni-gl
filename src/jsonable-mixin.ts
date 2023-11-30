import { Constructor } from "./constructor";
import { Gate } from "./gate";

export declare class Jsonable {
  toCircuitJSON(): string;
}

export function JsonableMixin<TBase extends Constructor<Gate>>(
  Base: TBase
): Constructor<Jsonable> & TBase {
  class JsonableMixinClass extends Base {
    toCircuitJSON() {
      throw new Error("Not implemented");
    }
  }

  return JsonableMixinClass as Constructor<Jsonable> & TBase;
}
