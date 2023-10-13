import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

/**
 * @noInheritDoc
 */
export class HGate extends SquareGateMixin(Gate) {
  static gateType = "HGate";
  static icon = PIXI.Texture.from("./assets/H.svg");
}
