import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class HGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "HGate";
  static iconPath = "./assets/H.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "H", targets: targetBits };
  }

  toCircuitJSON() {
    return `"${this.gateChar()}"`;
  }

  gateChar() {
    return "H";
  }
}
