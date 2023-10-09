import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { SquareGateMixin } from "./square-gate-mixin";

export class TDaggerGate extends SquareGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/TDagger.svg");
}
