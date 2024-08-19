import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class SGate extends SquareGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "SGate";
  static readonly iconPath = "./assets/S.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "S", targets: targetBits };
  }

  get label(): string {
    return "S";
  }

  private get jsonLabel(): string {
    return "S";
  }
}
