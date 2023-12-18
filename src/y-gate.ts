import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class YGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "YGate";
  static icon = PIXI.Texture.from("./assets/Y.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"Y"';
  }
}
