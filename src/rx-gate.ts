import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class RxGate extends SquareGateMixin(Gate) {
  static gateType = "RxGate";
  static icon = PIXI.Texture.from("./assets/Rx.svg");
}
