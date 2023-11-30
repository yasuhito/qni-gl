import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { Gate } from "./gate";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class XGate extends JsonableMixin(CircularGateMixin(Gate)) {
  static gateType = "XGate";
  static icon = PIXI.Texture.from("./assets/X.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"X"';
  }
}
