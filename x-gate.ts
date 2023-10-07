import * as PIXI from "pixi.js";
import { Gate } from "./src/gate";
import { CircularGateMixin } from "./circular-gate-mixin";

export class XGate extends CircularGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/X.svg");
}
