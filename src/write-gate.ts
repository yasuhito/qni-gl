import * as PIXI from "pixi.js";
import { DropzoneComponent } from "./dropzone-component";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Colors } from "./colors";

/**
 * @noInheritDoc
 */
export class WriteGate extends JsonableMixin(GateComponent) {
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
    hoverBorderColor: Colors["border-hover"],
    hoverBorderWidth: 2,

    grabbedBodyColor: Colors["bg-active"],
    grabbedBorderColor: Colors["border-pressed"],
    grabbedBorderWidth: 1,

    activeBodyColor: null,
    activeBorderColor: Colors["border-active"],
    activeBorderWidth: 2,

    cornerRadius: 4,
  };

  get style(): typeof WriteGate.style {
    return WriteGate.style;
  }

  snap(dropzone: DropzoneComponent) {
    super.snap(dropzone);
    const klass = this.constructor as typeof WriteGate;
    this._sprite.texture = klass.iconGrabbedDropzone;
  }

  unsnap() {
    super.unsnap();
    const klass = this.constructor as typeof WriteGate;
    this._sprite.texture = klass.iconGrabbed;
  }

  applyIdleStyle() {
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this._sprite.texture = klass.iconIdleDropzone;
    } else {
      this._sprite.texture = klass.icon;
    }

    this._shape.clear();
    this._shape.zIndex = 0;
    // this._shape.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this._sprite.texture = klass.iconHoverDropzone;
    } else {
      this._sprite.texture = klass.iconHover;
    }

    this._shape.clear();
    this._shape.zIndex = 0;
    // this._shape.cursor = "grab";

    this.updateGraphics(
      this.style.hoverBodyColor,
      this.style.hoverBorderColor,
      this.style.hoverBorderWidth
    );
  }

  applyGrabbedStyle() {
    const klass = this.constructor as typeof WriteGate;

    if (this.dropzone) {
      this._sprite.texture = klass.iconGrabbedDropzone;
    } else {
      this._sprite.texture = klass.iconGrabbed;
    }

    this._shape.clear();
    this._shape.zIndex = 10;
    // this._shape.cursor = "grabbing";

    this.updateGraphics(
      this.style.grabbedBodyColor,
      this.style.grabbedBorderColor,
      this.style.grabbedBorderWidth
    );
  }

  applyActiveStyle() {
    const klass = this.constructor as typeof WriteGate;

    this._sprite.texture = klass.iconActive;

    this._shape.clear();
    this._shape.zIndex = 0;
    // this._shape.cursor = "grab";

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
}
