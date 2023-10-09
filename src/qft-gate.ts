import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class QFTGate extends SquareGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/QFT.svg");
}
