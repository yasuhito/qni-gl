import * as tailwindColors from "tailwindcss/colors";

export const Colors = {
  bg: {
    default: {
      default: tailwindColors.white
    },
    brand: {
      default: tailwindColors.sky["500"],
      hover: tailwindColors.sky["600"],
      grabbed: tailwindColors.purple["500"],
      active: tailwindColors.sky["500"],
    },
  },
  border: {
    gate: {
      idle: tailwindColors.sky["700"],
      hover: tailwindColors.purple["500"],
      grabbed: tailwindColors.purple["600"],
      active: tailwindColors.teal["300"],
    },
    qubitCircle: {
      default: tailwindColors.zinc["500"],
      disabled: tailwindColors.zinc["200"]
    },
    stateVector: {
      default: tailwindColors.zinc["400"],
    }
  },
  icon: {
    default: tailwindColors.zinc["900"],
    gate: {
      default: tailwindColors.white,
      secondary: tailwindColors.sky["500"],
    },
  },
};
