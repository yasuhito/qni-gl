import * as PIXI from "pixi.js";
import { Gate } from "./src/gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class RzGate extends SquareGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/Rz.svg");
}
