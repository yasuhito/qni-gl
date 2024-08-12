import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class RnotGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "RnotGate";
  static readonly iconPath = "./assets/Rnot.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "X^½", targets: targetBits };
  }

  toCircuitJSON() {
    return '"X^½"';
  }
}
