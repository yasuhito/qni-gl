import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class QFTDaggerGate extends SquareGateMixin(Gate) {
  static gateType = "QFTDaggerGate";
  static icon = PIXI.Texture.from("./assets/QFTDagger.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
}
