import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { NotImplementedError } from "./not-implemented-error";
import { SerializedGate } from "./types";

export declare class Serializeable {
  serialize(targetBits: number[]): SerializedGate;
}

export function SerializeableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Serializeable> & TBase {
  return class SerializeableMixinClass extends Base {
    serialize(targetBits: number[]): SerializedGate {
      return { type: this.serializeType, targets: targetBits };
    }

    protected get serializeType(): string {
      throw new NotImplementedError("serializeType", this.constructor.name);
    }
  };
}
