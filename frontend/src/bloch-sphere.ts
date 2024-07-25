import * as PIXI from "pixi.js";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class BlochSphere extends JsonableMixin(GateComponent) {
  static gateType = "BlochSphere";
  static icon = PIXI.Texture.from("./assets/BlochSphere.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
  static iconHover = PIXI.Texture.from("./assets/BlochSphere_hover.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });
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
    this._sprite.texture = BlochSphere.icon;

    this._shape.clear();
    this._shape.zIndex = 0;
    this._shape.cursor = "default";

    this.updateGraphics(this.style.idleBodyColor, this.style.idleBorderColor);
  }

  applyHoverStyle() {
    this._sprite.texture = BlochSphere.iconHover;

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
    this._sprite.texture = BlochSphere.iconGrabbed;

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
    this._sprite.texture = BlochSphere.iconActive;

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
    if (this.style.cornerRadius !== null) {
      this._shape.drawRoundedRect(
        0,
        0,
        this.sizeInPx,
        this.sizeInPx,
        this.style.cornerRadius
      );
    }
    this._shape.endFill();
  }

  toCircuitJSON() {
    return '"Bloch"';
  }
}
