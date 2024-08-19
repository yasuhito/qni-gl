import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializedGate } from "./types";

export class SwapGate extends JsonableMixin(
  OutlinedGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "SwapGate";
  static readonly iconPath = "./assets/Swap.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Swap", targets: targetBits };
  }

  get label(): string {
    return "×";
  }

  toJSON() {
    return '"Swap"';
  }
}
