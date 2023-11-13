import * as tailwindColors from "tailwindcss/colors";
import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { Gate } from "./gate";
import { Graphics } from "pixi.js";

export declare class SquareGate {
  static style: { [key: string]: number | string };
  style: { [key: string]: number | string };
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function SquareGateMixin<TBase extends Constructor<Gate>>(
  Base: TBase
): Constructor<SquareGate> & TBase {
  class SquareGateMixinClass extends Base {
    static style = {
      idleBodyColor: Colors.bg.brand.default,
      idleBorderColor: Colors.border.gate.idle,
      idleBorderWidth: 2,
      hoverBodyColor: Colors.bg.brand.hover,
      hoverBorderColor: tailwindColors.purple["500"],
      hoverBorderWidth: 2,
      grabbedBodyColor: Colors.bg.brand.grabbed,
      grabbedBorderColor: tailwindColors.purple["700"],
      grabbedBorderWidth: 2,
      activeBodyColor: Colors.bg.brand.active,
      activeBorderColor: tailwindColors.teal["300"],
      activeBorderWidth: 2,
      cornerRadius: 4,
    };

    get style(): typeof SquareGateMixinClass.style {
      return SquareGateMixinClass.style;
    }

    applyIdleStyle() {
      this._shape.clear();
      this._shape.zIndex = 0;
      this._shape.cursor = "default";

      this.updateGraphics(
        this.style.idleBodyColor,
        this.style.idleBorderColor,
        this.style.idleBorderWidth
      );
    }

    applyHoverStyle() {
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
      bodyColor: string,
      borderColor: string,
      borderWidth: number
    ) {
      this._shape.lineStyle(borderWidth, borderColor, 1, 0);
      this._shape.beginFill(bodyColor, 1);
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

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
