import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";

export declare class Jsonable {
  get jsonLabel(): string;
  toJSON(): string;
}

export function JsonableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Jsonable> & TBase {
  class JsonableMixinClass extends Base {
    get jsonLabel(): string {
      if (!("label" in this) || typeof this.label !== "string") {
        throw new Error("JsonableMixin must be used with JsonableMixin");
      }

      return this.label;
    }

    toJSON() {
      return `"${this.jsonLabel}"`;
    }
  }

  return JsonableMixinClass as Constructor<Jsonable> & TBase;
}
