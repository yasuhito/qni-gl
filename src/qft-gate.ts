import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class QFTGate extends SquareGateMixin(Gate) {
  static gateType = "QFTGate";
  static icon = PIXI.Texture.from("./assets/QFT.svg", {
    scaleMode: PIXI.SCALE_MODES.NEAREST,
  });
}
