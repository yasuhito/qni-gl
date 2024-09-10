import { OperationComponent } from "./operation-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

export class TDaggerGate extends SquareGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(OperationComponent)))
) {
  get operationType(): string {
    return "TDaggerGate";
  }

  get label(): string {
    return "T†";
  }
}
