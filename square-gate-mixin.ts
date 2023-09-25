import { Constructor } from "./constructor";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export declare class SquareGate {
  static style: { [key: string]: number | string };
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
      cornerRadius: 4,
    };

    applyIdleStyle() {
      this.graphics.clear();
      this.graphics.zIndex = 0;
      this.graphics.cursor = "default";

      const klass = this.constructor as typeof SquareGateMixinClass;
      this.updateGraphics(
        klass.style.idleBodyColor,
        klass.style.idleBorderColor,
        klass.style.idleBorderWidth
      );
    }

    applyHoverStyle() {
      this.graphics.clear();
      this.graphics.zIndex = 0;
      this.graphics.cursor = "grab";

      const klass = this.constructor as typeof SquareGateMixinClass;
      this.updateGraphics(
        klass.style.hoverBodyColor,
        klass.style.hoverBorderColor,
        klass.style.hoverBorderWidth
      );
    }

    applyGrabbedStyle() {
      this.graphics.clear();
      this.graphics.zIndex = 10;
      this.graphics.cursor = "grabbing";

      const klass = this.constructor as typeof SquareGateMixinClass;
      this.updateGraphics(
        klass.style.grabbedBodyColor,
        klass.style.grabbedBorderColor,
        klass.style.grabbedBorderWidth
      );
    }

    applyActiveStyle() {
      this.graphics.clear();
      this.graphics.zIndex = 0;
      this.graphics.cursor = "grab";

      const klass = this.constructor as typeof SquareGateMixinClass;
      this.updateGraphics(
        klass.style.activeBodyColor,
        klass.style.activeBorderColor,
        klass.style.activeBorderWidth
      );
    }

    private updateGraphics(
      bodyColor: string,
      borderColor: string,
      borderWidth: number
    ) {
      const klass = this.constructor as typeof SquareGateMixinClass;

      this.graphics.lineStyle(borderWidth, borderColor, 1, 0);
      this.graphics.beginFill(bodyColor, 1);
      this.graphics.drawRoundedRect(
        0,
        0,
        Gate.size,
        Gate.size,
        klass.style.cornerRadius
      );
      this.graphics.endFill();
    }
  }

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
