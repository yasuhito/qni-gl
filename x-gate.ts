import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import * as tailwindColors from "tailwindcss/colors";

export class XGate extends Gate {
  // FIXME: XGate ではなく Mixin (SquareShape, CircularShape) で cornerRadius を設定する
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
  static icon = PIXI.Texture.from("./assets/X.svg");
}
