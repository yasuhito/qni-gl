import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { WriteGateMixin } from "./write-gate-mixin";

export class Write0Gate extends WriteGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  get label(): string {
    return "0";
  }

  get jsonLabel(): string {
    return "|0>";
  }
}
