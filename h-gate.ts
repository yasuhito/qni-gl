import * as PIXI from "pixi.js";
import { Gate } from "./gate";

export class HGate extends Gate {
  static idleTexture = PIXI.Texture.from("./assets/H_idle.svg");
  static hoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
  static grabbedTexture = PIXI.Texture.from("./assets/H_grabbed.svg");
  static activeTexture = PIXI.Texture.from("./assets/H_active.svg");

  applyActiveStyle(): void {
    this.sprite.texture = HGate.activeTexture;
    this.sprite.cursor = "grab";
  }
}

// Scale mode for pixelation
HGate.idleTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.hoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.grabbedTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.activeTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
