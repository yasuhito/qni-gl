import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class RnotGate extends Gate {
  static texture = {
    idle: PIXI.Texture.from("./assets/Rnot_idle.svg"),
    hover: PIXI.Texture.from("./assets/Rnot_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/Rnot_grabbed.svg"),
    active: PIXI.Texture.from("./assets/Rnot_active.svg"),
  };
}
