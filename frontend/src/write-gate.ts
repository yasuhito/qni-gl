import { DropzoneComponent } from "./dropzone-component";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { Colors } from "./colors";
import { Texture } from "pixi.js";

export class WriteGate extends JsonableMixin(GateComponent) {
  static iconIdleDropzone = Texture.from("./assets/Placeholder.svg");
  static iconHover = Texture.from("./assets/Placeholder.svg");
  static iconHoverDropzone = Texture.from("./assets/Placeholder.svg");
  static iconGrabbed = Texture.from("./assets/Placeholder.svg");
  static iconGrabbedDropzone = Texture.from("./assets/Placeholder.svg");
  static iconActive = Texture.from("./assets/Placeholder.svg");

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
    this._shape.cursor = "default";

    // const klass = this.constructor as typeof WriteGate;

    // if (this.dropzone) {
    //   this._sprite.texture = klass.iconIdleDropzone;
    // } else {
    //   this._sprite.texture = klass.icon;
    // }

    this._shape.clear();
    // this._shape.zIndex = 0;

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
    this._shape.roundRect(
      0,
      0,
      this.sizeInPx,
      this.sizeInPx,
      this.style.cornerRadius
    );
    if (borderWidth !== null && borderColor !== null) {
      this._shape.stroke({ color: borderColor, width: borderWidth, alpha: 1 });
    }
    if (bodyColor !== null) {
      this._shape.fill(bodyColor);
    }
  }
}
