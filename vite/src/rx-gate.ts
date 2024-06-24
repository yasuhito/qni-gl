import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class RxGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "RxGate";
  static icon = PIXI.Texture.from("./assets/Rx.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"Rx"';
  }
}
