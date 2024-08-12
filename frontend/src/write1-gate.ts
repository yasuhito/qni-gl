import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SerializedGate } from "./types";
import { WriteGateMixin } from "./write-gate-mixin";

/**
 * @noInheritDoc
 */
export class Write1Gate extends JsonableMixin(WriteGateMixin(GateComponent)) {
  static gateType = "Write1Gate";
  static readonly iconPath = "./assets/Write1.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|1>", targets: targetBits };
  }

  toCircuitJSON() {
    return '"|1>"';
  }

  gateChar() {
    return "1";
  }
}
