import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SerializedGate } from "./types";

export class XGate extends JsonableMixin(CircularGateMixin(GateComponent)) {
  static readonly gateType = "XGate";
  static readonly iconPath = "./assets/X.png";

  private _controls: number[] = [];

  static serialize(
    targetBits: number[],
    controlBits?: number[]
  ): SerializedGate {
    const serialized: SerializedGate = { type: "X", targets: targetBits };

    if (controlBits && controlBits.length > 0) {
      serialized.controls = controlBits;
    }
    return serialized;
  }

  get controls() {
    return this._controls;
  }

  set controls(value: number[]) {
    this._controls = value.sort();
  }

  toCircuitJSON() {
    return '"X"';
  }

  gateChar() {
    return "X";
  }
}
