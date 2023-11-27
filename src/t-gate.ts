import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class TGate extends SquareGateMixin(Gate) {
  static gateType = "TGate";
  static icon = PIXI.Texture.from("./assets/T.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"T"'
  }
}
