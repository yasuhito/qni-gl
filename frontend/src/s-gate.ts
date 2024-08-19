import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class SGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "SGate";
  static readonly iconPath = "./assets/S.png";

  get label(): string {
    return "S";
  }

  private get jsonLabel(): string {
    return "S";
  }
}
