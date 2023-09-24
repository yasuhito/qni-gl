import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class XGate extends Gate {
  static cornerRadius = 9999;
  static icon = PIXI.Texture.from("./assets/X.svg");
}
