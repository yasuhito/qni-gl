import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { Dropzone } from "./dropzone";
import * as tailwindColors from "tailwindcss/colors";

export class MeasurementGate extends Gate {
  static gateType = "MeasurementGate";

  static icon = PIXI.Texture.from("./assets/Measurement.svg");
  static iconIdleDropzone = PIXI.Texture.from(
    "./assets/Measurement_idle_dropzone.svg"
  );
  static iconHover = PIXI.Texture.from("./assets/Measurement_hover.svg");
  static iconHoverDropzone = PIXI.Texture.from(
    "./assets/Measurement_hover_dropzone.svg"
  );
  static iconGrabbed = PIXI.Texture.from("./assets/Measurement_grabbed.svg");
  static iconGrabbedDropzone = PIXI.Texture.from(
    "./assets/Measurement_grabbed_dropzone.svg"
  );
  static iconActive = PIXI.Texture.from("./assets/Measurement_active.svg");

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

  get style(): typeof MeasurementGate.style {
    return MeasurementGate.style;
  }

  snap(dropzone: Dropzone) {
    super.snap(dropzone);
    this.sprite.texture = MeasurementGate.iconGrabbedDropzone;
  }

  unsnap() {
    super.unsnap();
    this.sprite.texture = MeasurementGate.iconGrabbed;
  }

  applyIdleStyle() {
    if (this.dropzone) {
      this.sprite.texture = MeasurementGate.iconIdleDropzone;
    } else {
      this.sprite.texture = MeasurementGate.icon;
    }

    this.graphics.clear();
    this.graphics.zIndex = 0;
    this.graphics.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    if (this.dropzone) {
      this.sprite.texture = MeasurementGate.iconHoverDropzone;
    } else {
      this.sprite.texture = MeasurementGate.iconHover;
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
    if (this.dropzone) {
      this.sprite.texture = MeasurementGate.iconGrabbedDropzone;
    } else {
      this.sprite.texture = MeasurementGate.iconGrabbed;
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
    this.sprite.texture = MeasurementGate.iconActive;

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
      MeasurementGate.size,
      MeasurementGate.size,
      this.style.cornerRadius
    );
    this.graphics.endFill();
  }
}
