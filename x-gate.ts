import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class XGate extends Gate {
  static texture: { [key: string]: PIXI.Texture } = {
    idle: PIXI.Texture.from("./assets/X_idle.svg"),
    hover: PIXI.Texture.from("./assets/X_hover.svg"),
    grabbed: PIXI.Texture.from("./assets/X_grabbed.svg"),
    active: PIXI.Texture.from("./assets/X_active.svg"),
  };
}

// Scale mode for pixelation
XGate.texture.idle.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.texture.hover.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.texture.grabbed.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.texture.active.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
