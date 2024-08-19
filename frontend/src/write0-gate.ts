import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SerializedGate } from "./types";
import { WriteGateMixin } from "./write-gate-mixin";

export class Write0Gate extends WriteGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "Write0Gate";
  static readonly iconPath = "./assets/Write0.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|0>", targets: targetBits };
  }

  get label(): string {
    return "0";
  }

  private get jsonLabel(): string {
    return "|0>";
  }
}
