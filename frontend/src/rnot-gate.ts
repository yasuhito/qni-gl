import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class RnotGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "RnotGate";
  static readonly iconPath = "./assets/Rnot.png";

  get label(): string {
    return "√X";
  }

  private get jsonLabel(): string {
    return "X^½";
  }
}
