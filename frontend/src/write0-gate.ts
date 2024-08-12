import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SerializedGate } from "./types";
import { WriteGateMixin } from "./write-gate-mixin";

export class Write0Gate extends JsonableMixin(WriteGateMixin(GateComponent)) {
  static gateType = "Write0Gate";
  static readonly iconPath = "./assets/Write0.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|0>", targets: targetBits };
  }

  toCircuitJSON() {
    return '"|0>"';
  }

  gateChar() {
    return "0";
  }
}
