import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class SDaggerGate extends JsonableMixin(SquareGateMixin(Gate)) {
  static gateType = "SDaggerGate";
  static icon = PIXI.Texture.from("./assets/SDagger.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"S†"';
  }
}
