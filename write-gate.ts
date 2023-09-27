import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export class WriteGate extends Gate {
  static iconIdleDropzone = PIXI.Texture.from("./assets/Placeholder.svg");
  static iconHover = PIXI.Texture.from("./assets/Placeholder.svg");
  static iconHoverDropzone = PIXI.Texture.from("./assets/Placeholder.svg");
  static iconGrabbed = PIXI.Texture.from("./assets/Placeholder.svg");
  static iconGrabbedDropzone = PIXI.Texture.from("./assets/Placeholder.svg");
  static iconActive = PIXI.Texture.from("./assets/Placeholder.svg");

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

  get style(): typeof WriteGate.style {
    return WriteGate.style;
  }

  snap() {
    const klass = this.constructor as typeof WriteGate;
    this.sprite.texture = klass.iconGrabbedDropzone;
  }

  unsnap() {
    const klass = this.constructor as typeof WriteGate;
    this.sprite.texture = klass.iconGrabbed;
  }

  applyIdleStyle() {
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this.sprite.texture = klass.iconIdleDropzone;
    } else {
      this.sprite.texture = klass.icon;
    }

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this.sprite.texture = klass.iconHoverDropzone;
    } else {
      this.sprite.texture = klass.iconHover;
    }

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
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this.sprite.texture = klass.iconGrabbedDropzone;
    } else {
      this.sprite.texture = klass.iconGrabbed;
    }

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
    const klass = this.constructor as typeof WriteGate;

    this.sprite.texture = klass.iconActive;

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "grab";

    this.updateGraphics(
      this.style.activeBodyColor,
      this.style.activeBorderColor,
      this.style.activeBorderWidth
    );
  }

  protected updateGraphics(
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
      WriteGate.size,
      WriteGate.size,
      this.style.cornerRadius
    );
    this.graphics.endFill();
  }
}
