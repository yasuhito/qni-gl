import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class SDaggerGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "SDaggerGate";
  static readonly iconPath = "./assets/SDagger.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "S†", targets: targetBits };
  }

  toCircuitJSON() {
    return '"S†"';
  }
}
