import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { SerializeableMixin } from "./serializeable-mixin";

export class ControlGate extends OutlinedGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(GateComponent)))
) {
  static gateType = "ControlGate";
  static readonly iconPath = "./assets/Control.png";

  get label(): string {
    return "@";
  }

  private get jsonLabel(): string {
    return "•";
  }

  protected get serializeType(): string {
    return "•";
  }
}
