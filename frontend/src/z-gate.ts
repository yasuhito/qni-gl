import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class ZGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "ZGate";
  static readonly iconPath = "./assets/Z.png";

  get label(): string {
    return "Z";
  }

  private get jsonLabel(): string {
    return "Z";
  }
}
