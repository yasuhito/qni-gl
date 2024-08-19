import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class TDaggerGate extends JsonableMixin(
  SquareGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "TDaggerGate";
  static readonly iconPath = "./assets/TDagger.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "T†", targets: targetBits };
  }

  get label(): string {
    return "T†";
  }

  toJSON() {
    return '"T†"';
  }
}
