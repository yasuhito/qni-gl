import * as tailwindColors from "tailwindcss/colors";

export const Colors = {
  bg: tailwindColors.white,
  "bg.brand": tailwindColors.sky["500"],
  "bg.brand.hover": tailwindColors.sky["600"],
  "bg.brand.grabbed": tailwindColors.purple["500"],
  "bg.brand.active": tailwindColors.sky["500"],
  border: tailwindColors.sky["700"],
  "border.gate": tailwindColors.sky["700"],
};

export const ColorsOld = {
  bg: {
    wire: {
      classical: tailwindColors.zinc["300"],
      quantum: tailwindColors.zinc["900"],
    },
  },
  border: {
    gate: {
      idle: tailwindColors.sky["700"],
      hover: tailwindColors.purple["500"],
      grabbed: tailwindColors.purple["600"],
      active: tailwindColors.teal["300"],
    },
    gateSource: {
      default: tailwindColors.zinc["300"],
    },
    qubitCircle: {
      default: tailwindColors.zinc["500"],
      disabled: tailwindColors.zinc["200"],
    },
    stateVector: {
      default: tailwindColors.zinc["400"],
    },
  },
  icon: {
    default: tailwindColors.zinc["900"],
    gate: {
      default: tailwindColors.white,
      secondary: tailwindColors.sky["500"],
    },
  },
};

export type WireColor =
  | typeof ColorsOld.bg.wire.classical
  | typeof ColorsOld.bg.wire.quantum;

export const FULL_OPACITY = 1;
