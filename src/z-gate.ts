import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class ZGate extends JsonableMixin(SquareGateMixin(Gate)) {
  static gateType = "ZGate";
  static icon = PIXI.Texture.from("./assets/Z.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"Z"';
  }
}
