import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class RnotGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "RnotGate";
  static icon = PIXI.Texture.from("./assets/Rnot.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "X^½", targets: targetBits };
  }

  toCircuitJSON() {
    return '"X^½"';
  }
}
