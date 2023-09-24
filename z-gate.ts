import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class ZGate extends Gate {
  static icon = PIXI.Texture.from("./assets/Z.svg");
}
