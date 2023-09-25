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
      idleBorderColor: tailwindColors.emerald["600"],
      idleBorderWidth: 1,
      hoverBodyColor: tailwindColors.emerald["500"],
      hoverBorderColor: tailwindColors.purple["500"],
      hoverBorderWidth: 2,
      grabbedBodyColor: tailwindColors.purple["500"],
      grabbedBorderColor: tailwindColors.purple["600"],
      grabbedBorderWidth: 1,
      activeBodyColor: tailwindColors.emerald["500"],
      activeBorderColor: tailwindColors.teal["300"],
      activeBorderWidth: 2,
      cornerRadius: 9999,
    };

    get style(): typeof CircularGateMixinClass.style {
      return CircularGateMixinClass.style;
    }

    applyIdleStyle() {
      this.graphics.clear();
      this.graphics.zIndex = 0;
      this.graphics.cursor = "default";

      this.updateGraphics(
        this.style.idleBodyColor,
        this.style.idleBorderColor,
        this.style.idleBorderWidth
      );
    }

    applyHoverStyle() {
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
      this.graphics.clear();
      this.graphics.zIndex = 0;
      this.graphics.cursor = "grab";

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
      this.graphics.lineStyle(borderWidth, borderColor, 1, 0);
      this.graphics.beginFill(bodyColor, 1);
      this.graphics.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        this.style.cornerRadius
      );
      this.graphics.endFill();
    }
  }

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
