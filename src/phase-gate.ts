import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class PhaseGate extends JsonableMixin(CircularGateMixin(GateComponent)) {
  static gateType = "PhaseGate";
  static radius = 9999;
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
