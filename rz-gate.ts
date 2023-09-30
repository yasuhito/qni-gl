import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class RzGate extends SquareGateMixin(Gate) {
  static gateType = "RzGate";
  static icon = PIXI.Texture.from("./assets/Rz.svg");
}
