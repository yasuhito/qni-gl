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
  static idleIcon = {
    "": PIXI.Texture.from("./assets/Measurement.svg"),
    0: PIXI.Texture.from("./assets/Measurement_value0.svg"),
    1: PIXI.Texture.from("./assets/Measurement_value1.svg"),
  };
  static hoverIcon = {
    "": PIXI.Texture.from("./assets/Measurement_hover.svg"),
    0: PIXI.Texture.from("./assets/Measurement_value0.svg"),
    1: PIXI.Texture.from("./assets/Measurement_value1.svg"),
  }
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
  _value: "" | 0 | 1 = "";

  set value(newValue) {
    this._value = newValue;
    this._sprite.texture = MeasurementGate.idleIcon[this.value];
    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  get value(): "" | 0 | 1 {
    return this._value;
  }

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
      this._sprite.texture = MeasurementGate.idleIcon[this.value];
    } else {
      this._sprite.texture = MeasurementGate.idleIcon[""];
    }

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    if (this.dropzone) {
      this._sprite.texture = MeasurementGate.hoverIcon[this.value];
    } else {
      this._sprite.texture = MeasurementGate.hoverIcon[""];
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
