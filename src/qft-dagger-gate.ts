import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class QFTDaggerGate extends JsonableMixin(SquareGateMixin(Gate)) {
  static gateType = "QFTDaggerGate";
  static icon = PIXI.Texture.from("./assets/QFTDagger.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"QFT†"';
  }
}
