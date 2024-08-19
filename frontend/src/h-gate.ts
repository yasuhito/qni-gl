import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class HGate extends JsonableMixin(
  SquareGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "HGate";
  static iconPath = "./assets/H.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "H", targets: targetBits };
  }

  get label(): string {
    return "H";
  }

  serialize(targetBits: number[]): SerializedGate {
    return { type: this.label, targets: targetBits };
  }

  toCircuitJSON() {
    return `"${this.label}"`;
  }
}
