import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class SGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "SGate";
  static icon = PIXI.Texture.from("./assets/S.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "S", targets: targetBits };
  }

  toCircuitJSON() {
    return '"S"';
  }
}
