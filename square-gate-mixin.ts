import { Constructor } from "./constructor";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export declare class SquareGate {
  static style: { [key: string]: number | string };
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
  }

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
