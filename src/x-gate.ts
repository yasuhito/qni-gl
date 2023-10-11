import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { CircularGateMixin } from "./circular-gate-mixin";

export class XGate extends CircularGateMixin(Gate) {
  static gateType = "XGate";
  static icon = PIXI.Texture.from("./assets/X.svg");
}
