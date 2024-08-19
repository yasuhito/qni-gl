import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class ZGate extends JsonableMixin(
  SquareGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "ZGate";
  static readonly iconPath = "./assets/Z.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Z", targets: targetBits };
  }

  get label(): string {
    return "Z";
  }

  toCircuitJSON() {
    return '"Z"';
  }
}
