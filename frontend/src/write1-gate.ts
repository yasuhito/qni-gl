import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializedGate } from "./types";
import { WriteGateMixin } from "./write-gate-mixin";

export class Write1Gate extends JsonableMixin(
  WriteGateMixin(LabelableMixin(GateComponent))
) {
  static gateType = "Write1Gate";
  static readonly iconPath = "./assets/Write1.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|1>", targets: targetBits };
  }

  get label(): string {
    return "1";
  }

  toJSON() {
    return '"|1>"';
  }
}
