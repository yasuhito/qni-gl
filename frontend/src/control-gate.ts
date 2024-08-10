import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class ControlGate extends JsonableMixin(
  OutlinedGateMixin(GateComponent)
) {
  static gateType = "ControlGate";
  static readonly iconPath = "./assets/Control.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "•", targets: targetBits };
  }

  toCircuitJSON() {
    return `"${this.gateChar()}"`;
  }

  gateChar() {
    return "•";
  }
}
