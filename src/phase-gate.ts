import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { CircularGateMixin } from "./circular-gate-mixin";

export class PhaseGate extends CircularGateMixin(Gate) {
  static icon = PIXI.Texture.from("./assets/Phase.svg");
}
