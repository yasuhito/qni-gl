import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { NotImplementedError } from "./not-implemented-error";

export declare class Jsonable {
  toJSON(): string;
  gateChar(): string;
}

export function JsonableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Jsonable> & TBase {
  class JsonableMixinClass extends Base {
    private get jsonLabel(): string {
      throw new NotImplementedError("jsonLabel", this.constructor.name);
    }

    toJSON() {
      return `"${this.jsonLabel}"`;
    }

    gateChar() {
      return "?";
    }
  }

  return JsonableMixinClass as Constructor<Jsonable> & TBase;
}
