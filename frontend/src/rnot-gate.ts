import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class RnotGate extends SquareGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "RnotGate";
  static readonly iconPath = "./assets/Rnot.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "X^½", targets: targetBits };
  }

  get label(): string {
    return "√X";
  }

  private get jsonLabel(): string {
    return "X^½";
  }
}
