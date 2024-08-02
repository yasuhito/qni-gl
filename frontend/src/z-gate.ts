import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { SquareGateMixin } from "./square-gate-mixin";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class ZGate extends JsonableMixin(SquareGateMixin(GateComponent)) {
  static gateType = "ZGate";
  static icon = PIXI.Texture.from("./assets/Z.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Z", targets: targetBits };
  }

  toCircuitJSON() {
    return '"Z"';
  }
}
