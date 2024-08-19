import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { LabelableMixin } from "./labelable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

export class SDaggerGate extends SquareGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "SDaggerGate";
  static readonly iconPath = "./assets/SDagger.png";

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "S†", targets: targetBits };
  }

  get label(): string {
    return "S†";
  }

  private get jsonLabel(): string {
    return "S†";
  }
}
