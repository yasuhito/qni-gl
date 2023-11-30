import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class HGate extends JsonableMixin(SquareGateMixin(Gate)) {
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
