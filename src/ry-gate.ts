import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class RyGate extends JsonableMixin(SquareGateMixin(Gate)) {
  static gateType = "RyGate";
  static icon = PIXI.Texture.from("./assets/Ry.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"Ry"';
  }
}
