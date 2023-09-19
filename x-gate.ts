import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class XGate extends Gate {
  static idleTexture = PIXI.Texture.from("./assets/X_idle.svg");
  static hoverTexture = PIXI.Texture.from("./assets/X_hover.svg");
  static grabbedTexture = PIXI.Texture.from("./assets/X_grabbed.svg");
  static activeTexture = PIXI.Texture.from("./assets/X_active.svg");

  applyActiveStyle(): void {
    this.sprite.texture = XGate.activeTexture;
    this.sprite.cursor = "grab";
  }
}

// Scale mode for pixelation
XGate.idleTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.hoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.grabbedTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
XGate.activeTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
