import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class QFTGate extends JsonableMixin(SquareGateMixin(Gate)) {
  static gateType = "QFTGate";
  static icon = PIXI.Texture.from("./assets/QFT.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"QFT"';
  }
}
