import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { DropzoneComponent } from "./dropzone-component";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class MeasurementGate extends JsonableMixin(GateComponent) {
  static gateType = "MeasurementGate";
  static icon = PIXI.Texture.from("./assets/Measurement.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
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

  snap(dropzone: DropzoneComponent) {
    super.snap(dropzone);
    this._sprite.texture = MeasurementGate.iconGrabbedDropzone;
  }

  unsnap() {
    super.unsnap();
    this._sprite.texture = MeasurementGate.iconGrabbed;
  }

  applyIdleStyle() {
    if (this.dropzone) {
      this._sprite.texture = MeasurementGate.iconIdleDropzone;
    } else {
      this._sprite.texture = MeasurementGate.icon;
    }

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    if (this.dropzone) {
      this._sprite.texture = MeasurementGate.iconHoverDropzone;
    } else {
      this._sprite.texture = MeasurementGate.iconHover;
    }

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
    if (this.dropzone) {
      this._sprite.texture = MeasurementGate.iconGrabbedDropzone;
    } else {
      this._sprite.texture = MeasurementGate.iconGrabbed;
    }

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
    this._sprite.texture = MeasurementGate.iconActive;

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "grab";

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
      this._shape.lineStyle(borderWidth, borderColor, 1, 0);
    }
    if (bodyColor !== null) {
      this._shape.beginFill(bodyColor, 1);
    }
    this._shape.drawRoundedRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      this.style.cornerRadius
    );
    this._shape.endFill();
  }

  toCircuitJSON() {
    return '"Measure"';
  }
}
