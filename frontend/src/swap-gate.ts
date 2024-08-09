import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class SwapGate extends JsonableMixin(OutlinedGateMixin(GateComponent)) {
  static gateType = "SwapGate";
  static readonly iconPath = "./assets/Swap.svg";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Swap", targets: targetBits };
  }

  toCircuitJSON() {
    return '"Swap"';
  }
}
