import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class ZGate extends Gate {
  static texture = {
    idle: PIXI.Texture.from("./assets/Z_idle.svg"),
    hover: PIXI.Texture.from("./assets/Z_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/Z_grabbed.svg"),
    active: PIXI.Texture.from("./assets/Z_active.svg"),
  };
}
