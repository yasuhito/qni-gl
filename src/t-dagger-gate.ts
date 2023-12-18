import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class TDaggerGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "TDaggerGate";
  static icon = PIXI.Texture.from("./assets/TDagger.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  toCircuitJSON() {
    return '"T†"';
  }
}
