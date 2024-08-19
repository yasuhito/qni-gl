import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class TDaggerGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "TDaggerGate";
  static readonly iconPath = "./assets/TDagger.png";

  get label(): string {
    return "T†";
  }

  private get jsonLabel(): string {
    return "T†";
  }

  protected get serializeType(): string {
    return "T†";
  }
}
