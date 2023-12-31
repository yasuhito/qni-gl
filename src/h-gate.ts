import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class HGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "HGate";
  static icon = PIXI.Texture.from("./assets/H.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"H"';
  }
}
