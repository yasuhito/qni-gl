import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class TGate extends SquareGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "TGate";
  static readonly iconPath = "./assets/T.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "T", targets: targetBits };
  }

  get label(): string {
    return "T";
  }

  private get jsonLabel(): string {
    return "T";
  }
}
