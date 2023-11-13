import { Constructor } from "./constructor";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export declare class CircularGate {
  static style: { [key: string]: number | string };
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function CircularGateMixin<TBase extends Constructor<Gate>>(
  Base: TBase
): Constructor<CircularGate> & TBase {
  class CircularGateMixinClass extends Base {
    static style = {
      idleBodyColor: tailwindColors.emerald["500"],
      idleBorderColor: tailwindColors.emerald["700"],
      idleBorderWidth: 2,
      hoverBodyColor: tailwindColors.emerald["500"],
      hoverBorderColor: tailwindColors.purple["500"],
      hoverBorderWidth: 2,
      grabbedBodyColor: tailwindColors.purple["500"],
      grabbedBorderColor: tailwindColors.purple["700"],
      grabbedBorderWidth: 2,
      activeBodyColor: tailwindColors.emerald["500"],
      activeBorderColor: tailwindColors.teal["300"],
      activeBorderWidth: 2,
      cornerRadius: 9999,
    };

    get style(): typeof CircularGateMixinClass.style {
      return CircularGateMixinClass.style;
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

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
