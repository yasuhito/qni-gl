import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export class ControlGate extends Gate {
  static icon = PIXI.Texture.from("./assets/Control.svg");
  static iconHover = PIXI.Texture.from("./assets/Control_hover.svg");
  static iconGrabbed = PIXI.Texture.from("./assets/Control_grabbed.svg");
  static iconActive = PIXI.Texture.from("./assets/Control_active.svg");

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

  get style(): typeof ControlGate.style {
    return ControlGate.style;
  }

  applyIdleStyle() {
    this._sprite.texture = ControlGate.icon;

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    this._sprite.texture = ControlGate.iconHover;

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

    this.updateGraphics(
      this.style.hoverBodyColor,
      this.style.hoverBorderColor,
      this.style.hoverBorderWidth
    );
  }

  applyGrabbedStyle() {
    this._sprite.texture = ControlGate.iconGrabbed;

    this._shape.clear();
    this._shape.zIndex = 10;
    this._shape.cursor = "grabbing";

    this.updateGraphics(
      this.style.grabbedBodyColor,
      this.style.grabbedBorderColor,
      this.style.grabbedBorderWidth
    );
  }

  applyActiveStyle() {
    this._sprite.texture = ControlGate.iconActive;

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

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
      this._shape.lineStyle(borderWidth, borderColor, 1, 0);
    }
    if (bodyColor !== null) {
      this._shape.beginFill(bodyColor, 1);
    }
    this._shape.drawRoundedRect(
      0,
      0,
      Gate.size,
      Gate.size,
      this.style.cornerRadius
    );
    this._shape.endFill();
  }
}
