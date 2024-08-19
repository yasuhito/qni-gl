import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { WriteGateMixin } from "./write-gate-mixin";

export class Write0Gate extends WriteGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "Write0Gate";
  static readonly iconPath = "./assets/Write0.png";

  get label(): string {
    return "0";
  }

  private get jsonLabel(): string {
    return "|0>";
  }
}
