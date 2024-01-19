import * as tailwindColors from "tailwindcss/colors";

export const Colors = {
  bg: {
    default: tailwindColors.white,
    brand: {
      default: tailwindColors.sky["500"],
      hover: tailwindColors.sky["600"],
      grabbed: tailwindColors.purple["500"],
      active: tailwindColors.sky["500"],
    },
    wire: {
      classical: tailwindColors.zinc["300"],
      quantum: tailwindColors.zinc["900"],
    },
    blochSphere: {
      body: {
        default: tailwindColors.white,
        hover: tailwindColors.purple[50],
        grabbed: tailwindColors.white,
        active: tailwindColors.white,
      },
      lines: tailwindColors.zinc["300"],
      vectorEnd: {
        get inactive() {
          return Colors.bg.brand.default;
        },
      },
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
  | typeof Colors.bg.wire.classical
  | typeof Colors.bg.wire.quantum;

export const FULL_OPACITY = 1;
