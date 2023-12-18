import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class RzGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "RzGate";
  static icon = PIXI.Texture.from("./assets/Rz.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"Rz"';
  }
}
