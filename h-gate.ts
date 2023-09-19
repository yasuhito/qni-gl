import * as PIXI from "pixi.js";
import { Gate } from "./gate";

// デコレータで @gate と書くことで extends Gate を省略できるようにする
// https://zenn.dev/miruoon_892/articles/365675fa5343ed
export class HGate extends Gate {
  static texture = {
    idle: PIXI.Texture.from("./assets/H_idle.svg"),
    hover: PIXI.Texture.from("./assets/H_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/H_grabbed.svg"),
    active: PIXI.Texture.from("./assets/H_active.svg"),
  };
}
