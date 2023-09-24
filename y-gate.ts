import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class YGate extends Gate {
  static icon = PIXI.Texture.from("./assets/Y.svg");

  static texture = {
    idle: PIXI.Texture.from("./assets/Y_idle.svg"),
    hover: PIXI.Texture.from("./assets/Y_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/Y_grabbed.svg"),
    active: PIXI.Texture.from("./assets/Y_active.svg"),
  };
}
