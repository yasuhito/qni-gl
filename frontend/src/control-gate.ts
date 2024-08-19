import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializeableMixin } from "./serializeable-mixin";

export class ControlGate extends OutlinedGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  get label(): string {
    return "@";
  }

  get jsonLabel(): string {
    return "•";
  }
}
