import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { CircularGateMixin } from "./circular-gate-mixin";

/**
 * @noInheritDoc
 */
export class XGate extends CircularGateMixin(Gate) {
  static gateType = "XGate";
  static icon = PIXI.Texture.from("./assets/X.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
}
