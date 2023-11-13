import * as tailwindColors from "tailwindcss/colors";

export const Colors = {
  bg: {
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
  },
  icon: {
    gate: {
      default: tailwindColors.white,
      secondary: tailwindColors.sky["500"],
    },
  },
};
