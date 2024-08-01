import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class TGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "TGate";
  static icon = PIXI.Texture.from("./assets/T.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "T", targets: targetBits };
  }

  toCircuitJSON() {
    return '"T"';
  }
}
