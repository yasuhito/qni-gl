import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class QFTDaggerGate extends SquareGateMixin(Gate) {
  static gateType = "QFTDaggerGate";
  static icon = PIXI.Texture.from("./assets/QFTDagger.svg");
}
