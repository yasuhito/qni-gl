import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class XGate extends Gate {
  static texture = {
    idle: PIXI.Texture.from("./assets/X_idle.svg"),
    hover: PIXI.Texture.from("./assets/X_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/X_grabbed.svg"),
    active: PIXI.Texture.from("./assets/X_active.svg"),
  };
}
