import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializedGate } from "./types";

export class ControlGate extends JsonableMixin(
  OutlinedGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "ControlGate";
  static readonly iconPath = "./assets/Control.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "•", targets: targetBits };
  }

  get label(): string {
    return "@";
  }

  toJSON() {
    return `"•"`;
  }
}
