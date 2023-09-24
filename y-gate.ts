import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class YGate extends Gate {
  static icon = PIXI.Texture.from("./assets/Y.svg");
}
