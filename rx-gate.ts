import * as PIXI from "pixi.js";
import { Gate } from "./src/gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class RxGate extends SquareGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/Rx.svg");
}
