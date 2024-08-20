import { CircularGateMixin } from "./circular-gate-mixin";
import { OperationComponent } from "./operation-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { Spacing } from "./spacing";
import { SerializedGate } from "./types";

export class XGate extends CircularGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(OperationComponent)))
) {
  static readonly cornerRadius = Spacing.cornerRadius.full;

  private _controls: number[] = [];

  get label(): string {
    return "X";
  }

  serialize(targetBits: number[], controlBits?: number[]): SerializedGate {
    if (controlBits && controlBits.some((bit) => targetBits.includes(bit))) {
      throw new Error("Overlap detected between target bits and control bits.");
    }

    const serialized: SerializedGate = {
      type: this.serializeType,
      targets: targetBits,
    };

    if (controlBits && controlBits.length > 0) {
      serialized.controls = controlBits;
    }

    return serialized;
  }

  get controls() {
    return this._controls;
  }

  set controls(value: number[]) {
    this._controls = value.sort();
  }
}
