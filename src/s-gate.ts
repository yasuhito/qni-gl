import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class SGate extends SquareGateMixin(Gate) {
  static gateType = "SGate";
  static icon = PIXI.Texture.from("./assets/S.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"S"'
  }
}
