import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export class BlochSphere extends Gate {
  static icon = PIXI.Texture.from("./assets/BlochSphere.svg");
  static iconHover = PIXI.Texture.from("./assets/BlochSphere_hover.svg");
  static iconGrabbed = PIXI.Texture.from("./assets/BlochSphere_grabbed.svg");
  static iconActive = PIXI.Texture.from("./assets/BlochSphere_active.svg");

  static style = {
    idleBodyColor: null,
    idleBorderColor: null,

    hoverBodyColor: null,
    hoverBorderColor: null,
    hoverBorderWidth: null,

    grabbedBodyColor: null,
    grabbedBorderColor: null,
    grabbedBorderWidth: null,

    activeBodyColor: null,
    activeBorderColor: null,
    activeBorderWidth: null,

    cornerRadius: null,
  };

  get style(): typeof BlochSphere.style {
    return BlochSphere.style;
  }

  applyIdleStyle() {
    this.sprite.texture = BlochSphere.icon;

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    this.sprite.texture = BlochSphere.iconHover;

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
    this.sprite.texture = BlochSphere.iconGrabbed;

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
    this.sprite.texture = BlochSphere.iconActive;

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
    if (this.style.cornerRadius !== null) {
      this.graphics.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        this.style.cornerRadius
      );
    }
    this.graphics.endFill();
  }
}
