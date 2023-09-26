import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export class AntiControlGate extends Gate {
  static icon = PIXI.Texture.from("./assets/AntiControl.svg");
  static iconHover = PIXI.Texture.from("./assets/AntiControl_hover.svg");
  static iconGrabbed = PIXI.Texture.from("./assets/AntiControl_grabbed.svg");
  static iconActive = PIXI.Texture.from("./assets/AntiControl_active.svg");

  static style = {
    idleBodyColor: null,
    idleBorderColor: null,

    hoverBodyColor: null,
    hoverBorderColor: tailwindColors.purple["500"],
    hoverBorderWidth: 2,

    grabbedBodyColor: tailwindColors.purple["500"],
    grabbedBorderColor: tailwindColors.purple["700"],
    grabbedBorderWidth: 1,

    activeBodyColor: null,
    activeBorderColor: tailwindColors.teal["300"],
    activeBorderWidth: 2,

    cornerRadius: 4,
  };

  get style(): typeof AntiControlGate.style {
    return AntiControlGate.style;
  }

  applyIdleStyle() {
    this.sprite.texture = AntiControlGate.icon;

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    this.sprite.texture = AntiControlGate.iconHover;

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "grab";

    this.updateGraphics(
      this.style.hoverBodyColor,
      this.style.hoverBorderColor,
      this.style.hoverBorderWidth
    );
  }

  applyGrabbedStyle() {
    this.sprite.texture = AntiControlGate.iconGrabbed;

    this.graphics.clear();
    this.graphics.zIndex = 10;
    this.graphics.cursor = "grabbing";

    this.updateGraphics(
      this.style.grabbedBodyColor,
      this.style.grabbedBorderColor,
      this.style.grabbedBorderWidth
    );
  }

  applyActiveStyle() {
    this.sprite.texture = AntiControlGate.iconActive;

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "grab";

    this.updateGraphics(
      this.style.activeBodyColor,
      this.style.activeBorderColor,
      this.style.activeBorderWidth
    );
  }

  private updateGraphics(
    bodyColor: string | null,
    borderColor: string | null,
    borderWidth: number | null = null
  ) {
    if (borderWidth !== null && borderColor !== null) {
      this.graphics.lineStyle(borderWidth, borderColor, 1, 0);
    }
    if (bodyColor !== null) {
      this.graphics.beginFill(bodyColor, 1);
    }
    this.graphics.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      this.style.cornerRadius
    );
    this.graphics.endFill();
  }
}
