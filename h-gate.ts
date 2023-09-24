import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class HGate extends Gate {
  static icon = PIXI.Texture.from("./assets/H.svg");

  static texture = {
    idle: PIXI.Texture.from("./assets/H_idle.svg"),
    hover: PIXI.Texture.from("./assets/H_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/H_grabbed.svg"),
    active: PIXI.Texture.from("./assets/H_active.svg"),
  };
}
