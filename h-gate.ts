import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class HGate extends Gate {
  static texture: { [key: string]: PIXI.Texture } = {
    idle: PIXI.Texture.from("./assets/H_idle.svg"),
    hover: PIXI.Texture.from("./assets/H_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/H_grabbed.svg"),
    active: PIXI.Texture.from("./assets/H_active.svg"),
  };
}

// Scale mode for pixelation
HGate.texture.idle.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.texture.hover.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.texture.grabbed.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.texture.active.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
