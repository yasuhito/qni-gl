import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class TDaggerGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "TDaggerGate";
  static readonly iconPath = "./assets/TDagger.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "T†", targets: targetBits };
  }

  toCircuitJSON() {
    return '"T†"';
  }
}
