import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class YGate extends SquareGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "YGate";
  static readonly iconPath = "./assets/Y.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Y", targets: targetBits };
  }

  get label(): string {
    return "Y";
  }

  private get jsonLabel(): string {
    return "Y";
  }
}
