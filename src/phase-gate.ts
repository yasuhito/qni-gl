import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class PhaseGate extends JsonableMixin(CircularGateMixin(Gate)) {
  static gateType = "PhaseGate";
  static icon = PIXI.Texture.from("./assets/Phase.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"P"';
  }
}
