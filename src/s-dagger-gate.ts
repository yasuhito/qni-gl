import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class SDaggerGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
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
