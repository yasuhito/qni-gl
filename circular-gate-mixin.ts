import { Constructor } from "./constructor";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export declare class CircularGate {
  static style: { [key: string]: number | string };
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
  }

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
