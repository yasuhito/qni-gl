import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { CircularGateMixin } from "./circular-gate-mixin";

/**
 * @noInheritDoc
 */
export class PhaseGate extends CircularGateMixin(Gate) {
  static gateType = "PhaseGate";
  static icon = PIXI.Texture.from("./assets/Phase.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"P"'
  }
}
