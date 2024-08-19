import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class YGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "YGate";
  static readonly iconPath = "./assets/Y.png";

  get label(): string {
    return "Y";
  }

  private get jsonLabel(): string {
    return "Y";
  }

  protected get serializeType(): string {
    return "Y";
  }
}
