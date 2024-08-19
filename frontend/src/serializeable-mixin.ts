import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { SerializedGate } from "./types";

export declare class Serializeable {
  get serializeType(): string;
  serialize(targetBits: number[]): SerializedGate;
}

export function SerializeableMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<Serializeable> & TBase {
  return class SerializeableMixinClass extends Base {
    get serializeType(): string {
      if (!("jsonLabel" in this) || typeof this.jsonLabel !== "string") {
        throw new Error("SerializeableMixin must be used with JsonableMixin");
      }

      return this.jsonLabel;
    }

    serialize(targetBits: number[]): SerializedGate {
      return { type: this.serializeType, targets: targetBits };
    }
  };
}
