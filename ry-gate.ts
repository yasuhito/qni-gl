import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class RyGate extends SquareGateMixin(Gate) {
  static gateType = "RyGate";
  static icon = PIXI.Texture.from("./assets/Ry.svg");
}
