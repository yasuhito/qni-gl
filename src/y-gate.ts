import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class YGate extends SquareGateMixin(Gate) {
  static gateType = "YGate";
  static icon = PIXI.Texture.from("./assets/Y.svg");
}
