import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class TGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "TGate";
  static readonly iconPath = "./assets/T.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "T", targets: targetBits };
  }

  toCircuitJSON() {
    return '"T"';
  }
}
