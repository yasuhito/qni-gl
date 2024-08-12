import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class ZGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "ZGate";
  static readonly iconPath = "./assets/Z.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Z", targets: targetBits };
  }

  toCircuitJSON() {
    return '"Z"';
  }
}
